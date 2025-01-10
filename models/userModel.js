const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String },
    oauthProvider: { type: String, enum: ["google", "twitter"], default: null },
    termsAccepted: { type: Boolean, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;