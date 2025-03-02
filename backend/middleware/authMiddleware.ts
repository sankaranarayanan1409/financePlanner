import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/AuthRequest"; // Import the extended Request type

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Access denied" });
      return
    }

    // ✅ Decode token and attach user info to request
    const decoded = jwt.verify(token, "your_secret_key") as { id: number, username: string };
    req.user = { id: decoded.id, username: decoded.username }; // ✅ Attach user ID

    next(); // ✅ Ensure next() is always called
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};
