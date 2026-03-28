require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sendEmail } = require("./services/emailService");
const config = require("./config/notificationConfig");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !to.trim()) {
      return res.status(400).json({ error: "Recipient email is required" });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: "Subject is required" });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const info = await sendEmail({
      to: to.trim(),
      subject: subject.trim(),
      text: message.trim()
    });

    res.json({
      status: "sent",
      provider: config.provider,
      messageId: info.messageId
    });
  } catch (err) {
    console.error("NOTIFICATION ERROR:", err);
    res.status(500).json({
      error: err.message || "Failed to send notification"
    });
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Notification service running on ${PORT}`);
});