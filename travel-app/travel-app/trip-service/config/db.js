const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/travelDB");
    console.log("MongoDB connected (Trip Service)");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};