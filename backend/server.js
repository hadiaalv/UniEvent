const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local frontend
      "http://localhost:3001", // optional local dev
      "https://uni-vibe-bice.vercel.app", // deployed frontend
    ],
    credentials: true, // needed if you use cookies for auth
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser (needed if you use cookies)
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "UniEvent API is running 🚀" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/config", require("./routes/configRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    msg: err.message || "Internal server error",
  });
});

module.exports = app;
