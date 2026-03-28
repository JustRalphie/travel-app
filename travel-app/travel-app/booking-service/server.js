require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/", bookingRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Booking service running on ${PORT}`);
});