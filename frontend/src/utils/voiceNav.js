// Voice Navigation utility using Web SpeechRecognition API

export function isVoiceSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createVoiceNavigator(onCommand) {
  if (!isVoiceSupported()) return null;

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase().trim();
    onCommand(command);
  };

  recognition.onerror = (e) => {
    console.warn("Voice recognition error:", e.error);
  };

  return recognition;
}

// Map spoken phrases to route paths
export function parseVoiceCommand(command) {
  if (command.includes("dashboard") || command.includes("home")) return "/dashboard";
  if (command.includes("courses") || command.includes("course")) return "/courses";
  if (command.includes("profile")) return "/profile";
  if (command.includes("admin")) return "/admin";
  if (command.includes("logout") || command.includes("sign out")) return "LOGOUT";
  if (command.includes("quiz")) return "/quiz";
  return null;
}