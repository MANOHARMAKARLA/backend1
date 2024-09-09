const express = require('express');
const pool = require('../config/con');
const mysql = require('mysql');

const app = express.Router();

// Profile route
app.get('/:email', (req, res) => {
    const userEmail = req.params.email;

    // Ensure the email parameter is provided
    if (!userEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Get connection from the pool
    pool.getConnection((err, conn) => {
        if (err) {
            console.log("Database connection error");
            return res.status(500).json({ error: "Database connection error" });
        }

        // SQL query to retrieve the user profile
        const sql = `SELECT UserName, FirstName, LastName, Email, Gender, Phone 
                     FROM User WHERE Email = ${mysql.escape(userEmail)}`;

        conn.query(sql, (err, result) => {
            conn.release();

            if (err) {
                console.log("Error retrieving profile details");
                return res.status(500).json({ error: "Error retrieving profile details" });
            }

            if (result.length > 0) {
                return res.status(200).json(result[0]);
            } else {
                return res.status(404).json({ error: "User not found" });
            }
        });
    });
});

module.exports = app;
