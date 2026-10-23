import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCourses } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { speak } from "../utils/tts";

const courseConfig = [
  { gradient: "from-orange-400 to-pink-500",    icon: "🌐", accent: "#f97316" },
  { gradient: "from-blue-400 to-indigo-500",    icon: "⚡", accent: "#3b82f6" },
  { gradient: "from-emerald-400 to-teal-500",   icon: "♿", accent: "#10b981" },
  { gradient: "from-violet-400 to-purple-500",  icon: "🎨", accent: "#8b5cf6" },
  { gradient: "from-cyan-400 to-blue-500",      icon: "⚛️", accent: "#06b6d4" },
  { gradient: "from-yellow-400 to-orange-500",  icon: "🐍", accent: "#eab308" },
  { gradient: "from-pink-400 to-rose-500",      icon: "🖼️", accent: "#ec4899" },
  { gradient: "from-teal-400 to-green-500",     icon: "🤟", accent: "#14b8a6" },
];

const difficultyLabels = ["Beginner", "Intermediate", "Advanced"];
const difficultyColors = ["#10b981", "#f5a623", "#f95252"];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMotor = user?.disability === "motor";

  useEffect(() => {
    getCourses().then((r) => {
      setCourses(r.data);
      if (user?.disability === "blind") speak(`${r.data.length} courses available.`);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-teal-200 border-t-teal-500 animate-spin" />
        <div className="text-gray-400 text-sm">Loading courses...</div>
      </div>
    </div>
  );

  return (
    <main id="main-content" className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1
            className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Course Catalog
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {courses.length} courses · Learn at your own pace · All fully accessible
          </p>
        </motion.div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course, i) => {
            const cfg = courseConfig[i % courseConfig.length];
            const difficulty = difficultyLabels[i % 3];
            const diffColor = difficultyColors[i % 3];

            return (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer"
                style={{ boxShadow: "0 2px 15px rgba(0,0,0,0.06)", transition: "all 0.25s" }}
                onClick={() => {
                  if (user?.disability === "blind") speak(`Opening ${course.title}`);
                  navigate(`/courses/${course._id}`);
                }}
              >
                {/* Cover */}
                <div className={`bg-gradient-to-br ${cfg.gradient} h-36 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }}
                  />
                  <motion.span
                    className="text-6xl relative z-10"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {cfg.icon}
                  </motion.span>
                  {/* Difficulty badge */}
                  <span
                    className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-lg text-white"
                    style={{ background: "rgba(0,0,0,0.3)" }}
                  >
                    {difficulty}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2
                    className="font-bold text-gray-900 dark:text-white text-base mb-1.5 line-clamp-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {course.title}
                  </h2>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <span
                      className="flex items-center gap-1 px-2 py-1 rounded-lg"
                      style={{ background: `${cfg.accent}12`, color: cfg.accent }}
                    >
                      📖 {course.modules?.length || 0} modules
                    </span>
                    <span
                      className="flex items-center gap-1 px-2 py-1 rounded-lg"
                      style={{ background: "rgba(92,107,192,0.1)", color: "#5c6bc0" }}
                    >
                      🧠 {course.quiz?.length || 0} quiz
                    </span>
                  </div>

                  <button
                    className={`w-full text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 ${
                      isMotor ? "py-4 text-base" : "py-2.5 text-sm"
                    }`}
                    style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}cc)` }}
                    aria-label={`Start ${course.title}`}
                  >
                    Start Course →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sign Language CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-2xl p-6 flex items-center gap-5 cursor-pointer hover:-translate-y-1 transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(0,191,165,0.1), rgba(63,81,181,0.08))",
            border: "1px solid rgba(0,191,165,0.25)",
          }}
          onClick={() => navigate("/sign-language")}
        >
          <div className="text-4xl">🤟</div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "var(--font-display)" }}>
              Learn Sign Language for Free
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Our AI avatar teaches ISL & ASL — alphabets, numbers, and everyday phrases
            </p>
          </div>
          <div className="ml-auto text-teal-500 font-semibold text-sm flex-shrink-0">
            Go →
          </div>
        </motion.div>
      </div>
    </main>
  );
}