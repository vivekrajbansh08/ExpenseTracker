import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import User from "../models/User";

export interface AuthRequest extends Request {
  userId?: string;
  user?: any; // Will be populated with user document
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);
    req.userId = decoded.userId;

    // Fetch user document
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Export as 'protect' for consistency with other routes
export const protect = authenticate;
