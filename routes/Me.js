const express = require('express');
const pool = require('../config/con'); // Adjust the path based on your project structure
var mysql = require('mysql');

const app = express.Router();

// Get User Details Route
app.get('/', (req, res) => {


   // return res.status(200).json({ message: "Hello, World!" });


    console.log('me')
    // Ensure the username is provided
    if (!req.query.username) {
        res.status(400).json({ error: "Username query parameter is required" });
        console.log('hello') 
        return;
    }

    // Connection
    pool.getConnection((err, conn) => {
        if (err) {
              console.log('hello')
            console.error("Error while connecting to database:", err);
            res.status(500).json({ error: "Error while connecting to database" });
        } else {
            console.log('hello')
            // Query
            const sql = `SELECT UserName, FirstName, LastName, Email, Gender, Phone FROM User WHERE UserName = ?`;
            const username = req.query.username;

            conn.query(sql, [username], (err, result) => {
                conn.release();
                if (err) {
                    console.error("Database query error:", err);
                    res.status(400).json({ error: "Error retrieving user details" });
                } else {
                    if (result.length === 0) {
                        res.status(404).json({ error: "User not found" });
                    } else {
                        res.status(200).json(result[0]);
                    }
                }
            });
        }
    });


  
});

module.exports = app;
