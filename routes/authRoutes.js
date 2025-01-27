const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController"); 

router.post("/sendOtp", authController.sendOTP);
router.post("/verifyOtp",authController.verifyOTP);
router.post("/signup", authController.signup);
router.post("/googleAuth", authController.googleAuth); 
module.exports = router;
