import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

const disabilities = [
  {
    icon: "👁️", label: "Visual Impairment",
    features: ["Text-to-Speech", "Voice Navigation", "High Contrast", "Font Control"],
    gradient: "from-blue-500 to-cyan-500",
    accent: "#378ADD",
    bg: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/40",
  },
  {
    icon: "👂", label: "Hearing Impairment",
    features: ["Sign Language Avatar", "Video Captions", "Visual Alerts", "Text-only Mode"],
    gradient: "from-emerald-500 to-teal-500",
    accent: "#00bfa5",
    bg: "bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800/40",
  },
  {
    icon: "🗣️", label: "Speech Impairment",
    features: ["Quick Replies", "AI Chat", "TTS Output", "Symbol Nav"],
    gradient: "from-amber-500 to-orange-500",
    accent: "#f5a623",
    bg: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40",
  },
  {
    icon: "🖐️", label: "Motor Disability",
    features: ["Voice Navigation", "Large Buttons", "Single Click", "No Mouse Needed"],
    gradient: "from-pink-500 to-rose-500",
    accent: "#f95252",
    bg: "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/40",
  },
];

const features = [
  { icon: "🎙️", title: "Voice Navigation", desc: "12+ voice commands. Navigate entirely hands-free.", color: "#00bfa5" },
  { icon: "🤟", title: "Sign Language AI", desc: "Animated ISL/ASL avatar teaches sign alongside every lesson.", color: "#5c6bc0" },
  { icon: "🧠", title: "Smart Quizzes", desc: "Auto-generated quizzes with animated feedback and score analysis.", color: "#f5a623" },
  { icon: "📊", title: "Progress Tracking", desc: "Dashboard with streaks, completion rings, and certificates.", color: "#10b981" },
  { icon: "🌗", title: "Dark / Light Mode", desc: "Full adaptive theming with high-contrast accessibility mode.", color: "#f95252" },
  { icon: "🤖", title: "Claude AI Chatbot", desc: "Powered by Claude — context-aware help for every lesson.", color: "#378ADD" },
];

// Animated floating orb background
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #00bfa5, transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 -right-20 w-80 h-80 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #5c6bc0, transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-10 left-1/3 w-64 h-64 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #f5a623, transparent 70%)" }}
      />
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="bg-white dark:bg-gray-950 overflow-x-hidden">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Hero ── */}
      <section
        id="main-content"
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #f0fdfa 0%, #ffffff 60%)",
        }}
      >
        <FloatingOrbs />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(0,191,165,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,165,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-4xl"
        >
          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border"
              style={{
                background: "rgba(0,191,165,0.1)",
                color: "var(--teal-700)",
                borderColor: "rgba(0,191,165,0.3)",
              }}
            >
              <span className="animate-pulse w-2 h-2 rounded-full bg-teal-500 inline-block" />
              Accessibility-First Learning Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Learn without{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00bfa5, #008c7a, #3f51b5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              barriers
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            IncluLearn adapts its entire interface to your disability.
            Voice navigation, AI sign language, smart quizzes, and more —
            all in one inclusive platform.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-block text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all"
                style={{
                  background: "linear-gradient(135deg, #00bfa5, #008c7a)",
                  boxShadow: "0 4px 25px rgba(0,191,165,0.45)",
                }}
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-block text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, #00bfa5, #008c7a)",
                    boxShadow: "0 4px 25px rgba(0,191,165,0.45)",
                  }}
                >
                  Get Started Free →
                </Link>
                <Link
                  to="/login"
                  className="inline-block bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-teal-300 text-gray-900 dark:text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all hover:-translate-y-1"
                >
                  Log In
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            {[
              { value: "4", label: "Disability Modes" },
              { value: "8+", label: "Courses" },
              { value: "100%", label: "Accessible" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-3xl font-extrabold"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "linear-gradient(135deg, #00bfa5, #3f51b5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-teal-300 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-teal-400" />
          </div>
        </motion.div>
      </section>

      {/* ── Disability modes ── */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Four interfaces. One platform.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              The entire UI adapts based on your accessibility need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {disabilities.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`rounded-2xl p-6 border-2 ${d.bg} cursor-default`}
              >
                <div className="text-5xl mb-4">{d.icon}</div>
                <h3
                  className="font-bold text-gray-900 dark:text-white mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {d.label}
                </h3>
                <div className="space-y-2">
                  {d.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: d.accent }}
                      />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="px-6 py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Everything you need
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Built for real accessibility, not just compliance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="card-hover bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: `${f.color}18` }}
                >
                  {f.icon}
                </div>
                <h3
                  className="font-semibold text-gray-900 dark:text-white mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sign Language CTA Banner ── */}
      <section
        className="px-6 py-16 mx-6 my-10 rounded-3xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #00bfa5 0%, #008c7a 50%, #3f51b5 100%)" }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <div className="text-5xl mb-4">🤟</div>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            New: AI Sign Language Teacher
          </h2>
          <p className="text-teal-100 mb-8 text-lg">
            Our animated AI avatar teaches ISL & ASL — alphabets, numbers, common phrases.
            Learn at your own pace with instant feedback.
          </p>
          <Link
            to={user ? "/sign-language" : "/signup"}
            className="bg-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-teal-50 transition-all inline-block"
            style={{ color: "var(--teal-700)" }}
          >
            {user ? "Start Learning Signs →" : "Join Free & Learn Signs →"}
          </Link>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to start learning?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Join IncluLearn — where education truly has no barriers.
          </p>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="inline-block text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #00bfa5, #008c7a)",
              boxShadow: "0 4px 25px rgba(0,191,165,0.4)",
            }}
          >
            {user ? "Go to Dashboard →" : "Create Free Account →"}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}