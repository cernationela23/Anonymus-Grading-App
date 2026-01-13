import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProfessorPage() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/professor/projects")
      .then(res => setProjects(res.data))
      .catch(e => setErr(e.response?.data?.error || e.message));
  }, []);

  const loadResults = async (projectId) => {
    try {
      const res = await api.get(`/professor/projects/${projectId}/results`);
      setResults(res.data);
      setSelected(projectId);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Professor Dashboard</h2>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <h3>Projects</h3>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            {p.title}{" "}
            <button onClick={() => loadResults(p.id)}>View results</button>
          </li>
        ))}
      </ul>

      {results && (
        <>
          <hr />
          <h3>Results for Project {selected}</h3>

          {results.deliverables.map(d => (
            <div key={d.deliverableId} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
              <p><b>Deliverable {d.deliverableId}</b></p>
              <p>Deadline: {String(d.deadline)}</p>

              <p>Grades (anonymous): {d.grades.join(", ") || "No grades yet"}</p>

              {d.average !== null ? (
                <p><b>Average (without min & max): {d.average}</b></p>
              ) : (
                <p><i>Not enough grades for average</i></p>
              )}
            </div>
          ))}

          <h3>
            Project Final Average:{" "}
            {results.projectAverage !== null ? results.projectAverage : "N/A"}
          </h3>
        </>
      )}
    </div>
  );
}

