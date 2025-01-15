require("dotenv").config();
const express = require("express");
// const authMiddleware = require("./middlewares/authMiddleware");
const connectDB = require("./config/db");
const locationRoutes = require('./routes/locationRoutes');
const productRoutes = require("./routes/productRoutes");
const deliveryAddressRoutes = require("./routes/deliveryAddressRoutes");
// const orderRoutes = require("./routes/orderRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const cors = require("cors");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
// app.use(authMiddleware);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/location", locationRoutes);
app.use("/api", productRoutes);
app.use("/api", deliveryAddressRoutes);
app.use("/api", cartRoutes);
// app.use("/api", orderRoutes);


module.exports = app;
