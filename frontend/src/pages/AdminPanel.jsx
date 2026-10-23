import { useEffect, useState } from "react";
import { getCourses, createCourse } from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  description: "",
  videoUrl: "",
  modules: [{ title: "", content: "" }],
  quiz: [{ question: "", options: ["", "", "", ""], correctIndex: 0 }],
};

export default function AdminPanel() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("courses"); // "courses" | "add"

  useEffect(() => {
    getCourses().then((r) => setCourses(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await createCourse(form);
      setSuccess("Course created successfully!");
      setForm(emptyForm);
      const r = await getCourses();
      setCourses(r.data);
      setTab("courses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  const updateModule = (i, field, val) => {
    const mods = [...form.modules];
    mods[i][field] = val;
    setForm({ ...form, modules: mods });
  };

  const addModule = () =>
    setForm({ ...form, modules: [...form.modules, { title: "", content: "" }] });

  const updateQuizQuestion = (i, field, val) => {
    const quiz = [...form.quiz];
    quiz[i][field] = val;
    setForm({ ...form, quiz });
  };

  const updateQuizOption = (qi, oi, val) => {
    const quiz = [...form.quiz];
    quiz[qi].options[oi] = val;
    setForm({ ...form, quiz });
  };

  const addQuestion = () =>
    setForm({
      ...form,
      quiz: [...form.quiz, { question: "", options: ["", "", "", ""], correctIndex: 0 }],
    });

  return (
    <main id="main-content" className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Logged in as <span className="font-medium text-red-500">{user?.name}</span> (Admin)
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Courses", value: courses.length, icon: "📚" },
            { label: "With Quizzes", value: courses.filter((c) => c.quiz?.length > 0).length, icon: "❓" },
            { label: "Avg Modules", value: courses.length ? Math.round(courses.reduce((a, c) => a + (c.modules?.length || 0), 0) / courses.length) : 0, icon: "📖" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("courses")}
            className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${tab === "courses" ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}
          >
            View Courses
          </button>
          <button
            onClick={() => setTab("add")}
            className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${tab === "add" ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}
          >
            + Add Course
          </button>
        </div>

        {/* Course list */}
        {tab === "courses" && (
          <div className="space-y-3">
            {courses.length === 0 && (
              <div className="text-center py-12 text-gray-400">No courses yet. Add one!</div>
            )}
            {courses.map((c) => (
              <div key={c._id} className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{c.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">{c.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    <span>📖 {c.modules?.length || 0} modules</span>
                    <span>❓ {c.quiz?.length || 0} questions</span>
                  </div>
                </div>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full font-medium">
                  Published
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Add course form */}
        {tab === "add" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
                ✅ {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Basic info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Course Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Introduction to Web Accessibility"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="What will students learn?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube Video URL *</label>
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Modules */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-white">Modules</h2>
                <button type="button" onClick={addModule} className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                  + Add Module
                </button>
              </div>
              {form.modules.map((mod, i) => (
                <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Module {i + 1}</p>
                  <input
                    type="text"
                    value={mod.title}
                    onChange={(e) => updateModule(i, "title", e.target.value)}
                    placeholder="Module title"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    value={mod.content}
                    onChange={(e) => updateModule(i, "content", e.target.value)}
                    placeholder="Module content"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>

            {/* Quiz */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-white">Quiz Questions</h2>
                <button type="button" onClick={addQuestion} className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                  + Add Question
                </button>
              </div>
              {form.quiz.map((q, qi) => (
                <div key={qi} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Question {qi + 1}</p>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuizQuestion(qi, "question", e.target.value)}
                    placeholder="Question text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <input
                        key={oi}
                        type="text"
                        value={opt}
                        onChange={(e) => updateQuizOption(qi, oi, e.target.value)}
                        placeholder={`Option ${["A","B","C","D"][oi]}`}
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ))}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Correct Answer</label>
                    <select
                      value={q.correctIndex}
                      onChange={(e) => updateQuizQuestion(qi, "correctIndex", parseInt(e.target.value))}
                      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {["A", "B", "C", "D"].map((l, i) => (
                        <option key={i} value={i}>Option {l}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-4 rounded-xl text-base transition-colors"
            >
              {loading ? "Creating Course..." : "Create Course →"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}