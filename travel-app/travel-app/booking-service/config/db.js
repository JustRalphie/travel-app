const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Booking DB connected");
  } catch (err) {
    console.error("Booking DB connection error:", err);
  }
};