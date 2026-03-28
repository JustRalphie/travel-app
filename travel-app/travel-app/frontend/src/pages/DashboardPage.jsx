import { Link } from "react-router-dom";

export default function DashboardPage({ user }) {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="page-tag">Dashboard</p>
        <h1>Hello, {user?.name || "traveler"}.</h1>
        <p className="page-subtext">
          Use the sections below to manage trips, bookings, and notifications.
        </p>
      </section>

      <section className="dashboard-cards">
        <Link to="/trip" className="dashboard-card">
          <h3>Trip Planner</h3>
          <p>Create trips, add destinations, and generate itinerary.</p>
        </Link>

        <Link to="/booking" className="dashboard-card">
          <h3>Bookings</h3>
          <p>Create and view trip bookings stored in MongoDB.</p>
        </Link>

        <Link to="/notifications" className="dashboard-card">
          <h3>Notifications</h3>
          <p>Send trip updates through the notification service.</p>
        </Link>
      </section>
    </main>
  );
}