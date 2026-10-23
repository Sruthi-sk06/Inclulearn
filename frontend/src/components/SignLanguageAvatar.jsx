import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Extended gesture library — ISL/ASL mapping with descriptions
const gestureLibrary = {
  // Basics
  hello:       { hand: "👋", label: "Hello", leftAngle: 45, rightAngle: -20, bodyColor: "#00bfa5", desc: "Wave hand side to side" },
  yes:         { hand: "👍", label: "Yes",   leftAngle: 0,  rightAngle: 60,  bodyColor: "#10b981", desc: "Nod fist up and down" },
  no:          { hand: "✌️", label: "No",    leftAngle: -30, rightAngle: -60, bodyColor: "#f95252", desc: "Index and middle finger wave" },
  help:        { hand: "🤲", label: "Help",  leftAngle: 20, rightAngle: 20,  bodyColor: "#5c6bc0", desc: "Fist on open palm, lift up" },
  thank:       { hand: "🙏", label: "Thank You", leftAngle: 30, rightAngle: 30, bodyColor: "#f5a623", desc: "Flat hand from chin forward" },
  please:      { hand: "🤜", label: "Please", leftAngle: 15, rightAngle: -15, bodyColor: "#ec4899", desc: "Circle flat hand on chest" },
  sorry:       { hand: "✊", label: "Sorry", leftAngle: 0,  rightAngle: 0,  bodyColor: "#f97316", desc: "Fist circles on chest" },
  // Learning
  learn:       { hand: "📖", label: "Learning", leftAngle: -40, rightAngle: 40, bodyColor: "#00bfa5", desc: "Open hands as if reading" },
  understand:  { hand: "💡", label: "Understand", leftAngle: 70, rightAngle: 0, bodyColor: "#f5a623", desc: "Index finger flick off forehead" },
  question:    { hand: "❓", label: "Question", leftAngle: -50, rightAngle: 60, bodyColor: "#5c6bc0", desc: "Draw a question mark in air" },
  // Course terms
  html:        { hand: "🌐", label: "HTML", leftAngle: 35, rightAngle: -35, bodyColor: "#e07b39", desc: "Fingerspell H-T-M-L" },
  javascript:  { hand: "⚡", label: "JavaScript", leftAngle: 60, rightAngle: -60, bodyColor: "#f5a623", desc: "Fingerspell J-S" },
  accessibility:{ hand: "♿", label: "Accessibility", leftAngle: 20, rightAngle: -20, bodyColor: "#3f51b5", desc: "Sign: A + open hands" },
  css:         { hand: "🎨", label: "CSS", leftAngle: -30, rightAngle: 50, bodyColor: "#264de4", desc: "Fingerspell C-S-S" },
  react:       { hand: "⚛️", label: "React", leftAngle: 50, rightAngle: -40, bodyColor: "#61dafb", desc: "Circle both index fingers" },
  python:      { hand: "🐍", label: "Python", leftAngle: -60, rightAngle: 30, bodyColor: "#3572a5", desc: "Fingerspell P-Y" },
  sign:        { hand: "🤟", label: "Sign Language", leftAngle: -30, rightAngle: 60, bodyColor: "#00bfa5", desc: "I Love You handshape" },
  // Navigation
  next:        { hand: "➡️", label: "Next",  leftAngle: 0,  rightAngle: 80,  bodyColor: "#00bfa5", desc: "Point forward" },
  back:        { hand: "⬅️", label: "Back",  leftAngle: -80, rightAngle: 0,  bodyColor: "#6b7280", desc: "Thumb back" },
  default:     { hand: "🤟", label: "I Love You", leftAngle: -20, rightAngle: 40, bodyColor: "#00bfa5", desc: "ISL: I Love You" },
};

// Resolve topic to gesture key
function resolveGesture(topic = "") {
  const t = topic.toLowerCase();
  for (const key of Object.keys(gestureLibrary)) {
    if (t.includes(key)) return key;
  }
  return "default";
}

// SVG stick figure avatar
function AvatarFigure({ gesture, animating, size = 160 }) {
  const g = gestureLibrary[gesture] || gestureLibrary.default;
  const s = size / 160; // scale factor
  const cx = 80; // center x
  const bodyColor = g.bodyColor;

  const leftRad = (g.leftAngle * Math.PI) / 180;
  const rightRad = (g.rightAngle * Math.PI) / 180;
  const armLen = 38 * s;

  // Left arm end
  const lx = cx - 18 * s + Math.sin(leftRad - Math.PI / 2) * armLen;
  const ly = 85 * s + Math.cos(leftRad - Math.PI / 2) * armLen;
  // Right arm end
  const rx = cx + 18 * s + Math.sin(rightRad + Math.PI / 2) * armLen;
  const ry = 85 * s + Math.cos(rightRad + Math.PI / 2) * armLen;

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox={`0 0 160 176`}
      aria-label={`Sign language avatar showing: ${g.label}`}
    >
      {/* Body shadow */}
      <ellipse cx="80" cy="170" rx="28" ry="5" fill="rgba(0,0,0,0.08)" />

      {/* Body (torso) */}
      <motion.line
        x1="80" y1="78" x2="80" y2="130"
        stroke={bodyColor} strokeWidth="7" strokeLinecap="round"
        animate={animating ? { pathLength: [1, 0.8, 1] } : {}}
        transition={{ duration: 0.4 }}
      />

      {/* Left leg */}
      <motion.line
        x1="80" y1="130" x2="58" y2="162"
        stroke={bodyColor} strokeWidth="6" strokeLinecap="round"
        animate={animating ? { rotate: [0, -5, 0] } : {}}
      />
      {/* Right leg */}
      <motion.line
        x1="80" y1="130" x2="102" y2="162"
        stroke={bodyColor} strokeWidth="6" strokeLinecap="round"
        animate={animating ? { rotate: [0, 5, 0] } : {}}
      />

      {/* Left arm */}
      <motion.line
        x1="62" y1="85" x2={lx} y2={ly}
        stroke={bodyColor} strokeWidth="6" strokeLinecap="round"
        animate={animating ? {
          x2: [lx, lx + 8, lx],
          y2: [ly, ly - 8, ly],
        } : { x2: lx, y2: ly }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      {/* Right arm */}
      <motion.line
        x1="98" y1="85" x2={rx} y2={ry}
        stroke={bodyColor} strokeWidth="6" strokeLinecap="round"
        animate={animating ? {
          x2: [rx, rx - 8, rx],
          y2: [ry, ry - 8, ry],
        } : { x2: rx, y2: ry }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
      />

      {/* Head */}
      <motion.circle
        cx="80" cy="55" r="24"
        fill="white" stroke={bodyColor} strokeWidth="4"
        animate={animating ? { y: [-2, 2, -2] } : { y: 0 }}
        transition={{ duration: 1.5, repeat: animating ? 2 : 0 }}
        style={{ originX: "80px", originY: "55px" }}
      />

      {/* Face — eyes */}
      <circle cx="73" cy="52" r="3.5" fill={bodyColor} />
      <circle cx="87" cy="52" r="3.5" fill={bodyColor} />
      {/* Smile */}
      <path
        d="M 73 61 Q 80 67 87 61"
        fill="none" stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round"
      />

      {/* Hand gesture emoji above head */}
      <motion.text
        x="80" y="26"
        textAnchor="middle"
        fontSize="20"
        animate={animating ? {
          scale: [1, 1.4, 1],
          y: [26, 18, 26],
        } : {}}
        transition={{ duration: 0.5 }}
        style={{ originX: "80px", originY: "26px" }}
      >
        {g.hand}
      </motion.text>
    </svg>
  );
}

// ── Inline mode: embedded inside CoursePlayer ──
function InlineAvatar({ topic }) {
  const [currentGesture, setCurrentGesture] = useState(resolveGesture(topic));
  const [animating, setAnimating] = useState(false);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const key = resolveGesture(topic);
    setCurrentGesture(key);
    triggerAnimation();
    setCaption(gestureLibrary[key]?.desc || "");
  }, [topic]);

  // Idle cycle
  useEffect(() => {
    const keys = Object.keys(gestureLibrary);
    const timer = setInterval(() => {
      const rk = keys[Math.floor(Math.random() * keys.length)];
      setCurrentGesture(rk);
      setCaption(gestureLibrary[rk]?.desc || "");
      triggerAnimation();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const triggerAnimation = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
  };

  const g = gestureLibrary[currentGesture] || gestureLibrary.default;

  return (
    <div
      className="rounded-2xl p-5 border flex items-center gap-5"
      style={{
        background: `linear-gradient(135deg, ${g.bodyColor}12, ${g.bodyColor}06)`,
        borderColor: `${g.bodyColor}40`,
      }}
    >
      <AvatarFigure gesture={currentGesture} animating={animating} size={120} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{g.hand}</span>
          <h3
            className="font-bold text-gray-900 dark:text-white text-lg"
            style={{ fontFamily: "var(--font-display)", color: g.bodyColor }}
          >
            {g.label}
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{g.desc}</p>
        {/* Quick signs */}
        <div className="flex flex-wrap gap-2">
          {["hello", "yes", "no", "help", "thank", "learn"].map((k) => (
            <button
              key={k}
              onClick={() => {
                setCurrentGesture(k);
                setCaption(gestureLibrary[k]?.desc || "");
                triggerAnimation();
              }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium border transition-all hover:-translate-y-0.5"
              style={{
                borderColor: currentGesture === k ? g.bodyColor : "#e5e7eb",
                background: currentGesture === k ? `${g.bodyColor}15` : "transparent",
                color: currentGesture === k ? g.bodyColor : "#6b7280",
              }}
            >
              {gestureLibrary[k].hand} {gestureLibrary[k].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Floating mode: fixed bottom-left bubble ──
function FloatingAvatar({ topic, autoAnimate }) {
  const [visible, setVisible] = useState(false);
  const [currentGesture, setCurrentGesture] = useState(resolveGesture(topic));
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const key = resolveGesture(topic);
    setCurrentGesture(key);
    triggerAnimation();
  }, [topic]);

  useEffect(() => {
    if (!visible || !autoAnimate) return;
    const keys = Object.keys(gestureLibrary);
    const timer = setInterval(() => {
      const rk = keys[Math.floor(Math.random() * keys.length)];
      setCurrentGesture(rk);
      triggerAnimation();
    }, 4000);
    return () => clearInterval(timer);
  }, [visible, autoAnimate]);

  const triggerAnimation = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
  };

  const g = gestureLibrary[currentGesture] || gestureLibrary.default;

  return (
    <>
      {!visible && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setVisible(true)}
          className="fixed bottom-24 left-5 z-50 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-semibold text-sm"
          style={{ background: "linear-gradient(135deg, #00bfa5, #008c7a)" }}
        >
          🤟 Sign
        </motion.button>
      )}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.9 }}
            className="fixed bottom-20 left-5 z-50 w-72"
            style={{ filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.2))" }}
          >
            <div
              className="rounded-2xl overflow-hidden border"
              style={{
                background: "#1a1a2e",
                borderColor: `${g.bodyColor}50`,
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-2.5 flex items-center justify-between"
                style={{ background: g.bodyColor }}
              >
                <span className="text-white text-sm font-bold">🤟 ISL Interpreter</span>
                <button onClick={() => setVisible(false)} className="text-white opacity-80 hover:opacity-100">✕</button>
              </div>

              {/* Avatar */}
              <div className="p-4 flex flex-col items-center">
                <AvatarFigure gesture={currentGesture} animating={animating} size={130} />

                <motion.p
                  key={currentGesture}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-bold text-sm mt-2"
                  style={{ color: g.bodyColor }}
                >
                  {g.label}
                </motion.p>
                <p className="text-gray-400 text-xs mt-1 text-center">{g.desc}</p>

                {/* Quick signs */}
                <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                  {["hello", "help", "yes", "no", "thank", "learn"].map((k) => (
                    <button
                      key={k}
                      onClick={() => { setCurrentGesture(k); triggerAnimation(); }}
                      className="text-xs px-2 py-1 rounded-lg transition-colors"
                      style={{
                        background: currentGesture === k ? g.bodyColor : "#2d2d44",
                        color: "white",
                      }}
                    >
                      {gestureLibrary[k].hand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption bar */}
              <div className="bg-black text-xs py-2 text-center font-mono" style={{ color: "#ffd700" }}>
                📝 {g.desc}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main export — choose mode based on `inline` prop ──
export default function SignLanguageAvatar({ topic = "learn", autoAnimate = true, inline = false }) {
  if (inline) {
    return <InlineAvatar topic={topic} />;
  }
  return <FloatingAvatar topic={topic} autoAnimate={autoAnimate} />;
}