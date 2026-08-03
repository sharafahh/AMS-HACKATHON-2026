import mongoose from "mongoose";
import dns from "dns";

// Configure DNS resolution fallback if needed
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore DNS override errors
}

const DEFAULT_MONGO_URI =
  "mongodb+srv://[REDACTED_MONGO_CREDENTIALS]@cluster0.vkrawrw.mongodb.net/ams_hackathon_2026?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    let rawUri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGO_URI;
    
    // Clean up angle brackets around password if present in env
    let cleanUri = rawUri.replace(/<([^>]+)>/g, "$1");

    const conn = await mongoose.connect(cleanUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    // Graceful handling - log error without crashing app immediately
    return null;
  }
};

export default connectDB;
