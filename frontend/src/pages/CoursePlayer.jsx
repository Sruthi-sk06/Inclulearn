import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCourse, markCompleted, getProgress } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { speak } from "../utils/tts";


const topicMap = {
  html: "html", javascript: "javascript", js: "javascript",
  accessibility: "accessibility", web: "accessibility",
  css: "css", react: "react", python: "python",
};

function getTopicKey(title = "") {
  const t = title.toLowerCase();
  for (const [key, val] of Object.entries(topicMap)) {
    if (t.includes(key)) return val;
  }
  return "default";
}

export default function CoursePlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState(new Set());

  
  const isDeaf = user?.disability === "deaf";
  const isMotor = user?.disability === "motor";
  const isBlind = user?.disability === "blind";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes] = await Promise.all([getCourse(id), getProgress()]);
        setCourse(cRes.data);

        const p = pRes.data.find(
          (x) => (x.courseId?._id || x.courseId) === id
        );
        if (p?.completed) setCompleted(true);

        if (isBlind) {
          speak(`Now playing: ${cRes.data.title}. ${cRes.data.description}`);
        }
      } catch {
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);



  const handleMarkCompleted = async () => {
    setMarking(true);
    try {
      await markCompleted(id);
      setCompleted(true);

      if (isBlind) {
        speak("Course marked as completed. Take the quiz.");
      }
    } catch {
      alert("Failed. Try again.");
    } finally {
      setMarking(false);
    }
  };

  const handleModuleComplete = (idx) => {
    setCompletedModules((prev) => new Set([...prev, idx]));
    if (idx < (course?.modules?.length || 0) - 1) {
      setActiveModule(idx + 1);
    }
  };

  const getEmbedUrl = (url = "") => {
    if (url.includes("embed")) return url;
    const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return m
      ? `https://www.youtube.com/embed/${m[1]}?enablejsapi=1`
      : url;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-teal-200 border-t-teal-500 animate-spin" />
          <div className="text-gray-500 dark:text-gray-400">
            Loading course...
          </div>
        </div>
      </div>
    );

  const modules = course?.modules || [];
  const moduleProgress = Math.round(
    (completedModules.size / Math.max(modules.length, 1)) * 100
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button onClick={() => navigate("/courses")} className="mb-4">
            ← Back
          </button>

          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-gray-500">{course.description}</p>
        </motion.div>

        {/* Video */}
        <div className="bg-black rounded-xl overflow-hidden mt-4 aspect-video">
          <iframe
            src={getEmbedUrl(course.videoUrl)}
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleMarkCompleted}
            disabled={completed || marking}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {completed ? "Completed" : "Mark Complete"}
          </button>
        </div>

        {/* Modules */}
        <div className="mt-6">
          {modules.map((mod, idx) => (
            <div key={idx} className="mb-4">
              <h3>{mod.title}</h3>
              <p>{mod.content}</p>
              <button onClick={() => handleModuleComplete(idx)}>
                Done
              </button>
            </div>
          ))}
        </div>

        {/* Quiz */}
        {completed && (
          <button
            onClick={() => navigate(`/courses/${id}/quiz`)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Take Quiz
          </button>
        )}
      </div>
    </main>
  );
}