const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/place", orderController.placeOrder);
router.post("/verify-payment", orderController.verifyPayment);

module.exports = router;
