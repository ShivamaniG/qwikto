const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const { uploadToCloudinary } = require("../config/uploadToS3");
const { upload } = require('../config/upload');  // Correct import
const connectDB = require("../config/db"); 
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); 
};

// Send OTP function
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
        const otp = generateOTP();

        res.status(200).json({ success: true, message: `OTP sent: ${otp}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { otp, phoneNumber } = req.body;

        if (!otp || !phoneNumber) {
            return res.status(400).json({ success: false, message: "OTP and phone number are required" });
        }
        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.signup = async (req, res) => {
  const { name, email, password, phone, termsAccepted } = req.body;

  if (!termsAccepted) {
      return res.status(400).json({ error: "You must accept the terms and conditions." });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = await connectDB();

      const query = `INSERT INTO users (name, email, phone, password, termsAccepted) VALUES (?, ?, ?, ?, ?)`;
      await connection.execute(query, [name, email, phone, hashedPassword, termsAccepted]);

      res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
  }
};

exports.uploadProfilePic = async (req, res) => {
  upload.single('profilePic')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const profilePicUrl = await uploadToCloudinary(req.file);
      const connection = await connectDB();
      const query = `UPDATE users SET profilePic = ? WHERE id = ?`;
      await connection.execute(query, [profilePicUrl, userId]);

      res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePicUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading profile picture" });
    }
  });
};

exports.googleAuth = async (req, res) => {
    const { idToken } = req.body; // Google ID token from the client

    if (!idToken) {
        return res.status(400).json({ error: "ID token is required" });
    }

    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        // Verify the ID token using Google Auth Library
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,  // Your Google Client ID
        });

        const payload = ticket.getPayload();
        const userId = payload.sub; 

        // Check if the user already exists in the database
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [payload.email]);

        if (rows.length === 0) {
            // If user doesn't exist, create a new one
            const query = `
                INSERT INTO users (name, email, oauthProvider)
                VALUES (?, ?, ?)
            `;
            await connection.execute(query, [payload.name, payload.email, 'google']);
        }

        res.status(200).json({
            message: "Google authentication successful",
            user: payload,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: "Google authentication failed",
            message: error.message,
        });
    }
};
