import Course from "../models/Course.js";

// GET /api/courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().select("-quiz").sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/courses/:id
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/courses  (admin only)
export const createCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, modules, quiz } = req.body;

    if (!title || !description || !videoUrl) {
      return res.status(400).json({ message: "Title, description, and video URL required" });
    }

    const course = await Course.create({
      title,
      description,
      videoUrl,
      thumbnail: thumbnail || "",
      modules: modules || [],
      quiz: quiz || [],
      createdBy: req.session.userId,
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/courses/:id  (admin only)
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};