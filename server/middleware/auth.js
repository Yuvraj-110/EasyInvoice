import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
