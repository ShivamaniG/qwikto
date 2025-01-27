const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        unique: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_img: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_stocks: {
        type: Number,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    save_ruppee: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    bestseller: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
