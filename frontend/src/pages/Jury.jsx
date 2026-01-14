import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function JuryPage() {
  // IMPORTANT: trebuie sa fie aceeasi valoare ca in backend (EDIT_WINDOW_MINUTES)
  const EDIT_WINDOW_MINUTES = 120;

  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // deliverableId -> input string
  const [gradeInputs, setGradeInputs] = useState({});
  // deliverableId -> {id,value,createdAt} sau null
  const [myGrades, setMyGrades] = useState({});

  // ====== helpers UI (format ora + calcul deadline editare) ======
  const formatHumanDateTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    // format uman, gen: 14 ian 2026, 20:35
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const addMinutes = (iso, minutes) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return new Date(d.getTime() + minutes * 60 * 1000);
  };

  const isEditWindowExpired = (createdAtIso) => {
    if (!createdAtIso) return false;
    const end = addMinutes(createdAtIso, EDIT_WINDOW_MINUTES);
    if (!end) return false;
    return Date.now() > end.getTime();
  };

  // ====== load data ======
  const load = async () => {
    setErr("");
    setMsg("");

    const res = await api.get("/jury/my");
    setItems(res.data);

    // incarcam notele existente in paralel
    const gradesMap = {};
    await Promise.all(
      res.data.map(async (it) => {
        const deliverableId = it.deliverableId;
        const gRes = await api.get(`/jury/my/${deliverableId}/grade`);
        // asteptam: null sau { id, value, createdAt }
        gradesMap[deliverableId] = gRes.data;
      })
    );

    setMyGrades(gradesMap);
  };

  useEffect(() => {
    load().catch((e) => setErr(e.response?.data?.error || e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== submit grade ======
  const submitGrade = async (deliverableId) => {
    setErr("");
    setMsg("");

    try {
      const raw = gradeInputs[deliverableId];
      const value = Number(raw);

      if (raw === undefined || raw === "") {
        setErr("Please enter a grade");
        return;
      }

      if (Number.isNaN(value)) {
        setErr("Invalid grade value");
        return;
      }

      const existing = myGrades[deliverableId];
      const hasExisting = existing && existing.id;

      if (!hasExisting) {
        // create
        await api.post(`/deliverables/${deliverableId}/grades`, { value });
        setMsg("Grade submitted!");
      } else {
        // update (cu time limit in backend)
        await api.put(`/deliverables/${deliverableId}/grades/${existing.id}`, { value });
        setMsg("Grade updated!");
      }

      await load();
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  // ====== styles (in acelasi fisier) ======
  const styles = useMemo(
    () => ({
      page: {
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #020617, #000)",
        color: "#e5e7eb",
        position: "relative",
        overflow: "hidden",
        fontFamily: '"Segoe UI", sans-serif',
      },
      bg: { position: "absolute", inset: "-40%", pointerEvents: "none" },
      container: {
        position: "relative",
        zIndex: 2,
        padding: 28,
        maxWidth: 1100,
        margin: "0 auto",
      },
      headerRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 18,
      },
      title: {
        margin: 0,
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 0.3,
        color: "#f8fafc",
      },
      pill: {
        padding: "8px 12px",
        borderRadius: 999,
        background: "rgba(2, 6, 23, 0.85)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        color: "#cbd5e1",
        fontSize: 13,
        whiteSpace: "nowrap",
      },
      card: {
        borderRadius: 18,
        padding: 18,
        background: "rgba(2, 6, 23, 0.92)",
        boxShadow:
          "0 24px 70px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.07)",
        marginBottom: 14,
      },
      cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
      },
      projectTitle: {
        margin: 0,
        fontSize: 18,
        fontWeight: 700,
        color: "#f8fafc",
      },
      desc: {
        marginTop: 6,
        marginBottom: 10,
        color: "#94a3b8",
        fontSize: 13,
      },
      badge: {
        padding: "6px 10px",
        borderRadius: 999,
        background: "rgba(15, 23, 42, 0.9)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        color: "#cbd5e1",
        fontSize: 12,
        height: "fit-content",
      },
      metaRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
        marginTop: 10,
      },
      metaPill: {
        padding: "6px 10px",
        borderRadius: 999,
        background: "rgba(15, 23, 42, 0.7)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        color: "#cbd5e1",
        fontSize: 12,
      },
      link: {
        color: "#60a5fa",
        textDecoration: "none",
        fontSize: 12,
      },
      gradeRow: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 14,
        flexWrap: "wrap",
      },
      input: {
        width: 220,
        padding: "12px 14px",
        borderRadius: 12,
        border: "none",
        background: "#0f172a",
        color: "#f8fafc",
        outline: "none",
        fontSize: 14,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      btn: {
        padding: "12px 16px",
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        color: "white",
        fontWeight: 600,
        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
        boxShadow: "0 10px 30px rgba(59,130,246,0.25)",
      },
      btnDisabled: {
        opacity: 0.55,
        cursor: "not-allowed",
      },
      subtle: { color: "#94a3b8", fontSize: 13 },
      current: { color: "#e2e8f0", fontSize: 13 },
      ok: { color: "#34d399", marginBottom: 10 },
      bad: { color: "#f87171", marginBottom: 10 },
      empty: { color: "#94a3b8" },
      // fundal cu linii (ca la login)
      bgBefore: {
        position: "absolute",
        width: "180%",
        height: "180%",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0px, rgba(255, 255, 255, 0.08) 2px, transparent 2px, transparent 80px)",
        transform: "rotate(-10deg)",
        animation: "linesSlowLeft 90s linear infinite",
      },
      bgAfter: {
        position: "absolute",
        width: "180%",
        height: "180%",
        backgroundImage:
          "repeating-linear-gradient(60deg, rgba(59, 130, 246, 0.12) 0px, rgba(59, 130, 246, 0.12) 2px, transparent 2px, transparent 110px)",
        transform: "rotate(6deg)",
        animation: "linesSlowRight 130s linear infinite",
      },
      keyframes: `
        @keyframes linesSlowLeft {
          from { transform: translateX(0) rotate(-10deg); }
          to { transform: translateX(-300px) rotate(-10deg); }
        }
        @keyframes linesSlowRight {
          from { transform: translateX(0) rotate(6deg); }
          to { transform: translateX(300px) rotate(6deg); }
        }
      `,
    }),
    []
  );

  return (
    <div style={styles.page}>
      {/* keyframes in-page */}
      <style>{styles.keyframes}</style>

      {/* background */}
      <div style={styles.bg} aria-hidden="true">
        <div style={styles.bgBefore} />
        <div style={styles.bgAfter} />
      </div>

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Evaluate projects</h2>
          <div style={styles.pill}>Assigned deliverables: {items.length}</div>
        </div>

        {msg && <p style={styles.ok}>{msg}</p>}
        {err && <p style={styles.bad}>{err}</p>}

        {items.length === 0 && <p style={styles.empty}>No deliverables assigned for evaluation.</p>}

        {items.map((it) => {
          const d = it.deliverable;
          const p = d?.project;

          const deliverableId = it.deliverableId;
          const existing = myGrades[deliverableId];
          const hasExisting = existing && existing.id;

          // cand expira editarea
          const editUntilDate = hasExisting ? addMinutes(existing.createdAt, EDIT_WINDOW_MINUTES) : null;
          const expired = hasExisting ? isEditWindowExpired(existing.createdAt) : false;

          return (
            <div key={it.assignmentId} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={{ minWidth: 0 }}>
                  <h3 style={styles.projectTitle}>{p?.title || "Project"}</h3>
                  {p?.description && <div style={styles.desc}>{p.description}</div>}

                  <div style={styles.metaRow}>
                    <span style={styles.metaPill}>
                      Deadline: <b>{formatHumanDateTime(d?.deadline)}</b>
                    </span>

                    <span style={styles.metaPill}>
                      Deliverable ID: <b>{deliverableId}</b>
                    </span>

                    {d?.videoUrl && (
                      <span style={styles.metaPill}>
                        Video:{" "}
                        <a style={styles.link} href={d.videoUrl} target="_blank" rel="noreferrer">
                          open
                        </a>
                      </span>
                    )}

                    {d?.deploymentUrl && (
                      <span style={styles.metaPill}>
                        Deployment:{" "}
                        <a style={styles.link} href={d.deploymentUrl} target="_blank" rel="noreferrer">
                          open
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                <div style={styles.badge}>Deliverable #{deliverableId}</div>
              </div>

              <div style={styles.gradeRow}>
                <input
                  style={styles.input}
                  placeholder="Grade (1-10)"
                  value={
                    gradeInputs[deliverableId] ??
                    (existing?.value !== undefined ? String(existing.value) : "")
                  }
                  onChange={(e) =>
                    setGradeInputs((prev) => ({
                      ...prev,
                      [deliverableId]: e.target.value,
                    }))
                  }
                />

                <button
                  style={{
                    ...styles.btn,
                    ...(expired ? styles.btnDisabled : null),
                  }}
                  onClick={() => submitGrade(deliverableId)}
                  disabled={expired}
                  title={expired ? "Edit window expired" : ""}
                >
                  {hasExisting ? "Update grade" : "Submit grade"}
                </button>

                {hasExisting && (
                  <span style={styles.current}>
                    Current: <b>{existing.value}</b>
                  </span>
                )}
              </div>

              {/* AICI afisam pana cand poate fi modificata nota */}
              <div style={{ marginTop: 10 }}>
                {!hasExisting ? (
                  <div style={styles.subtle}>
                    After you submit, you can edit the grade for{" "}
                    <b>{EDIT_WINDOW_MINUTES} minutes</b>.
                  </div>
                ) : (
                  <div style={styles.subtle}>
                    {expired ? (
                      <>
                        Edit window expired. You could edit until{" "}
                        <b>{formatHumanDateTime(editUntilDate?.toISOString())}</b>.
                      </>
                    ) : (
                      <>
                        You can edit this grade until{" "}
                        <b>{formatHumanDateTime(editUntilDate?.toISOString())}</b>{" "}
                        (within {EDIT_WINDOW_MINUTES} minutes from submission).
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
