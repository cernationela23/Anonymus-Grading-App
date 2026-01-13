import { useEffect, useState } from "react";
import api from "../services/api";

export default function JuryPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // deliverableId -> input string
  const [gradeInputs, setGradeInputs] = useState({});
  // deliverableId -> {id,value} sau null
  const [myGrades, setMyGrades] = useState({});

  const load = async () => {
    setErr("");
    setMsg("");

    const res = await api.get("/jury/my");
    setItems(res.data);

    // incarcam notele existente in paralel (mai rapid)
    const gradesMap = {};
    await Promise.all(
      res.data.map(async (it) => {
        const deliverableId = it.deliverableId;
        const g = await api.get(`/jury/my/${deliverableId}/grade`);
        gradesMap[deliverableId] = g.data; // null sau {id,value}
      })
    );

    setMyGrades(gradesMap);
  };

  useEffect(() => {
    load().catch((e) => setErr(e.response?.data?.error || e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        // update
        await api.put(`/deliverables/${deliverableId}/grades/${existing.id}`, { value });
        setMsg("Grade updated!");
      }

      await load();
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h2>Evaluate projects</h2>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {items.length === 0 && <p>No deliverables assigned for evaluation.</p>}

      {items.map((it) => {
        const d = it.deliverable;
        const p = d?.project;

        const existing = myGrades[it.deliverableId];
        const hasExisting = existing && existing.id;

        return (
          <div
            key={it.assignmentId}
            style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}
          >
            <h3>{p?.title || "Project"}</h3>
            <p>{p?.description}</p>

            <p>
              <b>Deliverable ID:</b> {it.deliverableId}
            </p>
            <p>
              <b>Deadline:</b> {String(d?.deadline)}
            </p>

            {d?.videoUrl && (
              <p>
                <b>Video:</b>{" "}
                <a href={d.videoUrl} target="_blank" rel="noreferrer">
                  {d.videoUrl}
                </a>
              </p>
            )}

            {d?.deploymentUrl && (
              <p>
                <b>Deployment:</b>{" "}
                <a href={d.deploymentUrl} target="_blank" rel="noreferrer">
                  {d.deploymentUrl}
                </a>
              </p>
            )}

            <div style={{ marginTop: 10 }}>
              <input
                placeholder="Grade (1-10)"
                value={
                  gradeInputs[it.deliverableId] ??
                  (existing?.value !== undefined ? String(existing.value) : "")
                }
                onChange={(e) =>
                  setGradeInputs((prev) => ({
                    ...prev,
                    [it.deliverableId]: e.target.value
                  }))
                }
                style={{ padding: 6, marginRight: 8 }}
              />
              <button onClick={() => submitGrade(it.deliverableId)}>
                {hasExisting ? "Update grade" : "Submit grade"}
              </button>

              {hasExisting && (
                <span style={{ marginLeft: 10 }}>
                  Current: <b>{existing.value}</b>
          

                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
