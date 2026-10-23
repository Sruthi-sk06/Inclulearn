import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { speak } from "../utils/tts";

const quickReplies = [
  { label: "📚 Open Courses", action: "/courses" },
  { label: "🏠 Dashboard", action: "/dashboard" },
  { label: "👤 Profile", action: "/profile" },
  { label: "❓ Help", action: "help" },
];

const helpText = "You can use quick reply buttons to navigate. Type in the chat box below to ask questions. Text to speech is available for all content.";

export default function SpeechToolbar() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm your assistant. Use the quick buttons or type below to navigate." },
  ]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuickReply = (action) => {
    if (action === "help") {
      setMessages((p) => [...p,
        { from: "user", text: "Help" },
        { from: "bot", text: helpText },
      ]);
      speak(helpText);
      setOpen(true);
    } else {
      speak(`Opening ${action.replace("/", "")}`);
      navigate(action);
    }
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const input = chatInput.toLowerCase();
    let reply = "I didn't understand that. Try: courses, dashboard, profile, or help.";
    if (input.includes("course")) reply = "Opening courses for you!";
    if (input.includes("dashboard") || input.includes("home")) reply = "Going to dashboard!";
    if (input.includes("profile")) reply = "Opening your profile!";
    if (input.includes("help")) reply = helpText;

    setMessages((p) => [...p,
      { from: "user", text: chatInput },
      { from: "bot", text: reply },
    ]);
    speak(reply);
    setChatInput("");

    if (input.includes("course")) navigate("/courses");
    if (input.includes("dashboard")) navigate("/dashboard");
    if (input.includes("profile")) navigate("/profile");
  };

  return (
    <div className="bg-yellow-900 text-white px-4 py-3" role="toolbar" aria-label="Speech impairment toolbar">
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <span className="text-yellow-300 font-bold text-sm">🗣️ Speech Mode Active</span>
        {quickReplies.map((q) => (
          <button
            key={q.label}
            onClick={() => handleQuickReply(q.action)}
            className="bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            {q.label}
          </button>
        ))}
        <button
          onClick={() => setOpen((p) => !p)}
          className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm"
        >
          💬 {open ? "Hide Chat" : "Open Chat"}
        </button>
      </div>

      {open && (
        <div className="bg-yellow-950 rounded-xl p-3 mt-2 max-w-lg">
          <div className="h-32 overflow-y-auto mb-2 space-y-1">
            {messages.map((m, i) => (
              <div key={i} className={`text-xs px-3 py-1 rounded-lg w-fit max-w-xs ${
                m.from === "bot"
                  ? "bg-yellow-800 text-yellow-100"
                  : "bg-white text-gray-900 ml-auto"
              }`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-yellow-800 text-white placeholder-yellow-400 px-3 py-2 rounded-lg text-sm outline-none"
              aria-label="Chat input"
            />
            <button
              onClick={handleSend}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}