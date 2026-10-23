import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    modules: [moduleSchema],
    quiz: [quizQuestionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;