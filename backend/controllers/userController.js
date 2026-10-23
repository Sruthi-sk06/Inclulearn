import User from "../models/User.js";

export const updateDisability = async (req, res) => {
  try {
    const { disability } = req.body;
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { disability },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};