const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const serializeCart = (cartDoc) => {
  const items = (cartDoc.items || []).map((item) => {
    const product = item.product;
    return {
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity
    };
  });

  const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    userId: cartDoc.userId,
    items,
    totalAmount
  };
};

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ userId: req.user.id, items: [] });
    cart = await Cart.findById(cart._id).populate("items.product");
  }

  res.status(200).json(serializeCart(cart));
});

const upsertCart = asyncHandler(async (req, res) => {
  const payloadItems = Array.isArray(req.body.items) ? req.body.items : [];

  const normalized = [];

  for (const item of payloadItems) {
    const productId = item.productId || item.id;
    const quantity = Number(item.quantity || 1);

    if (!productId || quantity <= 0 || !mongoose.Types.ObjectId.isValid(productId)) {
      continue;
    }

    const exists = await Product.exists({ _id: productId });
    if (!exists) {
      continue;
    }

    normalized.push({ product: productId, quantity });
  }

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { userId: req.user.id, items: normalized },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate("items.product");

  res.status(200).json(serializeCart(cart));
});

module.exports = {
  getCart,
  upsertCart
};
