// Text-to-Speech utility using Web SpeechSynthesis API

let currentUtterance = null;

export function speak(text, rate = 1, pitch = 1) {
  if (!window.speechSynthesis) return;
  stopSpeaking();
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = rate;
  currentUtterance.pitch = pitch;
  currentUtterance.lang = "en-US";
  window.speechSynthesis.speak(currentUtterance);
}

export function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isTTSSupported() {
  return "speechSynthesis" in window;
}

export function readPageContent() {
  const main = document.getElementById("main-content");
  if (main) {
    speak(main.innerText);
  }
}