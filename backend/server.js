require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const propertyRoutes = require("./routes/propertyRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const Property = require("./models/Property");

Property.countDocuments().then((count) => {
  if (count === 0) {
    Property.create({
      title: "2 BHK in Pune",
      price: 6500000,
      location: "Pune",
      image: "https://via.placeholder.com/250x150",
      description: "Spacious 2BHK in a prime area.",
    }).then(() => console.log("Sample property added"));
  }
});
