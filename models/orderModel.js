const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
        }
    ],
    delivery_partner_tip: { type: Number, default: 0 },  // Tip for delivery partner
    delivery_instructions: { type: String, default: "" },  // Optional delivery instructions
    payment_mode: { 
        type: String, 
        enum: ["credit_card", "debit_card", "net_banking", "cash_on_delivery"], 
        required: true 
    },
    payment_status: { 
        type: String, 
        enum: ["pending", "completed", "failed"], 
        default: "pending" 
    },
    razorpay_order_id: { type: String, default: "" },
    razorpay_payment_id: { type: String, default: "" },
    razorpay_signature: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
