const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/cart", cartController.addToCart); // Add to cart
router.get("/cart/:user_id", cartController.viewCart); // View cart
router.put("/cart", cartController.updateCart); // Update cart quantity
router.delete("/cart", cartController.removeFromCart); // Remove from cart

module.exports = router;
