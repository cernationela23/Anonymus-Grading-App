import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginSvg from "../assets/login.svg";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setErr("");

  try {
    const res = await api.post("/auth/login", { email, password });
    const { token, role } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    if (role === "PROFESOR") navigate("/profesor");
    else navigate("/student");
  } catch (e) {
    setErr(e.response?.data?.error || "incorrect email or password");
  }
};

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .login-page {
          min-height: 100vh;
          background: radial-gradient(circle at top left, #020617, #000);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Segoe UI", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .background-lines {
          position: absolute;
          inset: -50%;
          z-index: 1;
          pointer-events: none;
        }

        .background-lines::before {
          content: "";
          position: absolute;
          width: 180%;
          height: 180%;
          background-image: repeating-linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.07) 0px,
            rgba(255, 255, 255, 0.07) 2px,
            transparent 2px,
            transparent 80px
          );
          transform: rotate(-10deg);
          animation: linesSlowLeft 90s linear infinite;
        }

        .background-lines::after {
          content: "";
          position: absolute;
          width: 180%;
          height: 180%;
          background-image: repeating-linear-gradient(
            60deg,
            rgba(59, 130, 246, 0.10) 0px,
            rgba(59, 130, 246, 0.10) 2px,
            transparent 2px,
            transparent 110px
          );
          transform: rotate(6deg);
          animation: linesSlowRight 130s linear infinite;
        }

        @keyframes linesSlowLeft {
          from { transform: translateX(0) rotate(-10deg); }
          to   { transform: translateX(-300px) rotate(-10deg); }
        }

        @keyframes linesSlowRight {
          from { transform: translateX(0) rotate(6deg); }
          to   { transform: translateX(300px) rotate(6deg); }
        }

        .login-wrapper {
          display: flex;
          align-items: center;
          gap: 40px;
          z-index: 2;
          padding: 24px;
        }

        .login-illustration img {
          width: 520px;
          max-width: 520px;
        }

        .login-card {
          width: 420px;
          padding: 40px;
          background: rgba(2, 6, 23, 0.94);
          border-radius: 22px;
          color: #f8fafc;
          position: relative;
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.7),
            inset 0 0 0 1px rgba(255,255,255,0.06);
        }

        .login-card h2 {
          margin: 0 0 6px 0;
          font-size: 26px;
        }

        .subtitle {
          color: #94a3b8;
          margin-bottom: 26px;
        }

        .login-card input {
          width: 100%;
          padding: 13px 14px;
          margin-bottom: 16px;
          border-radius: 12px;
          border: none;
          outline: none;
          background: #0f172a;
          color: #f8fafc;
          font-size: 15px;
        }

        .login-card input::placeholder {
          color: #64748b;
        }

        .login-card button {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        .error-text {
          color: #f87171;
          margin-top: 12px;
        }

        .register-text {
          margin-top: 20px;
          font-size: 14px;
          color: #94a3b8;
          text-align: center;
        }

        .register-text span {
          color: #3b82f6;
          cursor: pointer;
        }

        .register-text span:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .login-illustration {
            display: none;
          }
          .login-card {
            width: 100%;
            max-width: 420px;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="background-lines"></div>

        <div className="login-wrapper">
          <div className="login-illustration">
            <img src={loginSvg} alt="Login illustration" />
          </div>

          <div className="login-card">
            <h2>Welcome back</h2>
            <p className="subtitle">Login to your account</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit">Login</button>
            </form>

            {err && <p className="error-text">{err}</p>}

            <p className="register-text">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/register")}>Register</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
