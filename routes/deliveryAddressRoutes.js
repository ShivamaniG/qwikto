const express = require("express");
const deliveryAddressController = require("../controllers/deliveryAddressController");
const router = express.Router();

// Add new delivery address
router.post("/address", deliveryAddressController.addAddress);

// Get all delivery addresses for a user
router.get("/address/:user_id", deliveryAddressController.getAllAddresses);

// Update delivery address
router.put("/address/:address_id", deliveryAddressController.updateAddress);

// Delete a delivery address
router.delete("/address/:address_id", deliveryAddressController.deleteAddress);

module.exports = router;
