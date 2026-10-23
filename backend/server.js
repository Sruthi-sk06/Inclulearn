import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/courses.js";
import progressRoutes from "./routes/progress.js";

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: "inclulearn_secret_2024",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);

app.get("/api/health", (req, res) => res.json({ status: "OK" }));

app.listen(5000, () => console.log("Server running on http://localhost:5000"));