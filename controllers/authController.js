// const admin = require("../config/firebase");
const User = require("../models/userModel");
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require("bcryptjs");


// const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");

exports.sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
    
        if (!phoneNumber) {
          return res.status(400).json({ success: false, message: "Phone number is required" });
        }
    
        const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/; // Allows international phone numbers
    
        if (!phoneNumberPattern.test(phoneNumber)) {
          return res.status(400).json({ success: false, message: "Invalid phone number format" });
        }
    
        res.status(200).json({ success: true, message: "OTP sent (client-side handling)" });
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
      }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "ID Token is required" });
    }

    const decodedIdToken = await admin.auth().verifyIdToken(idToken);

    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, sessionId: sessionCookie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }

};

exports.signup = async (req, res) => {
    const { name, email, password, phone, termsAccepted, profilePic } = req.body;

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
            profilePic, // Add profilePic field here
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
