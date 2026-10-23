import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    quizScore: {
      type: Number,
      default: null,
    },
    quizAttempted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One progress record per user per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;