const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import the userRoutes
const userRoutes = require("./Routes/userRoutes");
const dataRoutes = require("./Routes/DataRoutes");
const profile = require("./Routes/ProfileRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
// Allow requests from your frontend's domain
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));
// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api", userRoutes); // Connect the userRoutes to the server
app.use("/api/data", dataRoutes); // Connect the dataRoutes to the server
app.use("/api/public", profile); // Connect the letters routes to the server
// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running from RedMoon");
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});