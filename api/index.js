import app from "../server/server.js";
import connectDB from "../server/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (e) {
    console.error("Vercel DB connection error:", e.message);
  }
  return app(req, res);
}
