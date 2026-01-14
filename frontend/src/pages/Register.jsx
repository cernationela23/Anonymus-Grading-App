import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import loginSvg from "../assets/login.svg";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProfessor, setIsProfessor] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        isProfessor
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Register failed");
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

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 16px;
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
            <img src={loginSvg} alt="Register illustration" />
          </div>

          <div className="login-card">
            <h2>Create account</h2>
            <p className="subtitle">Register to start using the platform</p>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
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

              <div className="checkbox-row">
                <input
                  type="checkbox"
                  checked={isProfessor}
                  onChange={(e) => setIsProfessor(e.target.checked)}
                />
                <span>I am a professor</span>
              </div>

              <button type="submit">Register</button>
            </form>

            {error && <p className="error-text">{error}</p>}

            <p className="register-text">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
