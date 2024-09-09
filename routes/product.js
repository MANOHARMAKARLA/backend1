const express = require('express');
const pool = require('../config/con');
const mysql = require('mysql');

const app = express.Router();

// Middleware to parse JSON bodies
app.use(express.json());

// Show All Products
app.get('/', (req, res) => {
    pool.query('SELECT * FROM services', (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: 'Error fetching products' });
        }
        res.json(results);
    });
});

// Fetch a Single Product by ID
app.get('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM services WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ error: 'Error fetching product' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(results[0]);
    });
});

// Add a New Product
app.post('/', (req, res) => {
    const { category, min_range, max_range, price, extra, type } = req.body;
    
    if (!category || !min_range || !max_range || !price || !type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO services (category, min_range, max_range, price, extra, type) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(query, [category, min_range, max_range, price, extra, type], (err, results) => {
        if (err) {
            console.error("Error adding product:", err);
            return res.status(500).json({ error: 'Error adding product' });
        }
        res.status(201).json({ id: results.insertId });
    });
});

// Delete a Product by ID
app.delete('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM services WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({ error: 'Error deleting product' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
       


        res.status(200).json({ message: 'Product successfully deleted' });
    });
});

module.exports = app;
