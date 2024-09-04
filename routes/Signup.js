const express = require("express");
const mySqlPool = require("../config/con");
var mysql = require("mysql");
const app = express.Router();
// const bcrypt = require("bcrypt-nodejs");

// var musers = require("../model/Musers");

//signUp
app.post("/", async (req, res) => {
    console.log("In Signup post");
    const role = "User"
    const sql1 = "INSERT into User (UserName, Password, Email, FirstName, LastName,  Gender, City, State, Zipcode, Role, Phone ) VALUES (" +
    
        mysql.escape(req.body.userName) + "," +
        mysql.escape(req.body.userPassword) + "," +
        mysql.escape(req.body.userEmail) + "," +
        mysql.escape(req.body.firstName) + "," +
        mysql.escape(req.body.lastName) + "," +
        mysql.escape(req.body.gender) + "," +
        mysql.escape(req.body.city) + "," +
        mysql.escape(req.body.state) + "," +
        mysql.escape(req.body.zipCode) + "," +
        mysql.escape(role) + "," +
        mysql.escape(req.body.userPhone) + ");";
        console.log(sql1);
    mySqlPool.getConnection((err, conn) => {
        if (err) {
            console.log("Error while connecting to database", err);
            res.writeHead(500, {
                'Content-type': 'text/plain'
            });
            res.end("Error in connecting to database");
        } else {
            console.log("Manohar Makarla");
            conn.query(sql1, async (err, result) => {
                if (err) {
                    res.writeHead(400, {
                        'Content-type': 'text/plain'
                    });
                    if (err.sqlMessage.includes("PRIMARY")) {
                        console.log("Use different username");
                        res.status(410).end("Use different username");
                    } else if (err.sqlMessage.includes("userEmail")) {
                        console.log("Use different userEmail");
                        res.status(411).end("Use different userEmail");
                    } else {
                         console.log(err);
                        res.end("Please try to signup again");
                    }
                } else {
                    conn.release();
                    message = {
                        status :200,
                        "message": "Success"
                    }
                    res.writeHead(200, {
                            'Content-type': 'text/plain'
                        });
                        // res.send(result[0].accountType)
                        res.end(JSON.stringify(message));
                        console.log("Signup successful");
                    // var new_user = new musers({
                    //     userName: req.body.userName,
                    //     firstName: req.body.firstName,
                    //     lastName: req.body.lastName,
                    //     profileImage: req.body.userImage
                    // });

                    // new_user.save((err) => {
                    //     if (err) {
                    //         console.log("Unable to tweet", err);
                    //         res.status(411).end("Unable to tweet");
                    //     } else {
                    //         console.log("Tweet success");
                    //         res.status(200).end("Tweeted successfully");
                    //     }
                    // });
                }
            });
        }
    });
});

module.exports = app;