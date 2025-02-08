const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const path = require('path');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dot6dzqn6',   // Replace with your Cloudinary cloud name
  api_key: '413368129767412',         // Replace with your Cloudinary API key
  api_secret: 'Zue_wadirin40OaJyqhcFcPvdpg',   // Replace with your Cloudinary API secret
});


const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const fileName = `${Date.now()}-${path.basename(file.originalname)}`;
  
      cloudinary.uploader.upload_stream(
        { 
          public_id: fileName, 
          resource_type: 'auto' 
        },
        (error, result) => {
          if (error) {
            reject(new Error('Error uploading file to Cloudinary'));
          } else {
            resolve(result.secure_url);  // Return the secure URL of the uploaded image
          }
        }
      ).end(file.buffer);  // Upload the file buffer directly to Cloudinary
    });
  };
  
  module.exports = { uploadToCloudinary };



