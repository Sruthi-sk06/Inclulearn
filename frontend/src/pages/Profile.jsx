import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateDisability, logout as logoutAPI } from "../services/api";
import { speak } from "../utils/tts";

const disabilityOptions = [
  { value: "blind", label: "👁️ Visual Impairment", desc: "TTS, voice nav, high contrast" },
  { value: "deaf", label: "👂 Hearing Impairment", desc: "Captions, visual alerts" },
  { value: "speech", label: "🗣️ Speech Impairment", desc: "Chat, quick replies" },
  { value: "motor", label: "🖐️ Motor Disability", desc: "Large buttons, single click" },
];

export default function Profile() {
  const { user, updateDisability: updateCtx, logout } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(user?.disability || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDisability(selected);
      updateCtx(selected);
      setSaved(true);
      speak("Accessibility settings saved.");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutAPI();
    logout();
    speak("Logged out. Goodbye.");
    navigate("/login");
  };

  return (
    <main id="main-content" className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          My Profile
        </h1>

        {/* User info card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-2xl font-bold text-purple-600 dark:text-purple-400">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">
                {user?.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block
                ${user?.role === "admin"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"}`}>
                {user?.role === "admin" ? "Admin" : "Student"}
              </span>
            </div>
          </div>
        </div>

        {/* Accessibility settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
            Accessibility Settings
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
            Change your disability mode anytime. The UI will update immediately.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {disabilityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelected(opt.value)}
                className={`text-left p-4 rounded-xl border-2 transition-all
                  ${selected === opt.value
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-purple-300"}`}
                aria-pressed={selected === opt.value}
              >
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {opt.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || selected === user?.disability}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-purple-900 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Settings"}
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-red-100 dark:border-red-900/30 shadow-sm">
          <h2 className="font-semibold text-red-600 dark:text-red-400 mb-1">
            Sign Out
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            You will be redirected to the login page.
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>

      </div>
    </main>
  );
}