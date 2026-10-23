import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { speak } from "../utils/tts";
import { useAuth } from "../context/AuthContext";

// ISL/ASL alphabet with finger spelling descriptions
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => ({
  letter: l,
  emoji: ["👍","✌️","🤞","🖖","☝️","✋","🤚","👋","☝️","🤙","👌","🤘","🤟","🖖","👐","🤲","🙌","👏","🤝","🙏","☝️","✌️","🤞","❌","✌️","⚡"][l.charCodeAt(0)-65],
  desc: `Finger spelling for letter ${l}`,
}));

const numbers = Array.from({length:10},(_,i) => ({
  num: i,
  emoji: ["✊","☝️","✌️","🤞","🖖","🖐️","🤙","🤘","🤟","👐"][i],
  desc: `Sign for number ${i}`,
}));

const phrases = [
  { text: "Hello", emoji: "👋", desc: "Wave your hand open", category: "greeting" },
  { text: "Thank You", emoji: "🙏", desc: "Flat hand from chin forward", category: "greeting" },
  { text: "Please", emoji: "🤲", desc: "Circular motion on chest", category: "greeting" },
  { text: "Sorry", emoji: "✊", desc: "Fist circular motion on chest", category: "greeting" },
  { text: "Yes", emoji: "👍", desc: "Fist nod up and down", category: "response" },
  { text: "No", emoji: "👎", desc: "Index and middle finger close on thumb", category: "response" },
  { text: "Help", emoji: "🙏", desc: "Thumbs up on flat palm, move upward", category: "response" },
  { text: "Learn", emoji: "📖", desc: "Fingers from palm to forehead", category: "education" },
  { text: "Understand", emoji: "💡", desc: "Index finger flick from temple", category: "education" },
  { text: "Good", emoji: "👌", desc: "Flat hand from chin forward and down", category: "response" },
];

const tabs = ["Alphabet", "Numbers", "Phrases", "Practice"];

// Animated SVG hand figure
function HandAvatar({ gesture, isAnimating }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={isAnimating ? {
          rotate: [-15, 15, -10, 10, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
          y: [0, -10, 5, -5, 0],
        } : { rotate: 0, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-7xl mb-2 select-none"
      >
        {gesture.emoji}
      </motion.div>
      <motion.div
        animate={isAnimating ? { opacity: [0,1,0,1,1] } : { opacity: 1 }}
        className="text-4xl select-none"
      >
        🤚
      </motion.div>
    </div>
  );
}

// Practice mode
function PracticeMode() {
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const items = [...phrases.slice(0,5)];
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    setResult(null);
    setCurrent((p) => (p + 1) % items.length);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 900);
  };

  const checkAnswer = (choice) => {
    const correct = choice === items[current].text;
    setResult(correct ? "correct" : "wrong");
    speak(correct ? "Correct! Well done!" : `Not quite. The answer is ${items[current].text}`);
  };

  const shuffled = [...items].sort(() => Math.random() - 0.5).slice(0, 4);
  const options = shuffled.some(i => i.text === items[current].text)
    ? shuffled
    : [...shuffled.slice(0,3), items[current]].sort(() => Math.random() - 0.5);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl text-center mb-6">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 font-medium">What sign is this?</p>
        <HandAvatar gesture={items[current]} isAnimating={isAnimating} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map((opt) => {
          let style = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-400";
          if (result && opt.text === items[current].text) style = "bg-green-50 dark:bg-green-900/30 border-green-500";
          else if (result === "wrong" && opt.text !== items[current].text) style = "opacity-50";

          return (
            <button
              key={opt.text}
              onClick={() => !result && checkAnswer(opt.text)}
              className={`p-4 rounded-2xl border-2 font-bold text-gray-900 dark:text-white transition-all ${style}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-center font-bold mb-4 ${result === "correct" ? "bg-green-100 dark:bg-green-900/40 text-green-700" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700"}`}
        >
          {result === "correct" ? "🎉 Correct!" : `💡 It was: ${items[current].text}`}
        </motion.div>
      )}

      <button
        onClick={handleNext}
        className="w-full gradient-teal text-white font-bold py-4 rounded-2xl text-base"
      >
        Next Sign →
      </button>
    </div>
  );
}

export default function SignLanguagePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("Alphabet");
  const [selected, setSelected] = useState(alphabet[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const selectItem = (item) => {
    setSelected(item);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 900);
    speak(item.text || item.letter || String(item.num));
  };

  const items = tab === "Alphabet" ? alphabet : tab === "Numbers" ? numbers : phrases;

  return (
    <main id="main-content" className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-emerald-200 dark:border-emerald-700">
            🤟 Indian Sign Language (ISL)
          </span>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            Learn Sign Language
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Interactive ISL lessons — alphabets, numbers, phrases and practice mode
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t === "Alphabet") setSelected(alphabet[0]); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === t ? "gradient-teal text-white shadow-md" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-400"}`}
            >
              {t === "Alphabet" ? "🔤" : t === "Numbers" ? "🔢" : t === "Phrases" ? "💬" : "🎯"} {t}
            </button>
          ))}
        </div>

        {tab === "Practice" ? <PracticeMode /> : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Item grid */}
            <div className="lg:col-span-2">
              <div className={`grid gap-2 ${tab === "Alphabet" ? "grid-cols-6 sm:grid-cols-9" : tab === "Numbers" ? "grid-cols-5" : "grid-cols-2 sm:grid-cols-3"}`}>
                {items.map((item, i) => {
                  const label = item.letter || String(item.num) || item.text;
                  const isActive = selected === item;
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectItem(item)}
                      className={`rounded-2xl p-3 flex flex-col items-center gap-1 border-2 transition-all font-bold text-sm
                        ${isActive
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-teal-300"
                        }`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span>{label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Preview panel */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col items-center justify-center text-center sticky top-24 h-fit">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-6">Selected Sign</p>

              <HandAvatar gesture={selected} isAnimating={isAnimating} />

              <motion.div
                key={selected?.letter || selected?.num || selected?.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                  {selected?.letter || String(selected?.num ?? "") || selected?.text}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {selected?.desc}
                </p>
                {selected?.category && (
                  <span className="mt-3 inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold capitalize">
                    {selected.category}
                  </span>
                )}
              </motion.div>

              <button
                onClick={() => {
                  setIsAnimating(true);
                  speak(selected?.letter || String(selected?.num ?? "") || selected?.text);
                  setTimeout(() => setIsAnimating(false), 900);
                }}
                className="mt-6 w-full gradient-teal text-white font-bold py-3 rounded-2xl text-sm"
              >
                🔄 Animate Sign
              </button>

              <button
                onClick={() => speak(selected?.desc || "")}
                className="mt-2 w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-2xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                🔊 Read Description
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}