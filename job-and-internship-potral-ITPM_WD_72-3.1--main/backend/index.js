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
const questionsRoutes = require('./routes/questions');
const interviewRoutes = require('./routes/interviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const assistantRoutes = require('./routes/assistantRoutes');



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

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Serve static files (uploads folder)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====================== ROUTES ======================

// API Routes
app.use("/api/questions", questionsRoutes);
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
app.use("/api/interview", interviewRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/assistant", assistantRoutes);



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
  let dbConnected = false;

  try {
    // Connect to Database
    await connectDB();
    dbConnected = true;

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

  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    console.warn("⚠️ Server will continue without database. DB-dependent endpoints may fail.");
  }

  // Start Express Server even if DB is unavailable so non-DB routes can still work.
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
    console.log(`🗄️ Database status: ${dbConnected ? "connected" : "disconnected"}`);
  });
};

startServer();