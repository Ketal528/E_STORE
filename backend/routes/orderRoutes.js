const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();;

// @route GET /api/orders/my-orders
// @dese Get logged-in user's orders
// @access private
router.get("/my-orders", protect, async (req, res) => {
    try {
        // find orders for the authenticated user
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        // sort by most recent orders
        res.json(orders);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route GET /api/orders/:id
// @dese Get order details by Id
// @access private
router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        // return the full order detalis
        res.json(order);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;