require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const candidatesRoute = require("./routes/candidates");
const applicationsRoute = require("./routes/applications");
const interviewsRoute = require("./routes/interviews");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/candidates", candidatesRoute);
app.use("/api/applications", applicationsRoute);
app.use("/api/interviews", interviewsRoute);

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
}); 