import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import AccessibilityBar from "./components/AccessibilityBar";
import DisabilityWrapper from "./components/DisabilityWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";
import GovSchemes from "./components/GovSchemes";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DisabilitySelect from "./pages/DisabilitySelect";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CoursePlayer from "./pages/CoursePlayer";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import SignLanguagePage from "./pages/SignLanguagePage";

export default function App() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [schemesOpen, setSchemesOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <DisabilityWrapper>
            <Navbar />
            <AccessibilityBar
              onOpenChatbot={() => setChatbotOpen(true)}
              onOpenSchemes={() => setSchemesOpen(true)}
            />

            {/* Chatbot — controlled from App so voice can open it */}
            <Chatbot
              externalOpen={chatbotOpen}
              onClose={() => setChatbotOpen(false)}
            />

            {/* Gov schemes modal */}
            <AnimatePresence>
              {schemesOpen && (
                <GovSchemes onClose={() => setSchemesOpen(false)} />
              )}
            </AnimatePresence>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/disability-select" element={<DisabilitySelect />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path="/courses/:id" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
              <Route path="/courses/:id/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
              <Route path="/sign-language" element={<ProtectedRoute><SignLanguagePage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DisabilityWrapper>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}