require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
const seedDatabase = require("./seed/seedDatabase");
const { syncScheduledJobNotifications } = require("./services/jobNotificationService");

// Import Routes
const jobRoutes = require("./routes/jobs");
const submissionRoutes = require("./routes/submissions");
const analyticsRoutes = require("./routes/analytics");
const notificationRoutes = require("./routes/notifications");
const candidatesRoute = require("./routes/candidates");
const applicationsRoute = require("./routes/applications");
const interviewsRoute = require("./routes/interviews");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const port = process.env.PORT || 5000;

// ====================== MIDDLEWARE ======================

// CORS Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-session-id", "x-viewer-id"]
}));

app.use(express.json());

// Serve static files (uploads folder)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====================== ROUTES ======================

// API Routes
app.use("/api/candidates", candidatesRoute);
app.use("/api/applications", applicationsRoute);
app.use("/api/interviews", interviewsRoute);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

// Health Check & Root Route
app.get("/", (req, res) => {
  res.json({ 
    message: "CareerBridge API is running successfully",
    version: "1.0.0",
    status: "active"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found" 
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({ 
    success: false,
    message: error.message || "Internal server error" 
  });
});

// ====================== SERVER START ======================

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Seed Database (only in development)
    if (process.env.NODE_ENV !== "production") {
      await seedDatabase();
    }

    // Sync scheduled job notifications
    await syncScheduledJobNotifications();

    // Run notification sync every minute
    setInterval(() => {
      syncScheduledJobNotifications().catch((error) => {
        console.error("Notification sync failed:", error.message);
      });
    }, 60000); // 1 minute

    // Start Express Server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📊 Health check: http://localhost:${port}/api/health`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();