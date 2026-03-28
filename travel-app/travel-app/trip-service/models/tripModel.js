const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  full_place_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250
  },
  country: {
    type: String,
    default: ""
  },
  place_type: {
    type: String,
    default: ""
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  days: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  activities: {
    type: [String],
    default: []
  },
  estimated_cost: {
    type: Number,
    default: 0,
    min: 0
  }
});

const tripSchema = new mongoose.Schema(
  {
    trip_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    start_date: {
      type: String,
      required: true
    },
    end_date: {
      type: String,
      required: true
    },
    budget: {
      type: Number,
      required: true,
      min: 0
    },
    preferences: {
      type: [String],
      default: []
    },
    destinations: {
      type: [destinationSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);