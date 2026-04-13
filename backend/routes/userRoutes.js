const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/user/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        //Registration logic 
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ massage: "User already exists" });

        user = new User({ name, email, password });
        await user.save();

        // Create JWT Payload
        const payload = {user : {id: user._id, role: user.role}};

        // sign and return the tocken along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "70h"}, (err, token) => {
            if(err) throw err;

            // send the user and tocken in responce
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            });
        });

    } catch (error) {
        console.log(error);
        res.send(500).send("Server Error");
    }
});

// @route POST /api/user/login
// @desc Authenticativ user
// @access Public 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // find the user by email
        let user = await User.findOne({ email });

        if(!user) return res.status(400).json({ message: "Invalid Credentials" });
        const isMatch = await user.matchPassword(password);

        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Create JWT Payload
        const payload = {user : {id: user._id, role: user.role}};

        // sign and return the tocken along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "70h"}, (err, token) => {
            if(err) throw err;

            // send the user and tocken in responce
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            });
        });

    }catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// @route   PUT /api/user/change-password
// @desc    Update user password
// @access  Private
router.put("/change-password", protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // 1. Find the user by ID (req.user is available because of the 'protect' middleware)
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Check if the current password is correct
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // 3. Set and save the new password
        // (The password will be hashed automatically by your User model's pre-save hook)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route POST /api/user/profile 
// @desc GET logged-IN user's profile [protected Route]
// @access Privite
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;