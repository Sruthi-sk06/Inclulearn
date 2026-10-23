import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { speak } from "../utils/tts";

// ── Response map ───────────────────────────────────────────────
const RESPONSES = {
  courses: { text: "📚 You have 8 courses: HTML, CSS, JavaScript, React, Python, Accessibility, UX Design, and Digital Literacy. Go to /courses to start.", nav: "/courses" },
  dashboard: { text: "🏠 Your dashboard shows your progress, completed courses, and quiz scores.", nav: "/dashboard" },
  profile: { text: "👤 Visit your profile to update your accessibility settings or change disability mode.", nav: "/profile" },
  quiz: { text: "🧠 Complete a course first, then click Take Quiz. Each quiz has 5 questions.", nav: null },
  progress: { text: "📊 Your progress is tracked on the dashboard. It updates when you complete a course or quiz.", nav: "/dashboard" },
  blind: { text: "👁️ Blind mode gives you automatic TTS, voice navigation, high contrast UI, and adjustable font size.", nav: null },
  deaf: { text: "👂 Deaf mode gives you sign language avatar, always-on captions, and visual alerts.", nav: null },
  speech: { text: "🗣️ Speech mode gives you quick replies, text chat, and TTS output.", nav: null },
  motor: { text: "🖐️ Motor mode auto-starts voice navigation, uses large buttons and single-click actions.", nav: null },
  accessibility: { text: "♿ This platform supports 4 modes: Blind, Deaf, Speech Impaired, and Motor Disability. Update your mode in Profile.", nav: "/profile" },
  voice: { text: "🎙️ Voice commands: dashboard, courses, profile, sign language, open chatbot, government schemes, open course [name], scroll down, scroll up, go back, read page, stop, logout.", nav: null },
  "sign language": { text: "🤟 Visit the Sign Language page to learn ISL alphabets, numbers, phrases and practice mode.", nav: "/sign-language" },
  schemes: { text: "🏛️ Government schemes are on your dashboard. Click Government Schemes button to see schemes for your disability.", nav: "/dashboard" },
  government: { text: "🏛️ Click Government Schemes on your dashboard to see disability-specific Indian government schemes.", nav: "/dashboard" },
  help: { text: "💡 I can help with: courses, quiz, progress, voice commands, sign language, government schemes, accessibility settings. What do you need?", nav: null },
  html: { text: "🌐 HTML Fundamentals: 5 modules covering tags, semantic HTML, forms, and accessibility.", nav: "/courses" },
  css: { text: "🎨 CSS Mastery: 5 modules covering box model, Flexbox, Grid, and responsive design.", nav: "/courses" },
  javascript: { text: "⚡ JavaScript Essentials: 5 modules covering variables, functions, DOM, and events.", nav: "/courses" },
  react: { text: "⚛️ React Basics: 5 modules covering components, props, state, hooks, and events.", nav: "/courses" },
  python: { text: "🐍 Python for Beginners: 5 modules covering syntax, functions, lists, and dictionaries.", nav: "/courses" },
  ux: { text: "🎯 UX Design Principles: 5 modules covering research, wireframing, and usability testing.", nav: "/courses" },
  digital: { text: "💻 Digital Literacy: 5 modules covering internet safety, cloud, and AI basics.", nav: "/courses" },
  certificate: { text: "🎓 Score 80%+ on a quiz to earn a badge. Badges appear on your dashboard.", nav: "/dashboard" },
  live: { text: "🎥 Join a live class by clicking Join Live Class on your dashboard.", nav: "/dashboard" },
  default: { text: "🤔 I'm not sure about that. Try asking about: courses, quiz, progress, voice, sign language, government schemes, or accessibility.", nav: null },
};

function getResponse(input) {
  if (!input || typeof input !== "string") return RESPONSES.default;
  const t = input.toLowerCase();
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (key !== "default" && t.includes(key)) return val;
  }
  return RESPONSES.default;
}

const QUICK = ["courses", "help", "voice commands", "sign language", "schemes"];

// ── Component ──────────────────────────────────────────────────
export default function Chatbot({ externalOpen, onClose }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! 👋 I'm your IncluLearn assistant. Ask me about courses, voice commands, accessibility features, or government schemes!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // External open (from voice command)
  useEffect(() => {
    if (externalOpen) setOpen(true);
  }, [externalOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const closeChat = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const sendMessage = (text) => {
    if (!text || !text.trim()) return;

    const userMsg = { from: "user", text: text.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setTyping(true);

    // Always resolve — no "trouble connecting" error
    setTimeout(() => {
      try {
        const response = getResponse(text);
        const botMsg = {
          from: "bot",
          text: response.text,
          nav: response.nav || null,
        };
        setMessages((p) => [...p, botMsg]);
        if (user?.disability === "blind") speak(response.text);
      } catch {
        setMessages((p) => [
          ...p,
          { from: "bot", text: "Sorry, something went wrong. Please try again.", nav: null },
        ]);
      } finally {
        setTyping(false);
      }
    }, 550);
  };

  const handleNav = (path) => {
    if (path) { navigate(path); closeChat(); }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => (open ? closeChat() : setOpen(true))}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-2xl flex items-center justify-center text-2xl pulse-ring"
        aria-label={open ? "Close assistant" : "Open AI assistant"}
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          {open ? "✕" : "🤖"}
        </motion.span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
            style={{ width: 340, height: 480 }}
            role="dialog"
            aria-label="AI Assistant"
          >
            {/* Header */}
            <div className="gradient-teal px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
                <div>
                  <p className="text-white font-bold text-sm">IncluLearn AI</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    <p className="text-teal-100 text-xs">Online</p>
                  </div>
                </div>
              </div>
              <button onClick={closeChat} className="text-teal-100 hover:text-white text-lg" aria-label="Close">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${m.from === "bot" ? "flex items-end gap-2" : ""}`}>
                    {m.from === "bot" && (
                      <div className="w-6 h-6 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-xs flex-shrink-0 mb-1">🤖</div>
                    )}
                    <div>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.from === "user"
                          ? "bg-teal-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                      }`}>
                        {m.text}
                      </div>
                      {m.nav && m.from === "bot" && (
                        <button
                          onClick={() => handleNav(m.nav)}
                          className="mt-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                        >
                          Take me there →
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-xs">🤖</div>
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-3 py-2 flex flex-wrap gap-1 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-lg transition-colors capitalize"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 flex gap-2 flex-shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask anything..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Chat input"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Send"
              >➤</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}