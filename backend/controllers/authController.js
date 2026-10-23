import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    // Auto-assign admin role for specific email
    const role = email === "admin@inclulearn.com" ? "admin" : "user";

    const user = new User({ name, email, password, role });
    await user.save();

    req.session.userId = user._id.toString();
    req.session.save((err) => {
      if (err) return res.status(500).json({ message: "Session error" });
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        disability: user.disability,
      });
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    req.session.userId = user._id.toString();
    req.session.save((err) => {
      if (err) return res.status(500).json({ message: "Session error" });
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        disability: user.disability,
      });
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

export const getMe = async (req, res) => {
  try {
    if (!req.session?.userId)
      return res.status(401).json({ message: "Not authenticated" });
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
