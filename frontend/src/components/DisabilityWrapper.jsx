import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { speak } from "../utils/tts";

export default function DisabilityWrapper({ children }) {
  const { user } = useAuth();
  const disability = user?.disability;

  useEffect(() => {
    const body = document.body;
    // Remove all disability classes first
    body.classList.remove("high-contrast", "large-text", "motor-mode", "deaf-mode", "speech-mode");

    if (disability === "blind") {
      body.classList.add("high-contrast", "large-text");
      speak("Welcome to IncluLearn. Voice navigation is available. Say go to dashboard, open courses, or open profile.");
    } else if (disability === "deaf") {
      body.classList.add("deaf-mode");
    } else if (disability === "speech") {
      body.classList.add("speech-mode");
    } else if (disability === "motor") {
      body.classList.add("motor-mode");
    }
  }, [disability]);

  return <>{children}</>;
}