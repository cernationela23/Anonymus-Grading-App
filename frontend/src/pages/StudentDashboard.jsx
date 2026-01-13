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
    <div style={{ padding: 20 }}>
      <h2>Student Dashboard</h2>

      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate("/mp")}>
          My projects (MP)
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => navigate("/jury")}
          disabled={!hasJury}
          title={!hasJury ? "No projects assigned for evaluation" : ""}
        >
          Evaluate projects (Jury)
        </button>

        {!loading && !hasJury && (
          <p style={{ marginTop: 8 }}>You have no projects to evaluate right now.</p>
        )}
      </div>
    </div>
  );
}
