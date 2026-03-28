const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const controller = require("../controller/userController");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.get("/profile", authMiddleware, controller.getProfile);
router.get("/", controller.getUsers);

module.exports = router;