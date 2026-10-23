import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        // Always stop loading — no matter what
        setLoading(false);
      }
    };

    // Add timeout fallback — if backend takes too long, stop loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    checkSession().finally(() => clearTimeout(timeout));
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const updateDisability = (disability) =>
    setUser((prev) => ({ ...prev, disability }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-teal-600 dark:text-teal-400 font-semibold text-lg">
            Loading IncluLearn...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateDisability }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}