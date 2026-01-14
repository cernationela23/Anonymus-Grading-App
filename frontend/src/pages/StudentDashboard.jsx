import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function StudentDashboard() {
  const [hasJury, setHasJury] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/jury/my");
        setHasJury(res.data.length > 0);
      } catch (e) {
        setErr(e.response?.data?.error || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .student-page{
          min-height:100vh;
          background: radial-gradient(circle at top left, #020617, #000);
          font-family: "Segoe UI", sans-serif;
          color:#f8fafc;
          position:relative;
          overflow:hidden;
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

        .student-container{
          position:relative;
          z-index:2;
          max-width:900px;
          margin:0 auto;
          padding:28px 18px 60px;
        }

        .topbar{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:18px;
        }

        .title{
          margin:0;
          font-size:26px;
          letter-spacing:0.2px;
        }

        .pill{
          padding:8px 12px;
          border-radius:999px;
          background: rgba(2, 6, 23, 0.94);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
          font-size:13px;
          color:#94a3b8;
        }

        .grid{
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap:18px;
        }

        @media (max-width: 820px){
          .grid{ grid-template-columns:1fr; }
        }

        .card{
          background: rgba(2, 6, 23, 0.94);
          border-radius:22px;
          padding:18px;
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.7),
            inset 0 0 0 1px rgba(255,255,255,0.06);
        }

        .card h3{
          margin:0 0 10px 0;
          font-size:18px;
        }

        .muted{
          color:#94a3b8;
          font-size:13px;
          margin:0;
          line-height:1.5;
        }

        .alert{
          margin-top:10px;
          padding:12px 14px;
          border-radius:14px;
          background: rgba(2, 6, 23, 0.94);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
          font-size:14px;
        }
        .alert.error{ border-left:4px solid #ef4444; }
        .alert.info{ border-left:4px solid #3b82f6; }

        .btn{
          width:100%;
          padding:12px 14px;
          border-radius:12px;
          border:none;
          cursor:pointer;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color:white;
          font-size:14px;
          margin-top:12px;
        }

        .btn.secondary{
          background:#0f172a;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
          color:#e2e8f0;
        }

        .btn:disabled{
          opacity:0.55;
          cursor:not-allowed;
        }

        .statusRow{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-top:10px;
        }

        .badge{
          padding:6px 10px;
          border-radius:999px;
          font-size:12px;
          color:#e2e8f0;
          background:#0f172a;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
          white-space:nowrap;
        }

        .badge.ok{ border-left:3px solid #22c55e; }
        .badge.no{ border-left:3px solid #ef4444; }
      `}</style>

      <div className="student-page">
        <div className="background-lines" />

        <div className="student-container">
          <div className="topbar">
            <h2 className="title">Student Dashboard</h2>
            <div className="pill">
              Status: {loading ? "Checking..." : hasJury ? "Jury available" : "No jury"}
            </div>
          </div>

          {err && <div className="alert error">{err}</div>}
          {loading && <div className="alert info">Loading...</div>}

          <div className="grid" style={{ marginTop: 18 }}>
            <div className="card">
              <h3>My projects</h3>
              <p className="muted">
                Create projects, manage deliverables, add project members and assign juries.
              </p>
              <button className="btn" onClick={() => navigate("/mp")}>
                My projects (MP)
              </button>
            </div>

            <div className="card">
              <h3>Jury evaluation</h3>
              <p className="muted">
                Evaluate assigned deliverables. You can grade only if you are selected in the jury.
              </p>

              <div className="statusRow">
                <span className={`badge ${!loading && hasJury ? "ok" : "no"}`}>
                  {!loading && hasJury ? "Assignments: YES" : "Assignments: NO"}
                </span>

                {!loading && !hasJury && (
                  <span className="muted">No projects assigned right now.</span>
                )}
              </div>

              <button
                className="btn secondary"
                onClick={() => navigate("/jury")}
                disabled={!hasJury}
                title={!hasJury ? "No projects assigned for evaluation" : ""}
              >
                Evaluate projects (Jury)
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
