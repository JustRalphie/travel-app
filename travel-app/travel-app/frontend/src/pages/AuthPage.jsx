import { useState } from "react";

const API = "http://localhost:5000/api";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthPage({ setToken, setUser }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setMessage("");

    if (mode === "register" && !name.trim()) {
      setMessage("Name is required.");
      return;
    }

    if (mode === "register" && name.trim().length > 60) {
      setMessage("Name cannot exceed 60 characters.");
      return;
    }

    if (!email.trim()) {
      setMessage("Email is required.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setMessage("Password is required.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    const endpoint = mode === "register" ? "/users/register" : "/users/login";
    const payload =
      mode === "register"
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Something went wrong");
      return;
    }

    localStorage.setItem("travel_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="page-tag">Travel Planner</p>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="page-subtext">
          Plan trips, store bookings, and manage destinations in one place.
        </p>

        {mode === "register" && (
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}

        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {message && <div className="inline-message error">{message}</div>}

        <button className="primary-btn" onClick={handleSubmit}>
          {mode === "login" ? "Login" : "Register"}
        </button>

        <button
          className="secondary-btn"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          Switch to {mode === "login" ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
}