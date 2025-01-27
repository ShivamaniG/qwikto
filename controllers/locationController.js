const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// OlaMaps API endpoint (replace with actual URL from OlaMaps documentation)
// const OLA_MAPS_URL = "https://api.ola.com/maps/location";

// exports.getLocationFromAddress = async (req, res) => {
//     const { address } = req.body;  // Address entered by user

//     if (!address) {
//         return res.status(400).json({ error: "Address is required" });
//     }

//     try {
//         const response = await axios.get(`${OLA_MAPS_URL}`, {
//             params: {
//                 address: address,
//                 apiKey: process.env.OLA_API_KEY,
//             }
//         });

//         const { lat, lon } = response.data;  // Assuming API returns lat & lon

//         res.status(200).json({
//             message: "Location retrieved successfully",
//             latitude: lat,
//             longitude: lon,
//         });
//     } catch (error) {
//         res.status(400).json({
//             error: "Failed to retrieve location",
//             message: error.message,
//         });
//     }
// };

// exports.setLocationManually = async (req, res) => {
//     const { latitude, longitude } = req.body;  // Latitude and longitude entered manually

//     if (!latitude || !longitude) {
//         return res.status(400).json({ error: "Latitude and Longitude are required" });
//     }

//     // Optionally, you could store these coordinates in the database
//     res.status(200).json({
//         message: "Location set successfully",
//         latitude: latitude,
//         longitude: longitude,
//     });
// };
