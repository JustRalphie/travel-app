import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, logout }) {
  const location = useLocation();

  const navClass = (path) =>
    location.pathname === path ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div>
          <p className="navbar-label">Travel Planner</p>
          <h3>{user?.name || "User"}</h3>
        </div>
      </div>

      <nav className="navbar-links">
        <Link to="/dashboard" className={navClass("/dashboard")}>Dashboard</Link>
        <Link to="/trip" className={navClass("/trip")}>Trip</Link>
        <Link to="/booking" className={navClass("/booking")}>Bookings</Link>
        <Link to="/notifications" className={navClass("/notifications")}>Notifications</Link>
      </nav>

      <button className="logout-btn" onClick={logout}>Logout</button>
    </header>
  );
}