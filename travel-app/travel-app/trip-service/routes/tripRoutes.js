const express = require("express");
const router = express.Router();
const controller = require("../controller/tripController");

router.post("/", controller.createTrip);
router.post("/:tripId/destinations", controller.addDestination);
router.get("/:tripId/itinerary", controller.getItinerary);
router.patch("/:tripId", controller.updateTrip);
router.delete("/:tripId/destinations/:destinationId", controller.deleteDestination);

module.exports = router;