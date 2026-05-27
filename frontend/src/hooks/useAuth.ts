import { useState, useCallback, useEffect, createContext, useContext } from "react";
import { authApi, User } from "../api/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuthProvider(): AuthState {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // Rehydrate on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then(setUser)
      .catch(() => { localStorage.removeItem("access_token"); localStorage.removeItem("refresh_token"); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true); setError(null);
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem("access_token",  data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setUser(data.user);
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? "Invalid credentials.";
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem("refresh_token") ?? "";
    try { await authApi.logout(refresh); } catch {}
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  return { user, loading, error, isAuthenticated: !!user, login, logout };
}
