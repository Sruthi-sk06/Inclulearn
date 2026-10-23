import { useAuth } from "../context/AuthContext";
import BlindToolbar from "./BlindToolbar";
import DeafToolbar from "./DeafToolbar";
import SpeechToolbar from "./SpeechToolbar";
import MotorToolbar from "./MotorToolbar";

export default function AccessibilityBar({ onOpenChatbot, onOpenSchemes }) {
  const { user } = useAuth();
  if (!user?.disability) return null;

  return (
    <div role="complementary" aria-label="Accessibility toolbar">
      {user.disability === "blind" && (
        <BlindToolbar
          onOpenChatbot={onOpenChatbot}
          onOpenSchemes={onOpenSchemes}
        />
      )}
      {user.disability === "deaf" && <DeafToolbar />}
      {user.disability === "speech" && <SpeechToolbar />}
      {user.disability === "motor" && (
        <MotorToolbar
          onOpenChatbot={onOpenChatbot}
          onOpenSchemes={onOpenSchemes}
        />
      )}
    </div>
  );
}