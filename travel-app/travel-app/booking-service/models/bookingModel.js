const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true
    },
    trip_id: {
      type: String,
      required: true
    },
    booking_name: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      default: "confirmed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);