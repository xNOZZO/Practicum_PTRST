// src/auth/useAuth.jsx
import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Читаем токены из localStorage
  const [access, setAccess] = useState(localStorage.getItem("access") || null);
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh") || null);

  // Логин: получаем access + refresh
  const login = async (email, password) => {
    const res = await fetch("/api/core/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      // пробрасываем ошибку, AuthScreen её поймает
      throw new Error("Login failed");
    }

    const data = await res.json();
    // Ожидаем { access: "...", refresh: "..." }
    setAccess(data.access);
    setRefresh(data.refresh);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
  };

  // Рефреш токена доступа
  const refreshAccess = async () => {
    if (!refresh) throw new Error("No refresh token");
    const res = await fetch("/api/core/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      logout();
      throw new Error("Refresh failed");
    }
    const data = await res.json();
    setAccess(data.access);
    localStorage.setItem("access", data.access);
    return data.access;
  };

  // Умный fetch, который ставит заголовок и рефрешит, если access истёк
  const authFetch = async (input, options = {}) => {
    let token = access;
    // Если нет access сразу пробуем рефреш
    if (!token) {
      token = await refreshAccess();
    }
    // Добавляем заголовок
    const res = await fetch(input, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    // если access истёк (401), пробуем рефреш + повтор
    if (res.status === 401) {
      token = await refreshAccess();
      return fetch(input, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });
    }

    return res;
  };

  const logout = () => {
    setAccess(null);
    setRefresh(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider value={{ access, refresh, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("useAuth context:", context); // 👀 Должен быть не undefined
  return context;
};
