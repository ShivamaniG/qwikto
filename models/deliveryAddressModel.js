const mongoose = require("mongoose");

const deliveryAddressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isHome: { type: Boolean, required: true },  // True if Home, False if Office
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    houseNo: { type: String, required: true },
    areaSector: { type: String, required: true },
    landmark: { type: String, required: true },
});

const DeliveryAddress = mongoose.model("DeliveryAddress", deliveryAddressSchema);

module.exports = DeliveryAddress;
