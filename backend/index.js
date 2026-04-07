require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const candidatesRoute = require("./routes/candidates");
const applicationsRoute = require("./routes/applications");
const interviewsRoute = require("./routes/interviews");

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB();



app.use("/api/candidates", candidatesRoute);
app.use("/api/applications", applicationsRoute);
app.use("/api/interviews", interviewsRoute);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);


app.get("/", (req, res) => {
  res.send("Hello Express API");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
}); 