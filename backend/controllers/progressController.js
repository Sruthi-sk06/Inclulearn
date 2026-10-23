import Progress from "../models/Progress.js";

// GET /api/progress
export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.session.userId })
      .populate("courseId", "title description thumbnail modules quiz");
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/progress/complete
export const markCompleted = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: "courseId required" });

    const progress = await Progress.findOneAndUpdate(
      { userId: req.session.userId, courseId },
      { $set: { completed: true, completedAt: new Date() } },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/progress/quiz
export const submitQuiz = async (req, res) => {
  try {
    const { courseId, score } = req.body;
    if (!courseId || score === undefined) {
      return res.status(400).json({ message: "courseId and score required" });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId: req.session.userId, courseId },
      { $set: { quizScore: score, quizAttempted: true } },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};