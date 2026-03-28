import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

export default function BookingPage({ user }) {
  const [tripId, setTripId] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    const res = await fetch(`${API}/bookings`);
    const data = await res.json();
    if (res.ok) setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const createBooking = async () => {
    if (!user) {
      setMessage("Please login first.");
      return;
    }

    if (!isValidObjectId(tripId)) {
      setMessage("Please enter a valid Trip ID.");
      return;
    }

    if (!bookingName.trim()) {
      setMessage("Booking name is required.");
      return;
    }

    if (bookingName.trim().length > 80) {
      setMessage("Booking name cannot exceed 80 characters.");
      return;
    }

    const res = await fetch(`${API}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user?.id || user?._id,
        trip_id: tripId.trim(),
        booking_name: bookingName.trim()
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to create booking");
      return;
    }

    setBookingName("");
    setTripId("");
    setMessage("Booking created successfully.");
    fetchBookings();
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="page-tag">Bookings</p>
        <h1>Manage your bookings</h1>
        <p className="page-subtext">Create and review booking records saved in MongoDB.</p>
      </section>

      {message && <div className="inline-message neutral">{message}</div>}

      <section className="split-grid">
        <div className="panel-card">
          <h3>Create Booking</h3>
          <div className="field">
            <label>Trip ID</label>
            <input value={tripId} onChange={(e) => setTripId(e.target.value)} />
          </div>
          <div className="field">
            <label>Booking Name</label>
            <input value={bookingName} onChange={(e) => setBookingName(e.target.value)} />
          </div>
          <button className="primary-btn" onClick={createBooking}>Create Booking</button>
        </div>

        <div className="panel-card">
          <h3>Recent Bookings</h3>
          <div className="list-stack">
            {bookings.length === 0 ? (
              <div className="empty-state">No bookings yet.</div>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="list-card">
                  <div>
                    <strong>{booking.booking_name}</strong>
                    <p>{booking.status}</p>
                    <p>{booking.trip_id}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}