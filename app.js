require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const locationRoutes = require('./routes/locationRoutes');
const cors = require("cors");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/location", locationRoutes);


module.exports = app;
