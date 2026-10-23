import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateDisability } from "../services/api";
import { speak } from "../utils/tts";

const options = [
  {
    value: "blind",
    icon: "👁️",
    label: "Visual Impairment",
    desc: "I have difficulty seeing. I need voice navigation, screen reader support and high contrast.",
    border: "border-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    selected: "border-blue-600 ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/40",
  },
  {
    value: "deaf",
    icon: "👂",
    label: "Hearing Impairment",
    desc: "I have difficulty hearing. I need captions, visual alerts and text-based content.",
    border: "border-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    selected: "border-green-600 ring-2 ring-green-500 bg-green-100 dark:bg-green-900/40",
  },
  {
    value: "speech",
    icon: "🗣️",
    label: "Speech Impairment",
    desc: "I have difficulty speaking. I prefer text chat, quick replies and symbol-based interaction.",
    border: "border-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    selected: "border-yellow-600 ring-2 ring-yellow-500 bg-yellow-100 dark:bg-yellow-900/40",
  },
  {
    value: "motor",
    icon: "🖐️",
    label: "Motor Disability",
    desc: "I have limited physical movement. I need large buttons, fewer clicks and simple navigation.",
    border: "border-pink-400",
    bg: "bg-pink-50 dark:bg-pink-900/20",
    selected: "border-pink-600 ring-2 ring-pink-500 bg-pink-100 dark:bg-pink-900/40",
  },
];

export default function DisabilitySelect() {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { updateDisability: updateCtx } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (value) => {
    setSelected(value);
    speak(`Selected ${value} impairment`);
  };

  const handleSubmit = async () => {
    if (!selected) {
      setError("Please select one option to continue.");
      speak("Please select your accessibility need.");
      return;
    }
    setLoading(true);
    try {
      await updateDisability(selected);
      updateCtx(selected);
      speak("Setting up your personalised experience. Opening dashboard.");
      navigate("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            How can we help you learn?
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Select your accessibility need. We'll personalise the entire platform just for you.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`text-left p-6 rounded-2xl border-2 transition-all cursor-pointer w-full
                ${selected === opt.value ? opt.selected : `${opt.border} ${opt.bg} hover:shadow-md`}`}
              aria-pressed={selected === opt.value}
            >
              <div className="text-4xl mb-3">{opt.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                {opt.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{opt.desc}</p>
              {selected === opt.value && (
                <div className="mt-3 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  ✓ Selected
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-4 rounded-xl text-lg transition-colors"
        >
          {loading ? "Setting up your experience..." : "Continue to Dashboard →"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          You can change this anytime from your profile settings.
        </p>
      </div>
    </div>
  );
}