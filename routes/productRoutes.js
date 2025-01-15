const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
// const authMiddleware = require("../middlewares/authMiddleware");


router.get("/products" ,  productController.getAllProducts);
router.post("/products",  productController.addProduct);
router.get("/products/:product_id", productController.getProductById);
router.put("/products/:product_id", productController.updateProduct);

module.exports = router;
