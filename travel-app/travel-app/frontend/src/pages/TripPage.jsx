import { useMemo, useState } from "react";

const API = "http://localhost:5000/api";

const suggestions = ["Munnar", "Alleppey", "Wayanad", "Kochi"];

function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

export default function TripPage() {
  const today = new Date().toISOString().split("T")[0];

  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");

  const [tripId, setTripId] = useState("");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");

  const [createdTrip, setCreatedTrip] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [message, setMessage] = useState("");

  const tripDuration = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const totalDays = destinations.reduce((sum, d) => sum + Number(d.days || 0), 0);
  const remaining = Math.max(tripDuration - totalDays, 0);

  const createTrip = async () => {
    if (!tripName.trim()) {
      setMessage("Trip name is required.");
      return;
    }

    if (tripName.trim().length > 80) {
      setMessage("Trip name cannot exceed 80 characters.");
      return;
    }

    if (!startDate || !endDate) {
      setMessage("Start date and end date are required.");
      return;
    }

    if (startDate < today) {
      setMessage("Start date cannot be in the past.");
      return;
    }

    if (endDate < startDate) {
      setMessage("End date cannot be before start date.");
      return;
    }

    if (budget === "" || Number(budget) < 0) {
      setMessage("Please enter a valid budget.");
      return;
    }

    const res = await fetch(`${API}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        trip_name: tripName.trim(),
        start_date: startDate,
        end_date: endDate,
        budget: Number(budget)
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to create trip");
      return;
    }

    setCreatedTrip(data);
    setTripId(data.trip_id);
    setMessage("Trip created successfully.");
    setDestinations([]);
    setItinerary([]);
  };

  const addDestination = async () => {
    if (!isValidObjectId(tripId)) {
      setMessage("Invalid Trip ID");
      return;
    }

    if (!destination.trim()) {
      setMessage("Destination is required.");
      return;
    }

    if (destination.trim().length > 100) {
      setMessage("Destination name is too long.");
      return;
    }

    if (!days || Number(days) <= 0) {
      setMessage("Days must be greater than 0.");
      return;
    }

    if (Number(days) > 30) {
      setMessage("Days cannot exceed 30.");
      return;
    }

    if (tripDuration && totalDays + Number(days) > tripDuration) {
      setMessage(`Only ${remaining} day(s) left in this trip.`);
      return;
    }

    const duplicate = destinations.some(
      (d) => d.full_place_name?.toLowerCase() === destination.trim().toLowerCase() ||
             d.destination?.toLowerCase() === destination.trim().toLowerCase()
    );

    if (duplicate) {
      setMessage("That place is already added.");
      return;
    }

    const res = await fetch(`${API}/trips/${tripId}/destinations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        destination: destination.trim(),
        days: Number(days),
        activities: []
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to add destination");
      return;
    }

    setDestinations((prev) => [
      ...prev,
      {
        destination_id: data.destination_id,
        destination: data.destination,
        full_place_name: data.full_place_name,
        country: data.country,
        days: Number(days)
      }
    ]);

    setDestination("");
    setDays("");
    setMessage("Destination added successfully.");
  };

  const deleteDestination = async (destinationId) => {
    const res = await fetch(`${API}/trips/${tripId}/destinations/${destinationId}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to delete destination");
      return;
    }

    setDestinations((prev) => prev.filter((d) => d.destination_id !== destinationId));
    setItinerary([]);
    setMessage("Destination deleted.");
  };

  const loadItinerary = async () => {
    if (!isValidObjectId(tripId)) {
      setMessage("Invalid Trip ID");
      return;
    }

    const res = await fetch(`${API}/trips/${tripId}/itinerary`);
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to load itinerary");
      return;
    }

    setItinerary(data.itinerary || []);
    if (data.destinations) {
      setDestinations(
        data.destinations.map((d) => ({
          destination_id: d._id,
          destination: d.destination,
          full_place_name: d.full_place_name,
          country: d.country,
          days: d.days
        }))
      );
    }
    setMessage("Itinerary loaded.");
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="page-tag">Trip Planner</p>
        <h1>Create and manage your trip</h1>
        <p className="page-subtext">
          Duration: {tripDuration || 0} days · Planned: {totalDays} · Remaining: {remaining}
        </p>
      </section>

      {message && <div className="inline-message neutral">{message}</div>}

      <section className="split-grid">
        <div className="panel-card">
          <h3>Create Trip</h3>
          <div className="field"><label>Trip Name</label><input value={tripName} onChange={(e) => setTripName(e.target.value)} /></div>
          <div className="field"><label>Start Date</label><input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
          <div className="field"><label>End Date</label><input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
          <div className="field"><label>Budget</label><input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
          <button className="primary-btn" onClick={createTrip}>Create Trip</button>
        </div>

        <div className="panel-card">
          <h3>Add Destination</h3>
          <div className="field"><label>Trip ID</label><input value={tripId} onChange={(e) => setTripId(e.target.value)} /></div>
          <div className="field"><label>Destination</label><input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter a real city/place" /></div>

          <div className="chip-row">
            {suggestions.map((item) => (
              <button key={item} className="chip-btn" onClick={() => setDestination(item)}>{item}</button>
            ))}
          </div>

          <div className="field"><label>Days</label><input type="number" value={days} onChange={(e) => setDays(e.target.value)} /></div>
          <button className="primary-btn" onClick={addDestination}>Add Destination</button>
        </div>
      </section>

      <section className="split-grid">
        <div className="panel-card">
          <div className="row-between">
            <h3>Destinations</h3>
            <button className="secondary-btn compact-btn" onClick={loadItinerary}>Refresh Itinerary</button>
          </div>

          <div className="list-stack">
            {destinations.length === 0 ? (
              <div className="empty-state">No destinations added yet.</div>
            ) : (
              destinations.map((d, index) => (
                <div className="list-card" key={d.destination_id || index}>
                  <div>
                    <strong>{d.destination}</strong>
                    <p>{d.full_place_name}</p>
                    <p>{d.days} day{d.days > 1 ? "s" : ""}</p>
                  </div>
                  {d.destination_id && (
                    <button className="danger-btn" onClick={() => deleteDestination(d.destination_id)}>
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel-card">
          <h3>Itinerary</h3>
          <div className="list-stack">
            {itinerary.length === 0 ? (
              <div className="empty-state">No itinerary loaded yet.</div>
            ) : (
              itinerary.map((item, index) => (
                <div className="list-card" key={index}>
                  <div>
                    <strong>Day {item.day}</strong>
                    <p>{item.destination}</p>
                    <p>{item.full_place_name}</p>
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