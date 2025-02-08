const express = require("express");
const router = express.Router();
// const  upload  = require("../config/upload"); 
const authController = require("../controllers/authController"); 

router.post("/sendOtp", authController.sendOTP);
router.post("/verifyOtp",authController.verifyOTP);
router.post("/signup", authController.signup);
router.post("/upload", authController.uploadProfilePic);
router.post("/googleAuth", authController.googleAuth); 
module.exports = router;
