import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { logout as logoutAPI } from "../services/api";
import { speak } from "../utils/tts";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAPI();
    logout();
    if (user?.disability === "blind") speak("Logged out successfully.");
    navigate("/login");
  };

  const isMotor = user?.disability === "motor";
  const isActive = (path) => location.pathname === path;

  const navLinks = user
    ? [
        { to: "/dashboard", label: "Dashboard", icon: "⊞" },
        { to: "/courses",   label: "Courses",   icon: "📚" },
        { to: "/sign-language", label: "Sign Language", icon: "🤟" },
        ...(user.role === "admin" ? [{ to: "/admin", label: "Admin", icon: "⚙️" }] : []),
        { to: "/profile",   label: "Profile",   icon: "👤" },
      ]
    : [];

  return (
    <nav
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2"
          aria-label="IncluLearn home"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #00bfa5, #008c7a)" }}
          >
            IL
          </div>
          <span
            className="text-lg font-bold"
            style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, #00bfa5, #3f51b5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            IncluLearn
          </span>
        </Link>

        {/* Desktop nav */}
        <div className={`hidden md:flex items-center ${isMotor ? "gap-5" : "gap-1"}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(link.to)
                  ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              } ${isMotor ? "text-base px-4 py-3" : ""}`}
              style={isActive(link.to) ? { color: "var(--teal-600)" } : {}}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              isMotor ? "p-3 text-xl" : "p-2 text-base"
            }`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className={`text-white font-semibold rounded-xl transition-all ${
                isMotor ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"
              }`}
              style={{
                background: "linear-gradient(135deg, #00bfa5, #008c7a)",
                boxShadow: "0 2px 12px rgba(0,191,165,0.3)",
              }}
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm text-white px-4 py-2 rounded-xl font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #00bfa5, #008c7a)",
                boxShadow: "0 2px 12px rgba(0,191,165,0.3)",
              }}
            >
              Login
            </Link>
          )}

          {/* Mobile hamburger */}
          {user && (
            <button
              className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? "bg-teal-50 dark:bg-teal-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  style={isActive(link.to) ? { color: "var(--teal-600)" } : {}}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}