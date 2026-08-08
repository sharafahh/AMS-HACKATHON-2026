import mongoose from "mongoose";
import dns from "dns";

// Configure DNS resolution fallback for local development only (not inside Vercel serverless containers)
if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    dns.setDefaultResultOrder("ipv4first");
  } catch (e) {
    // Ignore DNS override errors
  }
}

// Global connection state tracker for serverless environments (Vercel)
let isConnected = false;

// Setup Mongoose connection event listeners (attached once)
mongoose.connection.on("connected", () => {
  isConnected = true;
  console.log(`[${new Date().toISOString()}] ✅ MongoDB Atlas connection established.`);
});

mongoose.connection.on("error", (err) => {
  isConnected = false;
  console.error(`[${new Date().toISOString()}] ❌ MongoDB Atlas connection error:`, err.message);
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.warn(`[${new Date().toISOString()}] ⚠️ MongoDB Atlas connection disconnected.`);
});

mongoose.connection.on("reconnected", () => {
  isConnected = true;
  console.log(`[${new Date().toISOString()}] 🔄 MongoDB Atlas reconnected successfully.`);
});

/**
 * Connect to MongoDB Atlas with automated retry logic and optimized connection pooling.
 * @param {number} maxRetries - Maximum number of connection retry attempts (default 2 in serverless).
 * @param {number} retryDelayMs - Initial delay between retries in ms (default 1000ms).
 */
const connectDB = async (maxRetries = process.env.VERCEL ? 1 : 3, retryDelayMs = 1000) => {
  // Reuse existing connection if healthy
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!rawUri) {
    console.error(`[${new Date().toISOString()}] CRITICAL ERROR: MONGODB_URI environment variable is not defined.`);
    return null;
  }

  // Clean up angle brackets around password if present in env string
  const cleanUri = rawUri.replace(/<([^>]+)>/g, "$1");

  const mongooseOptions = {
    serverSelectionTimeoutMS: 4000, // 4s server selection timeout for quick fail-over
    socketTimeoutMS: 45000,          // Close sockets after 45s of inactivity
    maxPoolSize: 10,                 // Maintain up to 10 socket connections
    minPoolSize: 1,                  // Minimum pool size
    autoIndex: false,                // Disable autoIndex in runtime for fast startup
    bufferCommands: false,           // Fail fast if database connection is not ready
    family: 4,                       // Force IPv4 DNS resolution for Vercel serverless containers
  };

  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    try {
      console.log(`[${new Date().toISOString()}] Connecting to MongoDB Atlas (Attempt ${attempt}/${maxRetries})...`);
      const conn = await mongoose.connect(cleanUri, mongooseOptions);
      isConnected = true;
      console.log(`[${new Date().toISOString()}] ✅ MongoDB Atlas Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
      return conn;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Connection attempt ${attempt} failed: ${error.message}`);
      if (attempt >= maxRetries) {
        console.error(`[${new Date().toISOString()}] ❌ Max retries (${maxRetries}) reached. Could not connect to MongoDB.`);
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }

  return null;
};

export default connectDB;
