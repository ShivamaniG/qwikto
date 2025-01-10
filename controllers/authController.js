const admin = require("../config/firebase");
const User = require("../models/userModel");
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require("bcryptjs");

exports.sendOtp = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    try {
        const verificationId = `dummyVerificationId_${phoneNumber}`;
        res.status(200).json({
            message: "OTP sent successfully",
            verificationId,
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to send OTP",
            message: error.message,
        });
    }
};

exports.verifyOtp = async (req, res) => {
    const { verificationId, otpCode } = req.body;

    if (!verificationId || !otpCode) {
        return res.status(400).json({ error: "Verification ID and OTP code are required" });
    }

    try {
        // Simulating OTP verification (Firebase client-side SDK should handle this)
        if (otpCode === "123456") { 
            const customToken = await admin.auth().createCustomToken(verificationId);
            res.status(200).json({ message: "OTP verified successfully", token: customToken });
        } else {
            throw new Error("Invalid OTP");
        }
    } catch (error) {
        res.status(400).json({
            error: "Failed to verify OTP",
            message: error.message,
        });
    }
};

exports.signup = async (req, res) => {
    const { name, email, password, phone, termsAccepted } = req.body;

    if (!termsAccepted) {
        return res.status(400).json({ error: "You must accept the terms and conditions." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            termsAccepted,
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
    const { idToken } = req.body; // Google ID token from the client

    if (!idToken) {
        return res.status(400).json({ error: "ID token is required" });
    }

    try {
        // Verify the ID token using Google Auth Library
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,  // Your Google Client ID
        });

        const payload = ticket.getPayload();
        const userId = payload.sub; 

        const userRecord = await admin.auth().getUserByEmail(payload.email).catch(async (error) => {
            if (error.code === 'auth/user-not-found') {
                // If user doesn't exist, create a new one
                const newUser = await admin.auth().createUser({
                    email: payload.email,
                    emailVerified: true,
                    displayName: payload.name,
                    disabled: false,
                });
                return newUser;
            } else {
                throw error;
            }
        });

        // Create a Firebase custom token for the user
        const customToken = await admin.auth().createCustomToken(userId);

        res.status(200).json({
            message: "Google authentication successful",
            token: customToken,
        });
    } catch (error) {
        res.status(400).json({
            error: "Google authentication failed",
            message: error.message,
        });
    }
};