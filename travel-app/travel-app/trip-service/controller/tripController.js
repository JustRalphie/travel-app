const mongoose = require("mongoose");
const Trip = require("../models/tripModel");

function getTripDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

async function validateRealPlace(placeQuery) {
  const q = placeQuery.trim();

  if (!q || q.length < 2) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
    q
  )}&limit=1&addressdetails=1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "TravelPlannerApp/1.0 (student-project)"
    }
  });

  if (!response.ok) {
    throw new Error("Place lookup failed");
  }

  const results = await response.json();

  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const place = results[0];
  const address = place.address || {};

  const shortName =
    address.city ||
    address.town ||
    address.village ||
    address.county ||
    address.state ||
    place.name ||
    place.display_name?.split(",")[0] ||
    q;

  return {
    destination: shortName,
    full_place_name: place.display_name || q,
    country: address.country || "",
    place_type: place.type || "",
    lat: Number(place.lat),
    lon: Number(place.lon)
  };
}

exports.createTrip = async (req, res) => {
  try {
    const { trip_name, start_date, end_date, budget, preferences } = req.body;

    if (!trip_name || !trip_name.trim()) {
      return res.status(400).json({ error: "Trip name is required" });
    }

    if (trip_name.trim().length > 80) {
      return res.status(400).json({ error: "Trip name cannot exceed 80 characters" });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({ error: "End date cannot be before start date" });
    }

    if (Number(budget) < 0) {
      return res.status(400).json({ error: "Budget cannot be negative" });
    }

    const trip = new Trip({
      trip_name: trip_name.trim(),
      start_date,
      end_date,
      budget: Number(budget) || 0,
      preferences: preferences || [],
      destinations: []
    });

    const savedTrip = await trip.save();

    res.json({
      status: "created",
      trip_id: savedTrip._id,
      trip_name: savedTrip.trip_name
    });
  } catch (err) {
    console.error("CREATE TRIP ERROR:", err);
    res.status(500).json({ error: "Failed to create trip" });
  }
};

exports.addDestination = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { destination, days, activities } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ error: "Invalid trip ID" });
    }

    if (!destination || !destination.trim()) {
      return res.status(400).json({ error: "Destination is required" });
    }

    if (destination.trim().length > 100) {
      return res.status(400).json({ error: "Destination is too long" });
    }

    if (!days || Number(days) <= 0) {
      return res.status(400).json({ error: "Days must be greater than 0" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const realPlace = await validateRealPlace(destination);

    if (!realPlace) {
      return res.status(400).json({ error: "Please enter a real existing place" });
    }

    const duplicate = trip.destinations.some(
      (d) =>
        d.full_place_name.toLowerCase() === realPlace.full_place_name.toLowerCase() ||
        d.destination.toLowerCase() === realPlace.destination.toLowerCase()
    );

    if (duplicate) {
      return res.status(400).json({ error: "Destination already exists in this trip" });
    }

    const tripDuration = getTripDuration(trip.start_date, trip.end_date);
    const usedDays = trip.destinations.reduce((sum, d) => sum + Number(d.days || 0), 0);
    const newTotalDays = usedDays + Number(days);

    if (newTotalDays > tripDuration) {
      return res.status(400).json({
        error: `Total destination days exceed trip duration (${tripDuration} days)`
      });
    }

    trip.destinations.push({
      destination: realPlace.destination,
      full_place_name: realPlace.full_place_name,
      country: realPlace.country,
      place_type: realPlace.place_type,
      lat: realPlace.lat,
      lon: realPlace.lon,
      days: Number(days),
      activities: activities || [],
      estimated_cost: Number(days) * 100
    });

    await trip.save();

    const added = trip.destinations[trip.destinations.length - 1];

    res.json({
      status: "destination added",
      trip_id: trip._id,
      destination_id: added._id,
      destination: added.destination,
      full_place_name: added.full_place_name,
      country: added.country
    });
  } catch (err) {
    console.error("ADD DESTINATION ERROR:", err);
    res.status(500).json({ error: "Failed to add destination" });
  }
};

exports.getItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ error: "Invalid trip ID" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    let day = 1;
    let total_estimated_cost = 0;
    const itinerary = [];

    trip.destinations.forEach((dest) => {
      for (let i = 0; i < dest.days; i++) {
        itinerary.push({
          day: day++,
          destination: dest.destination,
          full_place_name: dest.full_place_name,
          destination_id: dest._id,
          activities: dest.activities || []
        });
      }
      total_estimated_cost += dest.estimated_cost || 0;
    });

    res.json({
      trip_id: trip._id,
      trip_name: trip.trip_name,
      itinerary,
      total_estimated_cost,
      destinations: trip.destinations
    });
  } catch (err) {
    console.error("GET ITINERARY ERROR:", err);
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ error: "Invalid trip ID" });
    }

    if (req.body.budget !== undefined && Number(req.body.budget) < 0) {
      return res.status(400).json({ error: "Budget cannot be negative" });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(tripId, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json({
      status: "updated",
      trip: updatedTrip
    });
  } catch (err) {
    console.error("UPDATE TRIP ERROR:", err);
    res.status(500).json({ error: "Failed to update trip" });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const { tripId, destinationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ error: "Invalid trip ID" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const destination = trip.destinations.id(destinationId);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    destination.deleteOne();
    await trip.save();

    res.json({ status: "destination deleted" });
  } catch (err) {
    console.error("DELETE DESTINATION ERROR:", err);
    res.status(500).json({ error: "Failed to delete destination" });
  }
};