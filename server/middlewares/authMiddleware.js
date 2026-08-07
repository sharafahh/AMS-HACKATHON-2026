import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      if (!process.env.JWT_SECRET) {
        console.error("CRITICAL: JWT_SECRET environment variable is not set.");
        return res.status(500).json({ success: false, message: "Server configuration error" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Handle env-based admin (created during login with id 'admin-default')
      if (decoded.id === "admin-default") {
        req.admin = { _id: "admin-default", username: process.env.ADMIN_USERNAME || "admin", role: "SUPER_ADMIN" };
        return next();
      }

      // Handle DB-based admin accounts
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(401).json({ success: false, message: "Not authorized, admin not found" });
      }
      req.admin = admin;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Session expired, please login again" });
      }
      return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};
