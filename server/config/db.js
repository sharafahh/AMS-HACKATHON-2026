import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore if DNS override fails
}

const DEFAULT_MONGO_URI = "mongodb+srv://[REDACTED_MONGO_CREDENTIALS]@cluster0.vkrawrw.mongodb.net/ams_hackathon_2026?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} [Database: ${conn.connection.name}]`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning (${error.message}). Using in-memory data layer fallback for seamless development.`);
  }
};

export default connectDB;
