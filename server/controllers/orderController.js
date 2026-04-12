const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");

const allowedStatuses = ["Pending", "Confirmed", "Shipped", "Delivered"];

const buildOrderItems = async (items) => {
  const productMap = new Map();

  for (const item of items) {
    if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
      continue;
    }

    const quantity = Number(item.quantity || 1);
    if (quantity <= 0) {
      continue;
    }

    const existing = productMap.get(String(item.productId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      productMap.set(String(item.productId), {
        productId: String(item.productId),
        quantity
      });
    }
  }

  const orderItems = [];

  for (const value of productMap.values()) {
    const product = await Product.findById(value.productId);
    if (!product) {
      continue;
    }

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: value.quantity
    });
  }

  return orderItems;
};

const createOrder = asyncHandler(async (req, res) => {
  let orderItems = [];

  if (Array.isArray(req.body.products) && req.body.products.length) {
    orderItems = await buildOrderItems(req.body.products);
  } else {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.product");
    if (cart && Array.isArray(cart.items)) {
      orderItems = cart.items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));
    }
  }

  if (!orderItems.length) {
    res.status(400).json({ message: "No valid items found for order." });
    return;
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    userId: req.user.id,
    products: orderItems,
    totalAmount,
    status: "Pending"
  });

  await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] }, { upsert: true });

  res.status(201).json({
    message: "Order created successfully.",
    orderId: order._id,
    order
  });
});

const getOrdersByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Invalid user id." });
    return;
  }

  const requestingOwnOrders = req.user.id === userId;
  const isAdmin = req.user.role === "admin";

  if (!requestingOwnOrders && !isAdmin) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid order id." });
    return;
  }

  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ message: "Invalid status value." });
    return;
  }

  const order = await Order.findById(id);

  if (!order) {
    res.status(404).json({ message: "Order not found." });
    return;
  }

  order.status = status;
  await order.save();

  res.status(200).json(order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.status(200).json(orders);
});

module.exports = {
  createOrder,
  getOrdersByUser,
  updateOrderStatus,
  getAllOrders
};
