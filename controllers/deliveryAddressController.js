const DeliveryAddress = require("../models/deliveryAddressModel");

exports.addAddress = async (req, res) => {
    const { user_id, isHome, name, contactNumber, houseNo, areaSector, landmark } = req.body;

    if (!user_id || !isHome || !name || !contactNumber || !houseNo || !areaSector || !landmark) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newAddress = new DeliveryAddress({
            user_id,
            isHome,
            name,
            contactNumber,
            houseNo,
            areaSector,
            landmark,
        });

        await newAddress.save();
        res.status(201).json({ message: "Delivery address added successfully", address: newAddress });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllAddresses = async (req, res) => {
    const { user_id } = req.params;

    try {
        const addresses = await DeliveryAddress.find({ user_id });
        if (!addresses.length) {
            return res.status(404).json({ error: "No addresses found for this user" });
        }
        res.status(200).json({ message: "Addresses fetched successfully", addresses });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    const { address_id } = req.params;
    const { isHome, name, contactNumber, houseNo, areaSector, landmark } = req.body;

    try {
        const updatedAddress = await DeliveryAddress.findByIdAndUpdate(
            address_id,
            { isHome, name, contactNumber, houseNo, areaSector, landmark },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.status(200).json({ message: "Delivery address updated successfully", address: updatedAddress });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteAddress = async (req, res) => {
    const { address_id } = req.params;

    try {
        const deletedAddress = await DeliveryAddress.findByIdAndDelete(address_id);

        if (!deletedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.status(200).json({ message: "Delivery address deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};