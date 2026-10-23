import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignLanguageAvatar from "../components/SignLanguageAvatar";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
  letter,
  emoji: { A:"🤌",B:"🫲",C:"🤙",D:"☝️",E:"✊",F:"🤏",G:"👈",H:"🤞",I:"🤙",J:"🤙",
            K:"✌️",L:"👈",M:"✊",N:"✊",O:"🤌",P:"👈",Q:"👇",R:"🤞",S:"✊",
            T:"✊",U:"✌️",V:"✌️",W:"🤟",X:"☝️",Y:"🤙",Z:"☝️" }[letter] || "🤟",
  desc: `Fingerspell letter ${letter}`,
}));

const NUMBERS = Array.from({ length: 10 }, (_, i) => ({
  num: i,
  emoji: ["✊","☝️","✌️","🤟","🖖","🖐️","🤙","🫲","🤌","✋"][i],
  desc: `Show ${i} fingers`,
}));

const PHRASES = [
  { text: "Hello",         emoji: "👋", category: "greetings", desc: "Wave hand side to side" },
  { text: "Thank You",     emoji: "🙏", category: "greetings", desc: "Flat hand from chin forward" },
  { text: "Please",        emoji: "🤜", category: "greetings", desc: "Rub flat hand on chest" },
  { text: "Sorry",         emoji: "✊", category: "greetings", desc: "Fist circles on chest" },
  { text: "Good Morning",  emoji: "🌅", category: "greetings", desc: "Open hand rises like sun" },
  { text: "Good Night",    emoji: "🌙", category: "greetings", desc: "Bent hand falls down" },
  { text: "Yes",           emoji: "👍", category: "basics",    desc: "Nod fist up and down" },
  { text: "No",            emoji: "✌️", category: "basics",    desc: "Index and middle finger wave" },
  { text: "Help",          emoji: "🤲", category: "basics",    desc: "Fist on open palm, lift up" },
  { text: "Water",         emoji: "💧", category: "basics",    desc: "W handshape taps chin" },
  { text: "Food",          emoji: "🍎", category: "basics",    desc: "Pinched fingers tap mouth" },
  { text: "Home",          emoji: "🏠", category: "basics",    desc: "Pinched fingers touch cheek then chin" },
  { text: "I Love You",    emoji: "🤟", category: "emotions",  desc: "Thumb, index, pinky extended" },
  { text: "Happy",         emoji: "😊", category: "emotions",  desc: "Brush up on chest twice" },
  { text: "Sad",           emoji: "😢", category: "emotions",  desc: "Both hands pull down face" },
  { text: "Angry",         emoji: "😠", category: "emotions",  desc: "Claw hands pulled inward" },
  { text: "Friend",        emoji: "🤝", category: "social",    desc: "Hook index fingers, swap" },
  { text: "Family",        emoji: "👨‍👩‍👧", category: "social",    desc: "F handshapes in circle" },
  { text: "School",        emoji: "🏫", category: "social",    desc: "Clap hands twice" },
  { text: "Work",          emoji: "💼", category: "social",    desc: "Wrists tap each other" },
];

const CATEGORIES = ["all", "greetings", "basics", "emotions", "social"];

const QUIZ_POOL = [...PHRASES.slice(0, 12)];

function LetterCard({ item, isNumber = false, isActive, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="rounded-xl p-3 flex flex-col items-center gap-1 border-2 transition-all"
      style={{
        borderColor: isActive ? "var(--teal-500)" : "#e5e7eb",
        background: isActive ? "rgba(0,191,165,0.1)" : "white",
        boxShadow: isActive ? "0 4px 15px rgba(0,191,165,0.2)" : "none",
      }}
    >
      <span className="text-2xl">{item.emoji}</span>
      <span
        className="text-lg font-bold"
        style={{
          fontFamily: "var(--font-display)",
          color: isActive ? "var(--teal-600)" : "#374151",
        }}
      >
        {isNumber ? item.num : item.letter}
      </span>
    </motion.button>
  );
}

function PhraseCard({ phrase, isActive, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="rounded-2xl p-4 text-left border-2 transition-all w-full"
      style={{
        borderColor: isActive ? "var(--teal-500)" : "#e5e7eb",
        background: isActive ? "rgba(0,191,165,0.08)" : "white",
      }}
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{phrase.emoji}</span>
        <span
          className="font-bold text-gray-900"
          style={{ fontFamily: "var(--font-display)", color: isActive ? "var(--teal-600)" : undefined }}
        >
          {phrase.text}
        </span>
      </div>
      <p className="text-xs text-gray-500">{phrase.desc}</p>
    </motion.button>
  );
}

function QuizMode({ onExit }) {
  const [pool] = useState(() => [...QUIZ_POOL].sort(() => Math.random() - 0.5).slice(0, 6));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = pool[currentIdx];

  const getOptions = (correct) => {
    const others = QUIZ_POOL.filter((p) => p.text !== correct.text)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [...others, correct].sort(() => Math.random() - 0.5);
  };

  const [options] = useState(() => pool.map((p) => getOptions(p)));

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt.text);
    if (opt.text === q.text) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIdx < pool.length - 1) {
        setCurrentIdx((p) => p + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 1200);
  };

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">{score >= 5 ? "🏆" : score >= 3 ? "🎯" : "📚"}</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}>
          {score >= 5 ? "Excellent!" : score >= 3 ? "Good job!" : "Keep practicing!"}
        </h2>
        <p className="text-gray-500 mb-6">You got {score} out of {pool.length} correct</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onExit}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #00bfa5, #008c7a)" }}>
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">Question {currentIdx + 1}/{pool.length}</span>
        <span className="text-sm font-semibold" style={{ color: "var(--teal-600)" }}>Score: {score}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6">
        <div className="h-full rounded-full transition-all" style={{
          width: `${((currentIdx) / pool.length) * 100}%`,
          background: "var(--teal-500)"
        }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center mb-6">
            <motion.div
              className="text-7xl mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              {q.emoji}
            </motion.div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              What sign is this?
            </p>
            <p className="text-sm text-gray-400 mt-1">"{q.desc}"</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {options[currentIdx].map((opt) => {
              let bg = "white";
              let border = "#e5e7eb";
              let textColor = "#374151";
              if (selected !== null) {
                if (opt.text === q.text) { bg = "rgba(16,185,129,0.1)"; border = "#10b981"; textColor = "#059669"; }
                else if (opt.text === selected) { bg = "rgba(239,68,68,0.08)"; border = "#ef4444"; textColor = "#dc2626"; }
              }
              return (
                <button
                  key={opt.text}
                  onClick={() => handleSelect(opt)}
                  className="p-4 rounded-xl border-2 font-semibold text-sm transition-all"
                  style={{ background: bg, borderColor: border, color: textColor }}
                >
                  {opt.emoji} {opt.text}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function SignLanguagePage() {
  const [activeTab, setActiveTab] = useState("phrases");
  const [activeItem, setActiveItem] = useState(PHRASES[0]);
  const [category, setCategory] = useState("all");
  const [quizMode, setQuizMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoIdx, setAutoIdx] = useState(0);

  // Auto-play cycle
  useEffect(() => {
    if (!autoPlay || quizMode) return;
    const filtered = activeTab === "phrases"
      ? (category === "all" ? PHRASES : PHRASES.filter(p => p.category === category))
      : activeTab === "alphabet" ? ALPHABET : NUMBERS;
    const timer = setInterval(() => {
      setAutoIdx((p) => (p + 1) % filtered.length);
      setActiveItem(filtered[(autoIdx + 1) % filtered.length]);
    }, 2500);
    return () => clearInterval(timer);
  }, [autoPlay, activeTab, category, autoIdx, quizMode]);

  const filteredPhrases = category === "all" ? PHRASES : PHRASES.filter(p => p.category === category);

  const tabs = [
    { id: "phrases",  label: "Common Phrases", icon: "💬" },
    { id: "alphabet", label: "Alphabet",       icon: "🔤" },
    { id: "numbers",  label: "Numbers",        icon: "🔢" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero header */}
      <div
        className="px-6 py-12 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #00bfa5 0%, #008c7a 50%, #3f51b5 100%)" }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="text-5xl mb-3">🤟</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3"
            style={{ fontFamily: "var(--font-display)" }}>
            Learn Sign Language
          </h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Our AI avatar teaches you ISL & ASL — alphabets, numbers, and everyday phrases.
            Practice at your own pace.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => setQuizMode(true)}
              className="bg-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:-translate-y-1"
              style={{ color: "var(--teal-700)" }}
            >
              🧠 Practice Quiz
            </button>
            <button
              onClick={() => setAutoPlay((p) => !p)}
              className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:-translate-y-1"
              style={{ background: autoPlay ? "rgba(255,255,255,0.2)" : "transparent" }}
            >
              {autoPlay ? "⏸ Pause Auto-Play" : "▶ Auto-Play"}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {quizMode ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: "var(--font-display)" }}>Sign Language Quiz</h2>
              <button onClick={() => setQuizMode(false)}
                className="text-sm text-gray-500 hover:text-gray-700">✕ Exit</button>
            </div>
            <QuizMode onExit={() => setQuizMode(false)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Avatar + current sign */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24">
                <div className="p-5 text-center"
                  style={{ background: "linear-gradient(135deg, rgba(0,191,165,0.07), rgba(63,81,181,0.05))" }}>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1"
                    style={{ fontFamily: "var(--font-display)" }}>AI Sign Teacher</h3>
                  <p className="text-xs text-gray-400">Tap any sign to see it demonstrated</p>
                </div>

                {/* Avatar display */}
                <div className="p-6 flex flex-col items-center">
                  <SignLanguageAvatar
                    topic={activeItem?.text || activeItem?.letter || String(activeItem?.num) || "hello"}
                    inline
                  />
                </div>

                {/* Current sign info */}
                {activeItem && (
                  <motion.div
                    key={activeItem.text || activeItem.letter || activeItem.num}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-5 pb-5"
                  >
                    <div
                      className="p-4 rounded-xl text-center"
                      style={{ background: "rgba(0,191,165,0.07)", border: "1px solid rgba(0,191,165,0.2)" }}
                    >
                      <div className="text-3xl mb-1">{activeItem.emoji}</div>
                      <div className="font-bold text-gray-900 dark:text-white"
                        style={{ fontFamily: "var(--font-display)" }}>
                        {activeItem.text || activeItem.letter || activeItem.num}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{activeItem.desc}</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right: Content tabs */}
            <div className="lg:col-span-2">

              {/* Tabs */}
              <div className="flex gap-2 mb-5 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all"
                    style={
                      activeTab === t.id
                        ? { background: "white", color: "var(--teal-600)", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }
                        : { color: "#6b7280" }
                    }
                  >
                    <span>{t.icon}</span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Phrases tab */}
              {activeTab === "phrases" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Category filter */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                        style={
                          category === c
                            ? { background: "var(--teal-500)", color: "white" }
                            : { background: "#f3f4f6", color: "#6b7280" }
                        }
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredPhrases.map((p) => (
                      <PhraseCard
                        key={p.text}
                        phrase={p}
                        isActive={activeItem?.text === p.text}
                        onClick={() => setActiveItem(p)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Alphabet tab */}
              {activeTab === "alphabet" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Tap a letter to see how to fingerspell it in ISL/ASL
                  </p>
                  <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                    {ALPHABET.map((item) => (
                      <LetterCard
                        key={item.letter}
                        item={item}
                        isActive={activeItem?.letter === item.letter}
                        onClick={() => setActiveItem(item)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Numbers tab */}
              {activeTab === "numbers" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Learn to count from 0 to 9 in sign language
                  </p>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                    {NUMBERS.map((item) => (
                      <LetterCard
                        key={item.num}
                        item={item}
                        isNumber
                        isActive={activeItem?.num === item.num}
                        onClick={() => setActiveItem(item)}
                      />
                    ))}
                  </div>
                  {/* Number practice */}
                  <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3"
                      style={{ fontFamily: "var(--font-display)" }}>
                      Number Challenge
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[3, 7, 1, 5, 9, 2, 8, 0, 4, 6].map((n) => (
                        <button
                          key={n}
                          onClick={() => setActiveItem(NUMBERS[n])}
                          className="p-3 rounded-xl text-center transition-all hover:-translate-y-1 border-2"
                          style={{
                            borderColor: activeItem?.num === n ? "var(--teal-500)" : "#e5e7eb",
                            background: activeItem?.num === n ? "rgba(0,191,165,0.08)" : "transparent",
                          }}
                        >
                          <div className="text-xl">{NUMBERS[n].emoji}</div>
                          <div className="text-xs text-gray-400 mt-1">= {n}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}