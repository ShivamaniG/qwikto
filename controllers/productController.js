const Product = require("../models/productModel");

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    const {
        product_id,product_name, product_img, product_price, product_description, product_stocks,
        category, mrp, save_ruppee, discount, weight, bestseller
    } = req.body;

    try {
        const newProduct = new Product({
            product_id,product_name, product_img, product_price, product_description, product_stocks,
            category, mrp, save_ruppee, discount, weight, bestseller
        });

        await newProduct.save();
        res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    const { product_id } = req.params;

    try {
        const product = await Product.findOne({ product_id });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({
            message: "Product fetched successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { product_id } = req.params;
    const {
        product_img, product_name, product_price, product_description, product_stocks, category, 
        mrp, save_ruppee, discount, weight, bestseller
    } = req.body;

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { product_id },
            {
                product_img,product_name, product_price, product_description, product_stocks, category,
                mrp, save_ruppee, discount, weight, bestseller
            },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
