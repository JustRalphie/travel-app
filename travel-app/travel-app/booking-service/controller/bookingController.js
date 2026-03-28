const Booking = require("../models/bookingModel");

exports.createBooking = async (req, res) => {
  try {
    const { user_id, trip_id, booking_name } = req.body;

    if (!user_id || !trip_id || !booking_name || !booking_name.trim()) {
      return res.status(400).json({ error: "user_id, trip_id and booking_name are required" });
    }

    const booking = await Booking.create({
      user_id,
      trip_id,
      booking_name: booking_name.trim(),
      status: "confirmed"
    });

    res.json({
      status: "booking confirmed",
      booking
    });
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("GET BOOKINGS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};