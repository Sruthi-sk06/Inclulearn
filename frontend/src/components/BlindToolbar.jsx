import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutAPI } from "../services/api";
import { getCourses } from "../services/api";
import {
  speak,
  isVoiceSupported,
  handleCommand,
  startListening,
} from "../utils/voiceNavigation";
import { readPageContent } from "../utils/tts";

export default function BlindToolbar({ onOpenChatbot, onOpenSchemes }) {
  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [fontSize, setFontSize] = useState(100);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Load courses so voice can open them by name
  useEffect(() => {
    getCourses()
      .then((r) => setCourses(r.data))
      .catch(() => {});
  }, []);

  const doLogout = async () => {
    await logoutAPI();
    logout();
    navigate("/login");
  };

  const handleVoice = () => {
    if (!isVoiceSupported()) {
      speak("Voice not supported. Please use Chrome.");
      return;
    }
    setListening(true);
    speak("Listening. Say your command.");
    startListening((command) => {
      setLastCommand(command);
      handleCommand(command, navigate, {
        logout: doLogout,
        courses,
        openChatbot: onOpenChatbot,
        openSchemes: onOpenSchemes,
      });
      setListening(false);
    });
  };

  const changeFontSize = (delta) => {
    const next = Math.min(130, Math.max(90, fontSize + delta));
    setFontSize(next);
    document.body.style.fontSize = `${next}%`;
    speak(`Font size ${next} percent`);
  };

  return (
    <div
      className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex flex-wrap gap-2 items-center"
      role="toolbar"
      aria-label="Blind mode toolbar"
    >
      <span className="text-yellow-400 font-bold text-xs">♿ Blind Mode</span>

      <button
        onClick={readPageContent}
        className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 py-1.5 rounded-lg text-xs"
        aria-label="Read page"
      >
        🔊 Read Page
      </button>

      <button
        onClick={() => window.speechSynthesis?.cancel()}
        className="bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs"
        aria-label="Stop"
      >
        ⏹ Stop
      </button>

      {isVoiceSupported() ? (
        <button
          onClick={handleVoice}
          className={`font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors ${
            listening
              ? "bg-green-500 animate-pulse text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
          aria-label="Voice navigation"
        >
          {listening ? "🎙 Listening..." : "🎙 Voice Nav"}
        </button>
      ) : (
        <span className="bg-gray-700 text-gray-400 px-3 py-1.5 rounded-lg text-xs">
          🎙 N/A
        </span>
      )}

      <button
        onClick={() => changeFontSize(-10)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1.5 rounded-lg text-xs"
        aria-label="Decrease font"
      >A-</button>
      <button
        onClick={() => changeFontSize(10)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1.5 rounded-lg text-xs"
        aria-label="Increase font"
      >A+</button>

      <span className="text-gray-500 text-xs ml-auto hidden sm:block">
        Say: "dashboard" • "courses" • "open course HTML" • "chatbot" • "schemes" • "help"
      </span>

      {lastCommand && (
        <span className="text-green-400 text-xs w-full" aria-live="polite">
          ✓ "{lastCommand}"
        </span>
      )}
    </div>
  );
}