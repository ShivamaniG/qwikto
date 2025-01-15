// const Order = require("../models/orderModel");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// exports.placeOrder = async (req, res) => {
//     const { user_id, products, delivery_partner_tip, delivery_instructions, payment_mode } = req.body;

//     try {
//         const order = new Order({
//             user_id,
//             products,
//             delivery_partner_tip,
//             delivery_instructions,
//             payment_mode,
//         });

//         if (payment_mode !== "cash_on_delivery") {
//             const amount = products.reduce((total, product) => total + (product.quantity * product.product_price), 0) + delivery_partner_tip;

//             const razorpayOrder = await razorpay.orders.create({
//                 amount: amount * 100, // Amount in paise
//                 currency: "INR",
//                 receipt: `order_${new Date().getTime()}`,
//                 payment_capture: 1,
//             });

//             order.razorpay_order_id = razorpayOrder.id;

//             await order.save();

//             return res.status(200).json({
//                 message: "Order placed successfully. Please proceed with payment.",
//                 order_id: razorpayOrder.id,
//                 amount,
//                 currency: "INR",
//                 order,
//             });
//         } else {
//             order.payment_status = "pending";
//             await order.save();

//             res.status(200).json({ message: "Order placed successfully. Payment due on delivery.", order });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.verifyRazorpayPayment = async (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     try {
//         const order = await Order.findOne({ razorpay_order_id });

//         if (!order) {
//             return res.status(404).json({ error: "Order not found" });
//         }

//         const body = razorpay_order_id + "|" + razorpay_payment_id;
//         const expectedSignature = crypto
//             .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//             .update(body.toString())
//             .digest("hex");

//         if (expectedSignature === razorpay_signature) {
//             order.razorpay_payment_id = razorpay_payment_id;
//             order.razorpay_signature = razorpay_signature;
//             order.payment_status = "completed";
//             await order.save();

//             res.status(200).json({ message: "Payment successful", order });
//         } else {
//             res.status(400).json({ error: "Payment verification failed" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
