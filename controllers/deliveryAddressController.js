const axios = require('axios');  
const DeliveryAddress = require("../models/deliveryAddressModel");

exports.detectAddress = async (req, res) => {
    try {
        const { latitude, longitude, user_id } = req.body;

        if (!latitude || !longitude || !user_id) {
            return res.status(400).json({ success: false, message: "Latitude, Longitude, and user_id are required" });
        }

        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
        );

        const addressData = response.data;

        if (!addressData || !addressData.address) {
            return res.status(404).json({ success: false, message: "Unable to fetch address for the given location." });
        }

        const { house_number, neighbourhood, suburb, road, city, state, country, postcode } = addressData.address;

        const updatedAddress = {
            user_id,
            addressType: "Home", // Default to Home, adjust as needed
            houseNo: house_number || "",
            areaSector: neighbourhood || suburb || "",
            landmark: road || city || "",
            city: city || "",
            state: state || "",
            country: country || "",
            postcode: postcode || "",
            location: {
                type: 'Point',
                coordinates: [longitude, latitude], // Store as [longitude, latitude]
            },
        };

        const existingAddress = await DeliveryAddress.findOne({ user_id });

        let result;
        if (existingAddress) {
            // If an address exists, update it
            result = await DeliveryAddress.findByIdAndUpdate(
                existingAddress._id,
                updatedAddress,
                { new: true, runValidators: true }
            );
        } else {
            // If no address exists, create a new one
            result = new DeliveryAddress(updatedAddress);
            await result.save();
        }

        // Respond with success
        res.status(200).json({
            success: true,
            message: "Address detected and updated successfully",
            address: result,
        });
    } catch (error) {
        // Handle error
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addAddress = async (req, res) => {
    const { user_id, addressType, houseNo, areaSector, landmark } = req.body;

    if (!user_id || !addressType || !houseNo || !areaSector || !landmark) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const address = `${houseNo}, ${areaSector}, ${landmark}`;
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`
        );

        const addressData = response.data[0];

        if (!addressData || !addressData.lat || !addressData.lon) {
            throw new Error("Unable to fetch coordinates for the given address.");
        }

        const { lat, lon, address: fullAddress } = addressData;

        const city = fullAddress.city || fullAddress.town || fullAddress.village;
        const state = fullAddress.state;
        const country = fullAddress.country;
        const postcode = fullAddress.postcode;


        const newAddress = new DeliveryAddress({
            user_id,
            addressType,  
            houseNo,
            areaSector,
            landmark,
            city,
            state,
            country,
            postcode,
            location: {
                type: 'Point',
                coordinates: [lon, lat], 
            },
        });

        await newAddress.save();
        res.status(201).json({ success: true, message: "Address detected and added successfully", address: newAddress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
    const { addressType, houseNo, areaSector, landmark } = req.body;

    try {
        if (!address_id || !addressType || !houseNo || !areaSector || !landmark) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const updatedAddress = await DeliveryAddress.findByIdAndUpdate(
            address_id,
            { addressType, houseNo, areaSector, landmark },
            { new: true, runValidators: true } 
        );

        if (!updatedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.status(200).json({
            success: true,
            message: "Delivery address updated successfully",
            address: updatedAddress,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete Address Function
exports.deleteAddress = async (req, res) => {
    const { address_id } = req.params;

    try {
        if (!address_id) {
            return res.status(400).json({ error: "Address ID is required" });
        }

        const deletedAddress = await DeliveryAddress.findByIdAndDelete(address_id);

        if (!deletedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.status(200).json({
            success: true,
            message: "Delivery address deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};