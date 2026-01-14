// src/pages/ProfessorPage.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function ProfessorPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [results, setResults] = useState(null);
  const [err, setErr] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const projectsCount = projects.length;

  const loadProjects = async () => {
    setErr("");
    setLoadingProjects(true);
    try {
      const res = await api.get("/professor/projects");
      setProjects(res.data || []);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadResults = async (projectId) => {
    setErr("");
    setLoadingResults(true);
    try {
      const res = await api.get(`/professor/projects/${projectId}/results`);
      setResults(res.data);
      setSelectedProjectId(projectId);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedLabel = useMemo(() => {
    if (!selectedProjectId) return "None";
    return String(selectedProjectId);
  }, [selectedProjectId]);

  return (
    <div style={styles.page}>
      <div style={styles.bgLines} />

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.headerRow}>
          <h1 style={styles.h1}>Professor Dashboard</h1>
          <div style={styles.pillRow}>
            <span style={styles.pill}>Projects: {projectsCount}</span>
            <button
              style={styles.refreshBtn}
              onClick={() => {
                loadProjects();
                if (selectedProjectId) loadResults(selectedProjectId);
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {err && <div style={styles.errorBox}>{err}</div>}

        {/* GRID */}
        <div style={styles.grid}>
          {/* LEFT: PROJECTS */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <div style={styles.panelTitle}>Projects</div>
                <div style={styles.panelSub}>Selected: {selectedLabel}</div>
              </div>
            </div>

            <div className="scrollbox" style={styles.scrollBox}>
              {loadingProjects ? (
                <div style={styles.muted}>Loading projects...</div>
              ) : projects.length === 0 ? (
                <div style={styles.muted}>No projects yet.</div>
              ) : (
                <div style={styles.cardsCol}>
                  {projects.map((p) => (
                    <div key={p.id} style={styles.projectCard}>
                      <div style={styles.projectInfo}>
                        <div style={styles.projectTitle}>
                          {p.title && p.title.trim() ? p.title : "(no title)"}
                        </div>
                        <div style={styles.projectMeta}>Project ID: {p.id}</div>
                      </div>

                      <button
                        style={styles.viewBtn}
                        onClick={() => loadResults(p.id)}
                      >
                        View results
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: RESULTS */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <div style={styles.panelTitle}>
                  {selectedProjectId ? `Results for Project ${selectedProjectId}` : "Results"}
                </div>
                <div style={styles.panelSub}>
                  {selectedProjectId ? "Anonymous grades, average excludes min & max" : "Select a project to view results"}
                </div>
              </div>
            </div>

            <div className="scrollbox" style={styles.scrollBox}>
              {loadingResults ? (
                <div style={styles.muted}>Loading results...</div>
              ) : !results ? (
                <div style={styles.muted}>No project selected.</div>
              ) : (
                <>
                  <div style={styles.cardsCol}>
                    {(results.deliverables || []).map((d) => (
                      <div key={d.deliverableId} style={styles.resultCard}>
                        <div style={styles.resultTopRow}>
                          <div style={styles.resultTitle}>Deliverable {d.deliverableId}</div>
                          <span style={styles.smallPill}>Deliverable #{d.deliverableId}</span>
                        </div>

                        <div style={styles.resultMetaRow}>
                          <span style={styles.smallPill}>
                            Deadline: {formatHuman(d.deadline)}
                          </span>
                          <span style={styles.smallPill}>
                            Grades count: {Array.isArray(d.grades) ? d.grades.length : 0}
                          </span>
                        </div>

                        <div style={styles.section}>
                          <div style={styles.sectionTitle}>Grades (anonymous)</div>
                          <div style={styles.sectionText}>
                            {Array.isArray(d.grades) && d.grades.length > 0
                              ? d.grades.join(", ")
                              : "No grades yet"}
                          </div>
                        </div>

                        <div style={styles.section}>
                          {d.average !== null && d.average !== undefined ? (
                            <div style={styles.avgRow}>
                              <span style={styles.avgLabel}>Average (without min & max)</span>
                              <span style={styles.avgValue}>{d.average}</span>
                            </div>
                          ) : (
                            <div style={styles.mutedItalic}>Not enough grades for average</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={styles.finalRow}>
                    <div style={styles.finalLabel}>Project Final Average</div>
                    <div style={styles.finalValue}>
                      {results.projectAverage !== null && results.projectAverage !== undefined
                        ? results.projectAverage
                        : "N/A"}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OPTIONAL: scrollbar styling (inline cannot style pseudo selectors) */}
      <style>{`
        .scrollbox::-webkit-scrollbar { width: 10px; }
        .scrollbox::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.14); border-radius: 10px; }
        .scrollbox::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}

function formatHuman(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top left, #020617, #000)",
    color: "#f8fafc",
    position: "relative",
    overflow: "hidden",
    fontFamily: '"Segoe UI", sans-serif'
  },
  bgLines: {
    position: "absolute",
    inset: "-50%",
    backgroundImage:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 90px), repeating-linear-gradient(60deg, rgba(59,130,246,0.10) 0px, rgba(59,130,246,0.10) 2px, transparent 2px, transparent 120px)",
    transform: "rotate(-6deg)",
    zIndex: 0,
    pointerEvents: "none"
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "28px 22px 40px"
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18
  },
  h1: {
    margin: 0,
    fontSize: 34,
    letterSpacing: 0.2
  },
  pillRow: { display: "flex", alignItems: "center", gap: 10 },
  pill: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(2, 6, 23, 0.78)",
    border: "1px solid rgba(255,255,255,0.07)",
    color: "#cbd5e1",
    fontSize: 13
  },
  refreshBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    boxShadow: "0 10px 30px rgba(59,130,246,0.22)"
  },
  errorBox: {
    marginBottom: 14,
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(239, 68, 68, 0.10)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    color: "#fecaca"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: 18
  },
  panel: {
    borderRadius: 22,
    background: "rgba(2, 6, 23, 0.88)",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    overflow: "hidden",
    minHeight: 640
  },
  panelHeader: {
    padding: "16px 16px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)"
  },
  panelTitle: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  panelSub: { fontSize: 13, color: "#94a3b8" },

  // KEY: scroll per panel content
  scrollBox: {
    maxHeight: 560,
    overflowY: "auto",
    padding: 14,
    paddingRight: 10,
    overscrollBehavior: "contain"
  },

  muted: { color: "#94a3b8", fontSize: 14 },
  mutedItalic: { color: "#94a3b8", fontSize: 14, fontStyle: "italic" },

  cardsCol: { display: "grid", gap: 10 },

  projectCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    background: "rgba(15, 23, 42, 0.70)",
    border: "1px solid rgba(255,255,255,0.06)"
  },
  projectInfo: { minWidth: 0 },
  projectTitle: { fontWeight: 700, fontSize: 15, color: "#e2e8f0" },
  projectMeta: { fontSize: 12, color: "#94a3b8", marginTop: 3 },
  viewBtn: {
    padding: "9px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2, 6, 23, 0.45)",
    color: "#e2e8f0",
    cursor: "pointer"
  },

  resultCard: {
    padding: 14,
    borderRadius: 18,
    background: "rgba(15, 23, 42, 0.70)",
    border: "1px solid rgba(255,255,255,0.06)"
  },
  resultTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10
  },
  resultTitle: { fontWeight: 800, fontSize: 16 },
  resultMetaRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 },
  smallPill: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(2, 6, 23, 0.55)",
    border: "1px solid rgba(255,255,255,0.07)",
    color: "#cbd5e1",
    fontSize: 12
  },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 13, color: "#cbd5e1", fontWeight: 700, marginBottom: 6 },
  sectionText: { fontSize: 14, color: "#e2e8f0" },

  avgRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  avgLabel: { color: "#cbd5e1", fontWeight: 700, fontSize: 13 },
  avgValue: { color: "#fff", fontWeight: 800, fontSize: 16 },

  finalRow: {
    marginTop: 14,
    padding: 16,
    borderRadius: 18,
    background: "rgba(2, 6, 23, 0.55)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  finalLabel: { color: "#cbd5e1", fontWeight: 800, fontSize: 14 },
  finalValue: { color: "#fff", fontWeight: 900, fontSize: 22 }
};
