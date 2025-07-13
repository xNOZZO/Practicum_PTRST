import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_BASE = "http://127.0.0.1:8000";

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/core/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          is_customer: true,
        }),
      });

      if (res.status === 201) {
        navigate("/login");
        return;
      }

      if (res.status === 404) {
        throw new Error("404: эндпоинт не найден. Проверьте URL и прокси.");
      }

      const text = await res.text();
      throw new Error(text || `Ошибка ${res.status}`);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Ошибка при регистрации: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Регистрация</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            required
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Пароль"
            required
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="auth-button">
            Зарегистрироваться
          </button>
        </form>

        <button className="auth-link" onClick={() => navigate("/login")}>
          Уже есть аккаунт? Войти
        </button>
      </div>
    </div>
  );
}
