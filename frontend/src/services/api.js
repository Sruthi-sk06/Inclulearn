import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // sends session cookie with every request
});

// AUTH
export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");

// USER
export const updateDisability = (disability) =>
  api.put("/user/disability", { disability });

// COURSES
export const getCourses = () => api.get("/courses");
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post("/courses", data);

// PROGRESS
export const getProgress = () => api.get("/progress");
export const markCompleted = (courseId) =>
  api.post("/progress/complete", { courseId });
export const submitQuiz = (courseId, score) =>
  api.post("/progress/quiz", { courseId, score });

export default api;