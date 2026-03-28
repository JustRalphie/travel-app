import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TripPage from "./pages/TripPage";
import BookingPage from "./pages/BookingPage";
import NotificationPage from "./pages/NotificationPage";

const API = "http://localhost:5000/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("travel_token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetch(`${API}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.email) setUser(data);
        })
        .catch(() => {});
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("travel_token");
    setToken("");
    setUser(null);
  };

  return (
    <div className="app-root">
      {token && <Navbar user={user} logout={logout} />}

      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <AuthPage setToken={setToken} setUser={setUser} />}
        />
        <Route
          path="/dashboard"
          element={token ? <DashboardPage user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/trip"
          element={token ? <TripPage user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/booking"
          element={token ? <BookingPage user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={token ? <NotificationPage user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}