const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

exports.addToCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    try {
        const product = await Product.findById(product_id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (product.product_stocks < quantity) {
            return res.status(400).json({ error: "Insufficient stock available" });
        }

        let cart = await Cart.findOne({ user_id });

        if (!cart) {
            cart = new Cart({ user_id, products: [] });
        }

        const productInCart = cart.products.find(p => p.product_id.toString() === product_id);

        if (productInCart) {
            productInCart.quantity += quantity;

            if (productInCart.quantity > product.product_stocks) {
                return res.status(400).json({ error: "Insufficient stock available" });
            }
        } else {
            cart.products.push({ product_id, quantity });
        }

        await cart.save();

        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.viewCart = async (req, res) => {
    const { user_id } = req.params;

    try {
        const cart = await Cart.findOne({ user_id }).populate("products.product_id");

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Check if the cart is empty
        if (cart.products.length === 0) {
            return res.status(200).json({ message: "Your cart is empty" });
        }

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user_id });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const productInCart = cart.products.find(p => p.product_id.toString() === product_id);

        if (!productInCart) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        const product = await Product.findById(product_id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (quantity > product.product_stocks) {
            return res.status(400).json({ error: "Insufficient stock available" });
        }

        productInCart.quantity = quantity;

        cart.products = cart.products.filter(p => p.quantity > 0); // Remove if quantity becomes zero

        await cart.save();

        res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    const { user_id, product_id } = req.body;

    try {
        const cart = await Cart.findOne({ user_id });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.products = cart.products.filter(p => p.product_id.toString() !== product_id);

        await cart.save();

        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
