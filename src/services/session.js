import Session from "../models/Session.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const createSession = async (token, userId) => {
  try {
    // Validate input data
    if (!userId || !token) {
      throw new Error("User ID and token are required.");
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token.");
    }

    // Check if the token belongs to the correct user
    if (decoded.id !== userId) {
      throw new Error("Token does not match the user.");
    }

    // Check if the session already exists
    const existingSession = await Session.findOne({ where: { userId, token } });
    if (existingSession) {
      throw new Error("This token has already been used.");
    }

    // Calculate the time limit for the session
    const expiration = process.env.JWT_EXPIRATION;
    if (!expiration) {
      throw new Error("JWT_EXPIRATION is not defined in the environment variables.");
    }

    const value = parseInt(expiration.slice(0, -1), 10); // Extract numeric part
    const unit = expiration.slice(-1); // Extract unit (h, m, d)

    if (isNaN(value)) {
      throw new Error("Invalid JWT_EXPIRATION format. Ensure it starts with a number (e.g., 1h, 30m).");
    }

    const now = new Date();
    const timeLimit = new Date(now.getTime()); // Start with the current time

    switch (unit) {
      case "h":
        timeLimit.setTime(now.getTime() + value * 60 * 60 * 1000); // Add hours
        break;
      case "m":
        timeLimit.setTime(now.getTime() + value * 60 * 1000); // Add minutes
        break;
      case "d":
        timeLimit.setTime(now.getTime() + value * 24 * 60 * 60 * 1000); // Add days
        break;
      default:
        throw new Error("Unsupported JWT_EXPIRATION unit. Use 'h', 'm', or 'd'.");
    }

    console.log("Calculated timeLimit:", timeLimit); // Log the calculated timeLimit for debugging

    // Create a new session in the database
    const newSession = await Session.create({
      userId,
      token,
      timeLimit, // Store as a valid JavaScript Date object
      status: "active",
    });

    return {
      status: "success",
      message: "Session created successfully.",
      session: newSession,
    };
  } catch (error) {
    console.error("Error creating session:", error.message);
    return {
      status: "error",
      message: error.message || "An error occurred while creating the session.",
    };
  }
};

export default createSession;
