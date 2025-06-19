const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const pool = require("../models/db");

const router = express.Router();

// ✅ Add item to cart
router.post("/add", verifyToken, async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
            [user_id, product_id, quantity]
        );
        res.status(201).json({ message: "✅ Added to cart!", cartItem: result.rows[0] });
    } catch (err) {
        console.error("❌ Database error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Fetch user's cart
router.get("/list", verifyToken, async (req, res) => {
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            "SELECT cart.id, products.name, products.price_per_unit, cart.quantity FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = $1",
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("❌ Database error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Remove item from cart
router.delete("/remove/:cart_id", verifyToken, async (req, res) => {
    const { cart_id } = req.params;

    try {
        const result = await pool.query("DELETE FROM cart WHERE id = $1 RETURNING *", [cart_id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "❌ Item not found in cart" });
        }
        res.json({ message: "✅ Item removed!", cartItem: result.rows[0] });
    } catch (err) {
        console.error("❌ Database error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
