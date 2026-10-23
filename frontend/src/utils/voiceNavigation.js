// ── Speak ──────────────────────────────────────────────────────
export function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.95;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

// ── Support check ──────────────────────────────────────────────
export function isVoiceSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// ── Command handler ────────────────────────────────────────────
// extras: { logout, courses, openChatbot, openSchemes }
export function handleCommand(command, navigate, extras = {}) {
  const c = command.toLowerCase().trim();
  const { logout, courses = [], openChatbot, openSchemes } = extras;

  // ── Navigation commands ──
  if (c.includes("dashboard") || c.includes("go home") || c.includes("home")) {
    speak("Opening dashboard");
    navigate("/dashboard");
    return;
  }
  if (c.includes("courses") && !c.includes("open course ")) {
    speak("Opening courses");
    navigate("/courses");
    return;
  }
  if (c.includes("profile")) {
    speak("Opening profile");
    navigate("/profile");
    return;
  }
  if (c.includes("sign language")) {
    speak("Opening sign language");
    navigate("/sign-language");
    return;
  }
  if (c.includes("admin")) {
    speak("Opening admin panel");
    navigate("/admin");
    return;
  }

  // ── Go back ──
  if (c.includes("go back") || c.includes("back")) {
    speak("Going back");
    window.history.back();
    return;
  }

  // ── Scroll ──
  if (c.includes("scroll down") || c.includes("go down")) {
    speak("Scrolling down");
    window.scrollBy({ top: 350, behavior: "smooth" });
    return;
  }
  if (c.includes("scroll up") || c.includes("go up")) {
    speak("Scrolling up");
    window.scrollBy({ top: -350, behavior: "smooth" });
    return;
  }
  if (c.includes("scroll to top") || c.includes("top of page")) {
    speak("Going to top");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // ── Open chatbot ──
  if (c.includes("chatbot") || c.includes("chat") || c.includes("assistant")) {
    speak("Opening chatbot");
    if (openChatbot) openChatbot();
    return;
  }

  // ── Government schemes ──
  if (
    c.includes("gov schemes") ||
    c.includes("government") ||
    c.includes("schemes")
  ) {
    speak("Opening government schemes");
    if (openSchemes) openSchemes();
    return;
  }

  // ── Open specific course by name ──
  if (c.includes("open course") && courses.length > 0) {
    const query = c.replace("open course", "").trim();
    const match = courses.find((course) =>
      course.title.toLowerCase().includes(query)
    );
    if (match) {
      speak(`Opening ${match.title}`);
      navigate(`/courses/${match._id}`);
    } else {
      speak(`Course not found: ${query}. Try saying open courses to browse.`);
    }
    return;
  }

  // ── Read page ──
  if (c.includes("read page") || c.includes("read this")) {
    const main = document.getElementById("main-content");
    if (main) speak(main.innerText.slice(0, 600));
    else speak("No content found to read.");
    return;
  }

  // ── Stop TTS ──
  if (c.includes("stop") || c.includes("stop reading")) {
    window.speechSynthesis?.cancel();
    return;
  }

  // ── Logout ──
  if (c.includes("logout") || c.includes("sign out")) {
    speak("Logging you out");
    if (logout) logout();
    return;
  }

  // ── Help ──
  if (c.includes("help")) {
    speak(
      "Available commands: dashboard, courses, profile, sign language, open chatbot, government schemes, open course followed by name, scroll down, scroll up, go back, read page, stop, logout"
    );
    return;
  }

  // ── Unknown ──
  speak(
    `Command not recognised: ${c}. Say help to hear available commands.`
  );
}

// ── One-shot listening ─────────────────────────────────────────
export function startListening(onCommand) {
  if (!isVoiceSupported()) return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new SR();
  r.lang = "en-US";
  r.continuous = false;
  r.interimResults = false;
  r.onresult = (e) => onCommand(e.results[0][0].transcript);
  r.onerror = (e) => console.warn("Voice error:", e.error);
  try { r.start(); } catch {}
  return r;
}

// ── Continuous listening (auto-restart) ───────────────────────
export function startContinuousListening(onCommand) {
  if (!isVoiceSupported()) return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new SR();
  r.lang = "en-US";
  r.continuous = false;
  r.interimResults = false;
  let active = true;

  const listen = () => {
    if (!active) return;
    try { r.start(); } catch {}
  };

  r.onresult = (e) => {
    const cmd = e.results[0][0].transcript;
    onCommand(cmd);
  };
  r.onend = () => { if (active) setTimeout(listen, 400); };
  r.onerror = (e) => {
    if (active && e.error !== "aborted") setTimeout(listen, 1200);
  };

  listen();
  return () => {
    active = false;
    try { r.stop(); } catch {}
  };
}