import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header is present and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Received Token:", token);
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    // Fetch user without password
    const user = await User.findById(decoded.id).select("-password");
    console.log(user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found, authorization denied",
      });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid token, authorization denied",
    });
  }
};
