require("dotenv").config();

const connectDB = require("../config/db");
const seedDatabase = require("./seedDatabase");

async function run() {
  try {
    const connected = await connectDB();
    await seedDatabase({ useDatabase: connected });
    console.log("Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

run();