const mongoose = require("mongoose");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, sort } = req.query;
  const query = {};

  if (category && category !== "All") {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { name: regex },
      { category: regex },
      { description: regex },
      { artisan: regex },
      { location: regex }
    ];
  }

  let sortQuery = { popularity: -1, createdAt: -1 };

  if (sort === "low-high") {
    sortQuery = { price: 1 };
  } else if (sort === "high-low") {
    sortQuery = { price: -1 };
  } else if (sort === "newest") {
    sortQuery = { launchedAt: -1, createdAt: -1 };
  }

  const products = await Product.find(query).sort(sortQuery);
  res.status(200).json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid product id." });
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  res.status(200).json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, description, image, artisan, location } = req.body;

  if (!name || !price || !category || !description || !image || !artisan || !location) {
    res.status(400).json({ message: "All product fields are required." });
    return;
  }

  const product = await Product.create({
    name,
    price,
    category,
    description,
    image,
    artisan,
    location,
    popularity: Number(req.body.popularity || 0),
    launchedAt: req.body.launchedAt || Date.now()
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid product id." });
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  Object.assign(product, req.body);
  await product.save();
  res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid product id." });
    return;
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404).json({ message: "Product not found." });
    return;
  }

  res.status(200).json({ message: "Product deleted successfully." });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
