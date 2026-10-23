import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutAPI, getCourses } from "../services/api";
import {
  speak,
  isVoiceSupported,
  handleCommand,
  startContinuousListening,
} from "../utils/voiceNavigation";

export default function MotorToolbar({ onOpenChatbot, onOpenSchemes }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [courses, setCourses] = useState([]);
  const stopRef = useRef(null);

  useEffect(() => {
    getCourses().then((r) => setCourses(r.data)).catch(() => {});
  }, []);

  const doLogout = async () => {
    await logoutAPI();
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!isVoiceSupported()) return;

    const start = () => {
      speak("Motor mode active. Voice navigation started. Say help for commands.");
      stopRef.current = startContinuousListening((command) => {
        setLastCommand(command);
        handleCommand(command, navigate, {
          logout: doLogout,
          courses,
          openChatbot: onOpenChatbot,
          openSchemes: onOpenSchemes,
        });
      });
      setListening(true);
    };

    // Try auto-start; fallback to first click
    try {
      start();
    } catch {
      const handler = () => { start(); document.removeEventListener("click", handler); };
      document.addEventListener("click", handler, { once: true });
    }

    return () => { if (stopRef.current) stopRef.current(); };
  }, [courses]);

  const go = (path, label) => {
    speak(`Opening ${label}`);
    navigate(path);
  };

  return (
    <div className="bg-pink-900 text-white px-4 py-4" role="toolbar" aria-label="Motor mode toolbar">
      <div className="flex flex-wrap gap-3 items-center mb-3">
        <span className="text-pink-300 font-bold">🖐️ Motor Mode</span>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
          listening ? "bg-green-500 animate-pulse" : "bg-gray-600"
        }`}>
          {listening ? "🎙 Voice Active" : isVoiceSupported() ? "🎙 Starting..." : "🎙 Not Supported"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { label: "🏠 Dashboard", path: "/dashboard", name: "dashboard" },
          { label: "📚 Courses", path: "/courses", name: "courses" },
          { label: "🤟 Sign Language", path: "/sign-language", name: "sign language" },
          { label: "👤 Profile", path: "/profile", name: "profile" },
        ].map((btn) => (
          <button
            key={btn.path}
            onClick={() => go(btn.path, btn.name)}
            className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-6 py-3 rounded-xl text-base min-w-[130px] transition-colors"
          >
            {btn.label}
          </button>
        ))}
        <button
          onClick={doLogout}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl text-base min-w-[130px] transition-colors"
        >
          🚪 Logout
        </button>
      </div>

      {lastCommand && (
        <p className="text-pink-200 text-xs mt-3" aria-live="polite">
          ✓ Last command: "{lastCommand}"
        </p>
      )}
      <p className="text-pink-400 text-xs mt-1">
        {isVoiceSupported()
          ? 'Say: "dashboard" • "courses" • "open course React" • "chatbot" • "schemes" • "help"'
          : "Use Chrome for voice navigation."}
      </p>
    </div>
  );
}