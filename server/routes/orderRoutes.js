const express = require("express");
const { createOrder, getOrdersByUser, updateOrderStatus, getAllOrders } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:userId", protect, getOrdersByUser);
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;
