import User from "../models/User.js";

export const requireAuth = (req, res, next) => {
  if (!req.session?.userId)
    return res.status(401).json({ message: "Not authenticated" });
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.session?.userId)
      return res.status(401).json({ message: "Not authenticated" });
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};