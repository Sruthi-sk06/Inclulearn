import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { govSchemes } from "../data/govSchemes";
import { useAuth } from "../context/AuthContext";
import { speak } from "../utils/tts";

const disabilityColors = {
  blind: { bg: "bg-blue-600", light: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  deaf: { bg: "bg-emerald-600", light: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
  speech: { bg: "bg-amber-600", light: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
  motor: { bg: "bg-pink-600", light: "bg-pink-50 dark:bg-pink-900/20", border: "border-pink-200 dark:border-pink-800", badge: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300" },
};

export default function GovSchemes({ onClose }) {
  const { user } = useAuth();
  const disability = user?.disability || "blind";
  const schemes = govSchemes[disability] || [];
  const colors = disabilityColors[disability];
  const [expanded, setExpanded] = useState(null);

  const handleExpand = (i, scheme) => {
    setExpanded(expanded === i ? null : i);
    if (user?.disability === "blind") {
      speak(`${scheme.name}. ${scheme.description}. Benefit: ${scheme.benefit}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className={`${colors.bg} px-6 py-4 flex items-center justify-between`}>
          <div>
            <h2 className="text-white font-bold text-xl">🏛️ Government Schemes</h2>
            <p className="text-white/70 text-sm capitalize">
              For {disability === "motor" ? "Motor Disabled" : disability.charAt(0).toUpperCase() + disability.slice(1)} persons
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-light"
            aria-label="Close schemes panel"
          >✕</button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-3">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {schemes.length} schemes available for you. Click any scheme to learn more.
          </p>

          {schemes.map((scheme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border-2 ${colors.border} ${colors.light} overflow-hidden`}
            >
              <button
                onClick={() => handleExpand(i, scheme)}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
                aria-expanded={expanded === i}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {scheme.name}
                    </h3>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                    {scheme.ministry}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: expanded === i ? 180 : 0 }}
                  className="text-gray-400 text-sm mt-1 flex-shrink-0"
                >▼</motion.span>
              </button>

              <AnimatePresence>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-5 pb-4 space-y-3">
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {scheme.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Benefit:
                        </span>
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">
                          💰 {scheme.benefit}
                        </span>
                      </div>
                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-block text-xs ${colors.bg} text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity`}
                      >
                        Visit Official Website →
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 text-center">
            Data sourced from official Government of India portals. Visit links for latest updates.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}