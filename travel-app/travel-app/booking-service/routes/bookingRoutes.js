const express = require("express");
const router = express.Router();
const controller = require("../controller/bookingController");

router.post("/", controller.createBooking);
router.get("/", controller.getBookings);

module.exports = router;