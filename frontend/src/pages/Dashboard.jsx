import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProgress, getCourses } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { speak } from "../utils/tts";
import { motion, AnimatePresence } from "framer-motion";
import GovSchemes from "../components/GovSchemes";

const disabilityConfig = {
  blind:   { gradient: "from-blue-600 to-cyan-600",    icon: "👁️", label: "Visual Impairment" },
  deaf:    { gradient: "from-teal-500 to-emerald-600", icon: "👂", label: "Hearing Impairment" },
  speech:  { gradient: "from-amber-500 to-orange-600", icon: "🗣️", label: "Speech Impairment" },
  motor:   { gradient: "from-pink-500 to-rose-600",    icon: "🖐️", label: "Motor Disability" },
  default: { gradient: "from-teal-500 to-indigo-600",  icon: "🎓", label: "Learner" },
};

function ProgressRing({ percent, size = 80, stroke = 7, color = "#00bfa5" }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSchemes, setShowSchemes] = useState(false);
  const [tab, setTab] = useState("overview");

  const isBlind = user?.disability === "blind";
  const isDeaf  = user?.disability === "deaf";
  const isSpeech = user?.disability === "speech";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, cRes] = await Promise.all([getProgress(), getCourses()]);
        setProgress(pRes.data);
        setCourses(cRes.data);
        if (isBlind) {
          const completed = pRes.data.filter(p => p.completed).length;
          speak(`Welcome back ${user.name}. You have completed ${completed} out of ${cRes.data.length} courses.`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const completedCount = progress.filter(p => p.completed).length;
  const totalCourses = courses.length;
  const progressPercent = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;
  const avgScore = progress.filter(p => p.quizScore != null).reduce((a, p, _, arr) =>
    a + p.quizScore / arr.length, 0);

  const inProgressCourses = courses.filter(c =>
    !progress.find(p => (p.courseId?._id || p.courseId) === c._id && p.completed)
  );
  const completedCourses = progress.filter(p => p.completed);

  const dc = disabilityConfig[user?.disability] || disabilityConfig.default;

  const courseColors = ["from-teal-400 to-teal-600","from-indigo-400 to-indigo-600","from-amber-400 to-orange-500","from-pink-400 to-rose-500","from-emerald-400 to-green-600","from-cyan-400 to-blue-500"];
  const courseIcons  = ["🌐","⚡","♿","🎨","⚛️","🐍"];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-teal-200 border-t-teal-500 animate-spin" />
        <div className="text-gray-400 text-sm">Loading dashboard...</div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${dc.gradient} rounded-2xl p-6 mb-6 text-white relative overflow-hidden`}
        >
          <div className="absolute right-0 top-0 bottom-0 opacity-10 text-[8rem] flex items-center pr-4 pointer-events-none select-none">
            {dc.icon}
          </div>
          <div className="relative z-10">
            <div className="text-sm font-medium opacity-80 mb-1">{dc.label} Mode</div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="opacity-80 text-sm mt-1">
              {completedCount === 0 ? "Start your first course today!" :
               completedCount === totalCourses ? "🎉 You've completed all courses!" :
               `${totalCourses - completedCount} course${totalCourses - completedCount !== 1 ? "s" : ""} remaining`}
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Courses Done", value: `${completedCount}/${totalCourses}`, ring: progressPercent, color: "#00bfa5", icon: "📚" },
            { label: "Avg Quiz Score", value: progress.some(p => p.quizScore != null) ? `${Math.round(avgScore)}%` : "—", ring: Math.round(avgScore) || 0, color: "#5c6bc0", icon: "🧠" },
            { label: "In Progress",   value: `${inProgressCourses.length}`, ring: null, color: "#f5a623", icon: "⏳" },
            { label: "Streak",        value: `${completedCount} 🔥`, ring: null, color: "#f95252", icon: "🏆" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3"
            >
              {stat.ring !== null ? (
                <div className="relative flex-shrink-0">
                  <ProgressRing percent={stat.ring} size={52} stroke={5} color={stat.color} />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold rotate-90"
                    style={{ color: stat.color }}>{stat.ring}%</div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${stat.color}18` }}>
                  {stat.icon}
                </div>
              )}
              <div>
                <div className="text-xs text-gray-400">{stat.label}</div>
                <div className="font-bold text-gray-900 dark:text-white"
                  style={{ fontFamily: "var(--font-display)", color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={() => navigate("/courses")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #00bfa5, #008c7a)" }}>
            📚 Browse Courses
          </button>
          <button onClick={() => navigate("/sign-language")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #5c6bc0, #3f51b5)" }}>
            🤟 Sign Language
          </button>
          <button onClick={() => setShowSchemes(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #f5a623, #e09517)" }}>
            🏛️ Gov Schemes
          </button>
          <button onClick={() => window.open("https://meet.google.com","_blank")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #f95252, #e03e3e)" }}>
            🎥 Live Class
          </button>
        </div>

        {/* Continue learning */}
        {inProgressCourses.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-lg"
              style={{ fontFamily: "var(--font-display)" }}>
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressCourses.slice(0, 3).map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer card-hover"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <div className={`bg-gradient-to-br ${courseColors[i % courseColors.length]} h-28 flex items-center justify-center`}>
                    <span className="text-5xl">{courseIcons[i % courseIcons.length]}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1"
                      style={{ fontFamily: "var(--font-display)" }}>
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{course.description}</p>
                    <button
                      className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: "linear-gradient(135deg, #00bfa5, #008c7a)" }}
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completed courses */}
        {completedCourses.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-lg"
              style={{ fontFamily: "var(--font-display)" }}>
              ✅ Completed Courses
            </h2>
            <div className="space-y-3">
              {completedCourses.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
                    style={{ background: "#10b981" }}>
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {p.courseId?.title || "Course"}
                    </div>
                    {p.quizScore != null && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        Quiz score: <span className="font-semibold"
                          style={{ color: p.quizScore >= 80 ? "#10b981" : p.quizScore >= 60 ? "#f5a623" : "#f95252" }}>
                          {p.quizScore}%
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/courses/${p.courseId?._id || p.courseId}/quiz`)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all hover:-translate-y-0.5"
                    style={{ borderColor: "var(--teal-300)", color: "var(--teal-600)" }}
                  >
                    Retake Quiz
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSchemes && <GovSchemes onClose={() => setShowSchemes(false)} />}
      </AnimatePresence>
    </main>
  );
}