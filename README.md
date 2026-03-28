# 🌍 Travel App – Microservices Architecture

A full-stack travel booking application built using **MERN stack + Microservices architecture**.
This project demonstrates how multiple services communicate through an **API Gateway**.

---

## 🚀 Features

* 👤 User Authentication (Register/Login)
* ✈️ Trip Management
* 📦 Booking System
* 📩 Notification Service (Email simulation)
* 🌐 API Gateway routing
* ⚛️ React Frontend (Vite)

---

## 🏗️ Architecture

```
Frontend (React + Vite)
        ↓
API Gateway (Port 5000)
        ↓
-------------------------------------
| User Service        (5001)        |
| Trip Service        (5002)        |
| Booking Service     (5003)        |
| Notification Service(5004)        |
-------------------------------------
```

---

## 📁 Project Structure

```
travel-app/
│
├── api-gateway/
├── user-service/
├── trip-service/
├── booking-service/
├── notification-service/
├── frontend/
└── report.docx
```

---

## ⚙️ Prerequisites

Make sure you have installed:

* Node.js (v18+ recommended)
* MongoDB (running locally)
* npm (comes with Node)

---

## 🛠️ Installation & Setup

### 1️⃣ Clone / Extract Project

```bash
unzip travel-app.zip
cd travel-app/travel-app
```

---

### 2️⃣ Setup Each Service

Run this **inside each folder**:

```bash
npm install
```

Do this for:

* `api-gateway`
* `user-service`
* `trip-service`
* `booking-service`
* `notification-service`
* `frontend`

---

### 3️⃣ Configure Environment Variables

Create `.env` files where needed:

#### Example (`user-service/.env`)

```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/travelapp
JWT_SECRET=secret123
```

#### Example (`booking-service/.env`)

```
PORT=5003
MONGO_URI=mongodb://127.0.0.1:27017/travelapp
```

#### Example (`notification-service/.env`)

```
PORT=5004
EMAIL_USER=test@example.com
EMAIL_PASS=123456
```

> ⚠️ Make sure MongoDB is running locally.

---

## ▶️ Running the Application

### 🔹 Step 1: Start MongoDB

```bash
mongod
```

---

### 🔹 Step 2: Start Backend Services

Open **separate terminals** and run:

```bash
cd user-service
npm start
```

```bash
cd trip-service
npm start
```

```bash
cd booking-service
npm start
```

```bash
cd notification-service
npm start
```

---

### 🔹 Step 3: Start API Gateway

```bash
cd api-gateway
npm start
```

Runs on:

```
http://localhost:5000
```

---

### 🔹 Step 4: Start Frontend

```bash
cd frontend
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## 🔗 API Routes (via Gateway)

| Service       | Route                |
| ------------- | -------------------- |
| User          | `/api/users`         |
| Trips         | `/api/trips`         |
| Bookings      | `/api/bookings`      |
| Notifications | `/api/notifications` |

---

## 🧪 Testing

You can test using:

* Browser (Frontend UI)
* Postman (optional)

---

## ⚠️ Common Errors & Fixes

### ❌ "Cannot find module 'express'"

```bash
npm install express
```

---

### ❌ "MongoDB connection error"

* Ensure MongoDB is running:

```bash
mongod
```

---

### ❌ "vite not recognized"

```bash
npm install
npm run dev
```

---

### ❌ Port already in use

Change port in `.env` file.

---

## 💡 Notes

* Notification service currently logs emails to console.
* No real email sending configured.
* Frontend communicates only via API Gateway.

---

## 📌 Future Improvements

* 🔐 JWT Authentication improvements
* 📧 Real email integration
* 📊 Dashboard analytics
* 🌍 Deployment (Docker / Cloud)

---

## 👨‍💻 Authors

**Ralph Joel & Sophie Pereira**
B.Tech Cyber Security & Cyber Forensics
