import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pp_user") || "null");
    } catch {
      return null;
    }
  });
  const [ready, setReady] = useState(false);

  // Re-validate a saved session on load.
  useEffect(() => {
    const token = localStorage.getItem("pp_token");
    if (!token) {
      setReady(true);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("pp_user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("pp_token");
        localStorage.removeItem("pp_user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const save = (data) => {
    localStorage.setItem("pp_token", data.token);
    localStorage.setItem("pp_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    save(data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    save(data);
  };

  const logout = () => {
    localStorage.removeItem("pp_token");
    localStorage.removeItem("pp_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
