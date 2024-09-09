const express = require('express');
const router = express.Router();
const { queryDatabase } = require('../database');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const results = await queryDatabase('SELECT * FROM orders');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const results = await queryDatabase('SELECT * FROM orders WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order' });
    }
});

// Create a new order
router.post('/', async (req, res) => {
    const { userId, productId, quantity, totalPrice } = req.body;
    try {
        const result = await queryDatabase('INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)', [userId, productId, quantity, totalPrice]);
        res.status(201).json({ id: result.insertId, message: 'Order created' });
    } catch (err) {
        res.status(500).json({ error: 'Error creating order' });
    }
});

// Update an order
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId, productId, quantity, totalPrice } = req.body;
    try {
        const result = await queryDatabase('UPDATE orders SET user_id = ?, product_id = ?, quantity = ?, total_price = ? WHERE id = ?', [userId, productId, quantity, totalPrice, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating order' });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await queryDatabase('DELETE FROM orders WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting order' });
    }
});



// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const results = await queryDatabase('SELECT * FROM orders WHERE user_id = ?', [userId]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'No orders found for this user' });
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user orders' });
    }
});
module.exports = router;
