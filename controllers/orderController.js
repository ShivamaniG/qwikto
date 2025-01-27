const Razorpay = require("razorpay");
const crypto = require("crypto");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

// Razorpay configuration
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.placeOrder = async (req, res) => {
    const { user_id, delivery_instructions, delivery_tip, coupon, payment_method } = req.body;

    try {
        // Validate user input
        if (!user_id || !payment_method) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        // Fetch cart details and calculate total amount
        const cart = await Cart.findOne({ user_id }).populate("products.product_id");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: "Cart is empty. Cannot place order." });
        }

        // Calculate bill summary (total amount, subtotal, etc.)
        const subtotal = cart.products.reduce((sum, p) => sum + p.product_id.product_price * p.quantity, 0);
        const discount = coupon ? calculateDiscount(subtotal, coupon) : 0;
        const tax = calculateTax(subtotal - discount);
        const totalAmount = Math.round(subtotal - discount + tax + delivery_tip); // Calculate total

        // Create Razorpay order (total in paise)
        let razorpayOrder;
        try {
            razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100, // Convert total to paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                notes: { user_id, coupon },
            });
            console.log("Razorpay Order Created:", razorpayOrder);
        } catch (razorpayError) {
            console.error("Razorpay API Error:", razorpayError);
            return res.status(500).json({ error: "Failed to create Razorpay order" });
        }

        // Save order to database
        const order = new Order({
            user_id,
            products: cart.products,
            delivery_instructions,
            delivery_tip,
            coupon,
            discount,
            bill_summary: { 
                subtotal, 
                tax, 
                total: totalAmount // Ensure the total is included here
            },
            payment_method,
            payment_status: "Pending",
            createdAt: new Date(),
        });

        await order.save();

        // Clear cart
        await Cart.deleteOne({ user_id });

        // Respond with Razorpay order ID and details
        res.status(200).json({
            message: "Order created. Complete payment to place order.",
            razorpayOrderId: razorpayOrder.id,
            amount: totalAmount,
            currency: "INR",
            order,
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message });
    }
};



// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    try {
        const generatedSignature = crypto
            .createHmac("sha256", "YOUR_RAZORPAY_SECRET")
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid payment signature" });
        }

        const order = await Order.findOne({ "bill_summary.total": req.body.amount / 100, payment_status: "Pending" });
        if (!order) {
            return res.status(404).json({ error: "Order not found or already completed" });
        }

        order.payment_status = "Success";
        await order.save();

        res.status(200).json({ message: "Payment verified and order placed successfully", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper Functions
function calculateDiscount(subtotal, coupon) {
    return coupon === "DISCOUNT10" ? subtotal * 0.1 : 0;
}

function calculateTax(amount) {
    return amount * 0.05;
}
