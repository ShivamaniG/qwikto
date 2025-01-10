const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.post("/getLocationFromAddress", locationController.getLocationFromAddress);

router.post("/setLocationManually", locationController.setLocationManually);

module.exports = router;
