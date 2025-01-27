const mongoose = require("mongoose");

const deliveryAddressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressType: {  
      type: String,
      required: true
    },
    houseNo: { type: String, required: false },
    areaSector: { type: String, required: true },
    landmark: { type: String, required: true },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    postcode: { type: String, required: false },
    location: {   
      type: {
        type: String,
        enum: ['Point'], 
        required: true
      },
      coordinates: {
        type: [Number],  
        required: true
      }
    }
  });

deliveryAddressSchema.index({ location: "2dsphere" });

const DeliveryAddress = mongoose.model("DeliveryAddress", deliveryAddressSchema);

module.exports = DeliveryAddress;
