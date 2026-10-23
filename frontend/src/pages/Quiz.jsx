import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCourse, submitQuiz } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { speak } from "../utils/tts";
import SignLanguageAvatar from "../components/SignLanguageAvatar";

export default function Quiz() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [showSign, setShowSign] = useState(false);

  const isMotor = user?.disability === "motor";
  const isBlind = user?.disability === "blind";
  const isDeaf  = user?.disability === "deaf";

  useEffect(() => {
    getCourse(id)
      .then((res) => {
        setCourse(res.data);
        if (isBlind) speak(`Quiz for ${res.data.title}. ${res.data.quiz.length} questions.`);
        if (isDeaf) setShowSign(true);
      })
      .catch(() => navigate("/courses"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnswer = (optIndex) => {
    if (revealed[currentQ]) return;
    const q = course.quiz[currentQ];
    const isCorrect = optIndex === q.correctIndex;

    setAnswers((prev) => ({ ...prev, [currentQ]: optIndex }));
    setRevealed((prev) => ({ ...prev, [currentQ]: true }));

    if (isBlind) speak(isCorrect ? "Correct!" : `Wrong. The answer is ${q.options[q.correctIndex]}`);
  };

  const goNext = () => {
    if (currentQ < course.quiz.length - 1) setCurrentQ((p) => p + 1);
  };
  const goPrev = () => {
    if (currentQ > 0) setCurrentQ((p) => p - 1);
  };

  const handleSubmit = async () => {
    if (!course) return;
    let correct = 0;
    course.quiz.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    const finalScore = Math.round((correct / course.quiz.length) * 100);
    setCorrectCount(correct);
    setScore(finalScore);
    setSubmitted(true);
    await submitQuiz(id, finalScore);
    if (isBlind) speak(`Quiz complete. You scored ${finalScore} percent. ${correct} out of ${course.quiz.length} correct.`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-teal-200 border-t-teal-500 animate-spin" />
        <div className="text-gray-500">Loading quiz...</div>
      </div>
    </div>
  );

  if (!course || course.quiz?.length === 0) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
      <div className="text-center">
        <div className="text-5xl mb-4">📭</div>
        <div className="text-gray-500">No quiz available for this course.</div>
        <button onClick={() => navigate(`/courses/${id}`)} className="mt-4 text-teal-600 underline">
          Back to course
        </button>
      </div>
    </div>
  );

  const totalQ = course.quiz.length;
  const answeredCount = Object.keys(revealed).length;
  const progressPct = Math.round((answeredCount / totalQ) * 100);
  const canSubmit = answeredCount === totalQ;

  // Score screen
  if (submitted) {
    const grade = score >= 80 ? "Excellent!" : score >= 60 ? "Good job!" : "Keep practicing!";
    const gradeIcon = score >= 80 ? "🏆" : score >= 60 ? "🎯" : "📚";
    const gradeColor = score >= 80 ? "#10b981" : score >= 60 ? "#f5a623" : "#f95252";

    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
            {/* Score banner */}
            <div
              className="p-8 text-center relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${gradeColor}22, ${gradeColor}08)` }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-7xl mb-4"
              >
                {gradeIcon}
              </motion.div>
              <h1
                className="text-3xl font-extrabold mb-2"
                style={{ fontFamily: "var(--font-display)", color: gradeColor }}
              >
                {grade}
              </h1>

              {/* Score ring */}
              <div className="flex items-center justify-center my-6">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={gradeColor} strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - score / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-2xl font-extrabold"
                      style={{ fontFamily: "var(--font-display)", color: gradeColor }}
                    >
                      {score}%
                    </motion.span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                {correctCount} out of {totalQ} correct
              </p>
            </div>

            {/* Per-question review */}
            <div className="p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">
                Review
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {course.quiz.map((q, i) => {
                  const correct = answers[i] === q.correctIndex;
                  return (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 ${correct ? "text-emerald-500" : "text-red-500"}`}>
                        {correct ? "✓" : "✗"}
                      </span>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">{q.question}</span>
                        {!correct && (
                          <div className="text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">
                            Correct: {q.options[q.correctIndex]}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setSubmitted(false); setAnswers({}); setRevealed({}); setCurrentQ(0); }}
                className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:-translate-y-0.5"
                style={{ borderColor: "var(--teal-400)", color: "var(--teal-600)" }}
              >
                🔁 Retake Quiz
              </button>
              <button
                onClick={() => navigate(`/courses/${id}`)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #00bfa5, #008c7a)" }}
              >
                Back to Course
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #5c6bc0, #3f51b5)" }}
              >
                More Courses →
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  const q = course.quiz[currentQ];
  const selectedOpt = answers[currentQ];
  const isRevealed = revealed[currentQ];

  return (
    <main id="main-content" className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(`/courses/${id}`)}
          className="text-sm font-medium mb-5 flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{ color: "var(--teal-600)" }}
        >
          ← Back to Course
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1
            className="text-xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Quiz — {course.title}
          </h1>
          <button
            onClick={() => setShowSign((p) => !p)}
            className="text-sm px-3 py-1.5 rounded-xl font-medium border transition-all"
            style={{
              borderColor: showSign ? "var(--teal-400)" : "#e5e7eb",
              color: showSign ? "var(--teal-600)" : "#9ca3af",
              background: showSign ? "rgba(0,191,165,0.07)" : "transparent",
            }}
          >
            🤟
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Question {currentQ + 1} of {totalQ}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--teal-400), var(--teal-600))" }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {/* Dot indicators */}
          <div className="flex gap-1 mt-2">
            {course.quiz.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className="flex-1 h-1.5 rounded-full transition-all"
                style={{
                  background: revealed[i]
                    ? answers[i] === course.quiz[i].correctIndex ? "#10b981" : "#f95252"
                    : i === currentQ ? "var(--teal-500)" : "#e5e7eb",
                }}
              />
            ))}
          </div>
        </div>

        {/* Sign language avatar */}
        <AnimatePresence>
          {showSign && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <SignLanguageAvatar topic={course.title} inline />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-4"
          >
            <p className="text-gray-900 dark:text-white font-semibold text-lg mb-6 leading-relaxed">
              {q.question}
            </p>

            <div className="space-y-3">
              {q.options.map((opt, optIdx) => {
                let stateClass = "quiz-option";
                let stateStyle = {};

                if (isRevealed) {
                  if (optIdx === q.correctIndex) {
                    stateClass += " correct";
                    stateStyle = { borderColor: "#10b981", background: "rgba(16,185,129,0.1)" };
                  } else if (optIdx === selectedOpt) {
                    stateClass += " wrong";
                    stateStyle = { borderColor: "#ef4444", background: "rgba(239,68,68,0.08)" };
                  }
                } else if (optIdx === selectedOpt) {
                  stateStyle = { borderColor: "var(--teal-500)", background: "rgba(0,191,165,0.08)" };
                }

                return (
                  <motion.button
                    key={optIdx}
                    onClick={() => handleAnswer(optIdx)}
                    disabled={isRevealed}
                    whileHover={!isRevealed ? { x: 4 } : {}}
                    whileTap={!isRevealed ? { scale: 0.98 } : {}}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-3 transition-all ${stateClass} ${isMotor ? "text-base py-5" : "text-sm"}`}
                    style={stateStyle}
                    aria-label={`Option ${optIdx + 1}: ${opt}`}
                  >
                    <span
                      className="w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={
                        isRevealed && optIdx === q.correctIndex
                          ? { borderColor: "#10b981", background: "#10b981", color: "white" }
                          : isRevealed && optIdx === selectedOpt
                          ? { borderColor: "#ef4444", background: "#ef4444", color: "white" }
                          : { borderColor: "currentColor" }
                      }
                    >
                      {isRevealed && optIdx === q.correctIndex ? "✓" :
                       isRevealed && optIdx === selectedOpt ? "✗" :
                       String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback message */}
            <AnimatePresence>
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 px-4 py-3 rounded-xl text-sm font-medium"
                  style={
                    answers[currentQ] === q.correctIndex
                      ? { background: "rgba(16,185,129,0.1)", color: "#059669" }
                      : { background: "rgba(239,68,68,0.08)", color: "#dc2626" }
                  }
                >
                  {answers[currentQ] === q.correctIndex
                    ? "✓ Correct!"
                    : `✗ The correct answer is: "${q.options[q.correctIndex]}"`}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={goPrev}
            disabled={currentQ === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border-2 border-gray-200 dark:border-gray-700 disabled:opacity-30 transition-all hover:-translate-y-0.5"
          >
            ← Prev
          </button>

          {currentQ < totalQ - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #00bfa5, #008c7a)" }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-40"
              style={{
                background: canSubmit ? "linear-gradient(135deg, #5c6bc0, #3f51b5)" : "#9ca3af",
              }}
            >
              {canSubmit ? "Submit Quiz 🎯" : `Answer all ${totalQ} questions`}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}