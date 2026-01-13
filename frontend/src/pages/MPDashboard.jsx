import { useEffect, useState } from "react";
import api from "../services/api";

export default function MPDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [deliverables, setDeliverables] = useState([]);

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

  useEffect(() => {
    loadProjects().catch((e) => setErr(e.response?.data?.error || e.message));
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await api.post("/projects", { title, description });
      setTitle(""); setDescription("");
      setMsg("Project created!");
      await loadProjects();
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  const selectProject = async (projectId) => {
    setSelectedProjectId(projectId);
    setErr(""); setMsg("");
    try {
      await loadDeliverables(projectId);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  const createDeliverable = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setErr(""); setMsg("");
    try {
      await api.post(`/projects/${selectedProjectId}/deliverables`, {
        deadline,
        videoUrl,
        deploymentUrl
      });
      setDeadline(""); setVideoUrl(""); setDeploymentUrl("");
      setMsg("Deliverable created!");
      await loadDeliverables(selectedProjectId);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

const assignJury = async (deliverableId) => {
  setErr(""); setMsg("");
  try {
    await api.post(`/projects/${selectedProjectId}/deliverables/${deliverableId}/jury`, {});
    setMsg("Jury assigned!");
  } catch (e) {
    setErr(e.response?.data?.error || e.message);
  }
};


  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h2>MP Dashboard</h2>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      <hr />

      <h3>Create Project</h3>
      <form onSubmit={createProject} style={{ display: "grid", gap: 8, maxWidth: 400 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      <hr />

      <h3>My Projects (all)</h3>
      <ul>
        {projects.map((p) => (
          <li key={p.id} style={{ marginBottom: 6 }}>
            <button onClick={() => selectProject(p.id)}>
              Select
            </button>{" "}
            <b>{p.title}</b> (id: {p.id})
          </li>
        ))}
      </ul>

      <hr />

      <h3>Selected Project: {selectedProjectId || "-"}</h3>

      <h4>Create Deliverable</h4>
      <form onSubmit={createDeliverable} style={{ display: "grid", gap: 8, maxWidth: 500 }}>
        <input
          placeholder="Deadline (ex: 2025-12-10T23:59:00.000Z)"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <input
          placeholder="Video URL (optional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <input
          placeholder="Deployment URL (optional)"
          value={deploymentUrl}
          onChange={(e) => setDeploymentUrl(e.target.value)}
        />
        <button type="submit" disabled={!selectedProjectId}>
          Add Deliverable
        </button>
      </form>

      <h4>Deliverables</h4>
      <ul>
        {deliverables.map((d) => (
          <li key={d.id} style={{ marginBottom: 10 }}>
            <div>
              <b>Deliverable #{d.id}</b> | deadline: {String(d.deadline)}
            </div>
            <div>
              <button onClick={() => assignJury(d.id)}>
                Assign Jury
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
