import { useEffect, useState } from "react";
import api from "../services/api";

export default function MPDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [deliverables, setDeliverables] = useState([]);

  // members
  const [members, setMembers] = useState([]);
  const [memberStudentId, setMemberStudentId] = useState("");
  const [memberMsg, setMemberMsg] = useState("");
  const [memberErr, setMemberErr] = useState("");

  // create project form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // create deliverable form
  const [deadline, setDeadline] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [deploymentUrl, setDeploymentUrl] = useState("");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const loadProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  const loadDeliverables = async (projectId) => {
    const res = await api.get(`/projects/${projectId}/deliverables`);
    setDeliverables(res.data);
  };
  const removeMember = async (studentId) => {
    try {
      await api.delete(`/projects/${selectedProjectId}/members/${studentId}`);
      await loadMembers(selectedProjectId);
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  };

  const loadMembers = async (projectId) => {
    const res = await api.get(`/projects/${projectId}/members`);
    setMembers(res.data);
  };

  useEffect(() => {
    loadProjects().catch((e) => setErr(e.response?.data?.error || e.message));
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await api.post("/projects", { title, description });
      setTitle("");
      setDescription("");
      setMsg("Project created!");
      await loadProjects();
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  const selectProject = async (projectId) => {
    setSelectedProjectId(projectId);
    setErr("");
    setMsg("");
    setMemberErr("");
    setMemberMsg("");

    try {
      await loadDeliverables(projectId);
      await loadMembers(projectId);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  const createDeliverable = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    setErr("");
    setMsg("");

    try {
      await api.post(`/projects/${selectedProjectId}/deliverables`, {
        deadline,
        videoUrl,
        deploymentUrl,
      });

      setDeadline("");
      setVideoUrl("");
      setDeploymentUrl("");
      setMsg("Deliverable created!");
      await loadDeliverables(selectedProjectId);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  const assignJury = async (deliverableId) => {
    setErr("");
    setMsg("");
    try {
      await api.post(
        `/projects/${selectedProjectId}/deliverables/${deliverableId}/jury`,
        {}
      );
      setMsg("Jury assigned!");
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  const addMember = async () => {
    setMemberMsg("");
    setMemberErr("");

    if (!selectedProjectId) {
      setMemberErr("Select a project first.");
      return;
    }
    if (!memberStudentId.trim()) {
      setMemberErr("Student ID is required.");
      return;
    }

    try {
      await api.post(`/projects/${selectedProjectId}/members`, {
        studentId: Number(memberStudentId),
      });

      setMemberStudentId("");
      await loadMembers(selectedProjectId);

      setMemberMsg("Member added!");
    } catch (e) {
      setMemberErr(e.response?.data?.error || e.message);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .mp-page{
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

        .mp-container{
          position:relative;
          z-index:2;
          max-width:1100px;
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
        .pill b{ color:#f8fafc; }

        .alerts{
          display:grid;
          gap:10px;
          margin: 10px 0 18px;
        }

        .alert{
          padding:12px 14px;
          border-radius:14px;
          background: rgba(2, 6, 23, 0.94);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
          font-size:14px;
        }
        .alert.success{ border-left:4px solid #22c55e; }
        .alert.error{ border-left:4px solid #ef4444; }

        .grid{
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap:18px;
        }

        @media (max-width: 900px){
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
          margin:0 0 12px 0;
          font-size:18px;
        }

        .muted{
          color:#94a3b8;
          font-size:13px;
          margin-top:6px;
        }

        .form{
          display:grid;
          gap:12px;
        }

        .input{
          width:100%;
          padding:12px 14px;
          border-radius:12px;
          border:none;
          outline:none;
          background:#0f172a;
          color:#f8fafc;
          font-size:14px;
        }

        .input::placeholder{ color:#64748b; }

        .row{
          display:flex;
          gap:10px;
          align-items:center;
          flex-wrap:wrap;
        }

        .btn{
          padding:11px 14px;
          border-radius:12px;
          border:none;
          cursor:pointer;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color:white;
          font-size:14px;
          white-space:nowrap;
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

        .list{
          list-style:none;
          margin:0;
          padding:0;
          display:grid;
          gap:10px;
        }

        .listItem{
          padding:12px 12px;
          border-radius:14px;
          background:#0f172a;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
        }

        .listHeader{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
        }

        .tag{
          font-size:12px;
          color:#94a3b8;
        }

        .divider{
          height:1px;
          background: rgba(255,255,255,0.08);
          margin: 12px 0;
        }
      `}</style>

      <div className="mp-page">
        <div className="background-lines" />

        <div className="mp-container">
          <div className="topbar">
            <h2 className="title">MP Dashboard</h2>
            <div className="pill">
              Selected project: <b>{selectedProjectId || "-"}</b>
            </div>
          </div>

          <div className="alerts">
            {msg && <div className="alert success">{msg}</div>}
            {err && <div className="alert error">{err}</div>}
          </div>

          <div className="grid">
            {/* LEFT COLUMN */}
            <div className="card">
              <h3>Create Project</h3>

              <form onSubmit={createProject} className="form">
                <input
                  className="input"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button className="btn" type="submit">
                  Create
                </button>
              </form>

              <div className="divider"></div>

              <h3>Projects</h3>
              {projects.length === 0 ? (
                <p className="muted">No projects found.</p>
              ) : (
                <ul className="list">
                  {projects.map((p) => (
                    <li key={p.id} className="listItem">
                      <div className="listHeader">
                        <div>
                          <b>{p.title || "(no title)"}</b>{" "}
                          <span className="tag">(id: {p.id})</span>
                        </div>
                        <button
                          className="btn secondary"
                          onClick={() => selectProject(p.id)}
                        >
                          Select
                        </button>
                      </div>
                      {p.description && (
                        <div className="muted" style={{ marginTop: 6 }}>
                          {p.description}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="card">
              <h3>Project Members</h3>

              <div className="row" style={{ marginBottom: 10 }}>
                <input
                  className="input"
                  style={{ width: 260, maxWidth: "100%" }}
                  placeholder="Student ID (ex: 5)"
                  value={memberStudentId}
                  onChange={(e) => setMemberStudentId(e.target.value)}
                />
                <button
                  className="btn"
                  onClick={addMember}
                  disabled={!selectedProjectId}
                >
                  Add member
                </button>
              </div>

              {memberMsg && <div className="alert success">{memberMsg}</div>}
              {memberErr && <div className="alert error">{memberErr}</div>}

              <div className="divider"></div>

              {members.length === 0 ? (
                <p className="muted">No members yet.</p>
              ) : (
                <ul className="list">
                   {members.map((m) => (
                      <li
                        key={m.studentId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          borderRadius: 10,
                          background: "#0f172a",
                          marginBottom: 8
                        }}
                      >
                        <div>
                          <b>{m.student?.name}</b>{" "}
                          <span style={{ color: "#94a3b8" }}>
                            ({m.student?.email}) - id: {m.student?.id}
                          </span>
                        </div>

                        <button
                          onClick={() => removeMember(m.studentId)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            fontSize: 20,
                            cursor: "pointer"
                          }}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                </ul>
              )}

              {/* <p className="muted">
                Tip: ia Student ID din tabela Students (pgAdmin/psql) sau din pagina de register/test.
              </p> */}

              <div className="divider"></div>

              <h3>Create Deliverable</h3>
              <form onSubmit={createDeliverable} className="form">
                <input
                  className="input"
                  placeholder="Deadline (ex: 2025-12-10T23:59:00.000Z)"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Video URL (optional)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Deployment URL (optional)"
                  value={deploymentUrl}
                  onChange={(e) => setDeploymentUrl(e.target.value)}
                />
                <button className="btn" type="submit" disabled={!selectedProjectId}>
                  Add Deliverable
                </button>
              </form>

              <div className="divider"></div>

              <h3>Deliverables</h3>
              {deliverables.length === 0 ? (
                <p className="muted">No deliverables for this project.</p>
              ) : (
                <ul className="list">
                  {deliverables.map((d) => (
                    <li key={d.id} className="listItem">
                      <div className="listHeader">
                        <div>
                          <b>Deliverable #{d.id}</b>{" "}
                          <span className="tag">deadline: {String(d.deadline)}</span>
                        </div>
                        <button
                          className="btn secondary"
                          onClick={() => assignJury(d.id)}
                          disabled={!selectedProjectId}
                        >
                          Assign Jury
                        </button>
                      </div>

                      {(d.videoUrl || d.deploymentUrl) && (
                        <div className="muted" style={{ marginTop: 8 }}>
                          {d.videoUrl && (
                            <div>
                              Video:{" "}
                              <a
                                href={d.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#60a5fa" }}
                              >
                                {d.videoUrl}
                              </a>
                            </div>
                          )}
                          {d.deploymentUrl && (
                            <div>
                              Deployment:{" "}
                              <a
                                href={d.deploymentUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#60a5fa" }}
                              >
                                {d.deploymentUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
