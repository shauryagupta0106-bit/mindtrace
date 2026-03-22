const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

// Load env variables
dotenv.config();

// DB Connection
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const thoughtRoutes = require("./routes/thoughtRoutes");

// Initialize app
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (important for frontend connection)
app.use(
  cors({
    origin: "http://localhost:5173", // React Vite default
    credentials: true,
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true only in HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/thoughts", thoughtRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 MindTrace API is running...");
});

// Global Error Handler (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});

// Server listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});