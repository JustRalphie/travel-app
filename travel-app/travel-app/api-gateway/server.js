const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", proxy("http://localhost:5001"));
app.use("/api/trips", proxy("http://localhost:5002"));
app.use("/api/bookings", proxy("http://localhost:5003"));
app.use("/api/notifications", proxy("http://localhost:5004"));

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});