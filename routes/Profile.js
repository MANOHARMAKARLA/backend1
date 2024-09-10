const express = require('express');
const pool = require('../config/con');
const mysql = require('mysql');

const app = express.Router();
app.use(express.json()); // To parse JSON bodies

// Profile route (Get profile)
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

// Update profile route
app.put('/:email', (req, res) => {
    const userEmail = req.params.email;
    const { UserName, FirstName, LastName, Gender, Phone } = req.body;

    // Ensure the email parameter and required fields are provided
    if (!userEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }

    if (!UserName || !FirstName || !LastName || !Gender || !Phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Get connection from the pool
    pool.getConnection((err, conn) => {
        if (err) {
            console.log("Database connection error");
            return res.status(500).json({ error: "Database connection error" });
        }

        // SQL query to update the user profile
        const sql = `UPDATE User SET 
                        UserName = ${mysql.escape(UserName)}, 
                        FirstName = ${mysql.escape(FirstName)}, 
                        LastName = ${mysql.escape(LastName)}, 
                        Gender = ${mysql.escape(Gender)}, 
                        Phone = ${mysql.escape(Phone)} 
                     WHERE Email = ${mysql.escape(userEmail)}`;

        conn.query(sql, (err, result) => {
            conn.release();

            if (err) {
                console.log("Error updating profile details");
                return res.status(500).json({ error: "Error updating profile details" });
            }

            if (result.affectedRows > 0) {
                return res.status(200).json({ message: "Profile updated successfully" });
            } else {
                return res.status(404).json({ error: "User not found" });
            }
        });
    });
});

module.exports = app;
