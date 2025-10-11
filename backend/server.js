// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const chatRoute = require("./routes/chat"); // <- chatbot

const app = express();
const PORT = process.env.PORT || 5000;

// --- middleware (declare once) ---
app.use(cors()); // optionally: cors({ origin: "http://localhost:5173" })
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- routes (mount once) ---
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", require("./routes/chat")); // <- chatbot route

// --- sample seed (after models import) ---
const Property = require("./models/Property");

// --- connect DB, then start server ONCE ---
async function start() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("Missing MONGO_URI in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("✅ MongoDB connected");

    // seed once if empty
    const count = await Property.countDocuments();
    if (count === 0) {
      await Property.create({
        title: "2 BHK in Pune",
        price: 6500000,
        location: "Pune",
        image: "https://via.placeholder.com/250x150",
        description: "Spacious 2BHK in a prime area.",
      });
      console.log("Sample property added");
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

start();
