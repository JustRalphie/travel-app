const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const tripRoutes = require("./routes/tripRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/", tripRoutes);

app.listen(5002, () => {
  console.log("Trip service running on 5002");
});