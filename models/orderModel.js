const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
        }
    ],
    delivery_instructions: { type: String, default: "" },
    delivery_tip: { type: Number, default: 0 },
    coupon: { type: String, default: "" },
    discount: { type: Number, default: 0 },
    bill_summary: {
        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    payment_method: { type: String, required: true }, // e.g., "UPI", "Card", "Net Banking"
    payment_status: { type: String, default: "Pending" }, // e.g., "Success", "Failed"
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
