import { useState } from "react";

const API = "http://localhost:5000/api";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

export default function NotificationPage({ user }) {
  const [email, setEmail] = useState(user?.email || "");
  const [tripId, setTripId] = useState("");
  const [status, setStatus] = useState("");

  const sendNotification = async () => {
    setStatus("");

    if (!email.trim()) {
      setStatus("Email is required.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setStatus("Please enter a valid email address.");
      return;
    }

    if (!tripId.trim()) {
      setStatus("Trip ID is required.");
      return;
    }

    if (!isValidObjectId(tripId.trim())) {
      setStatus("Please enter a valid Trip ID.");
      return;
    }

    try {
      const tripRes = await fetch(`${API}/trips/${tripId.trim()}/itinerary`);
      const tripData = await tripRes.json();

      if (!tripRes.ok) {
        setStatus(tripData.error || "Failed to fetch trip details.");
        return;
      }

      let message = `Trip Name: ${tripData.trip_name}\n`;
      message += `Trip ID: ${tripData.trip_id}\n`;
      message += `Total Estimated Cost: ₹${tripData.total_estimated_cost}\n\n`;

      if (!tripData.itinerary || tripData.itinerary.length === 0) {
        message += "No destinations have been added yet.\n";
      } else {
        message += "Itinerary:\n";
        tripData.itinerary.forEach((item) => {
          message += `Day ${item.day}: ${item.destination}\n`;
        });
      }

      const notifyRes = await fetch(`${API}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: email.trim(),
          subject: `Travel Planner Update - ${tripData.trip_name}`,
          message
        })
      });

      const notifyData = await notifyRes.json();

      if (!notifyRes.ok) {
        setStatus(notifyData.error || "Failed to send notification.");
        return;
      }

      setStatus("Trip details sent successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong while sending the email.");
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="page-tag">Notifications</p>
        <h1>Send trip details automatically</h1>
        <p className="page-subtext">
          Enter the recipient email and Trip ID. The app will fetch the trip details and send them automatically.
        </p>
      </section>

      {status && <div className="inline-message neutral">{status}</div>}

      <section className="single-panel">
        <div className="panel-card">
          <h3>Send Trip Email</h3>

          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field">
            <label>Trip ID</label>
            <input
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              placeholder="Paste Trip ID"
            />
          </div>

          <button className="primary-btn" onClick={sendNotification}>
            Send Trip Details
          </button>
        </div>
      </section>
    </main>
  );
}