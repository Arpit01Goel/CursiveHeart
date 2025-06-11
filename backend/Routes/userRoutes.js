const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
require("dotenv").config();
const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        
        const { username, password } = req.body; // Extract username and password from the request body
        const user = await User.findOne({username, password});
        if (!user) {
            return res.status(404).send({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET , {
            expiresIn: "1h"
        })
        
        return res.status(200).send({ message: "Login successful", token });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
})
router.post("/signup", async (req, res) => {
    const { name, username, password } = req.body; // Extract user details from the request body.

    try {
        // console.log("user requested me");
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ message: "Username already exists" });
        }

        // Create a new user
        const newUser = new User({ name, username, password });
        await newUser.save(); // Save the user to the database

        res.status(201).send({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).send({ message: "Error registering user", error });
    }
});

router.get("/userinfo", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
        
        if (!token) {
            return res.status(401).send({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const user = await User.findById(decoded.id).select("-password"); // Fetch user info, excluding the password
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Error fetching user information", error });
    }
});

module.exports = router;