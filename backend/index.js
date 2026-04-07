require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const seedDatabase = require("./seed/seedDatabase");
const jobRoutes = require("./routes/jobs");
const submissionRoutes = require("./routes/submissions");
const analyticsRoutes = require("./routes/analytics");
const notificationRoutes = require("./routes/notifications");
const { syncScheduledJobNotifications } = require("./services/jobNotificationService");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id, x-viewer-id");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/", (req, res) => {
  res.json({ message: "CareerBridge API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: error.message || "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    await syncScheduledJobNotifications();

    setInterval(() => {
      syncScheduledJobNotifications().catch((error) => {
        console.error("Notification sync failed:", error.message);
      });
    }, 60000);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();