import { FormEvent, useState } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function TraineeProfile() {
  const { db, currentUser, updateTraineeProfile } = useApp();
  const t = db.trainees.find(x => x.userId === currentUser?.id);

  const [form, setForm] = useState(() => ({
    role: t?.role || "Weather Forecaster",
    centre: t?.centre || "Bhopal",
    qualification: t?.qualification || "",
    department: t?.department || "",
    designation: t?.designation || "",
    experienceYears: t?.experienceYears || 0,
    interests: t?.interests.join(", ") || "",
    goals: t?.goals || ""
  }));

  if (!t) return <div className="panel">Trainee profile not found.</div>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    updateTraineeProfile({
      role: form.role,
      centre: form.centre,
      qualification: form.qualification,
      department: form.department,
      designation: form.designation,
      experienceYears: Number(form.experienceYears),
      interests: form.interests.split(",").map(x => x.trim()).filter(Boolean),
      goals: form.goals
    });
  };

  return (
    <>
      <PageHeader
        title="Professional Trainee Profile"
        subtitle="Manage your operational role, meteorological centre, and competency qualification records."
      />

      {/* COMPETENCY STATUS CARD */}
      {t.competencies && t.competencies.length > 0 && (
        <section className="panel" style={{ marginBottom: "20px", border: "1.5px solid #CBD5E1" }}>
          <div className="panel-head" style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#0F172A" }}>
                Assigned Competency Standards ({t.role || "Weather Forecaster"})
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748B" }}>
                These competency benchmarks determine course access and progression eligibility.
              </p>
            </div>
            <Badge tone="blue">{t.centre || "Bhopal Centre"}</Badge>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginTop: "16px" }}>
            {t.competencies.map((comp) => {
              const isTargetMet = comp.currentLevel >= comp.targetLevel;
              return (
                <div
                  key={comp.name}
                  style={{
                    padding: "14px 16px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    background: isTargetMet ? "#F0FDF4" : "#FFFFFF"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "14px", color: "#0F172A" }}>{comp.name}</strong>
                    {isTargetMet ? (
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>✓ Met</span>
                    ) : (
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#B45309" }}>In Progress</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748B" }}>
                    <span>Current: <strong>{comp.currentLevel}</strong></span>
                    <span>Role Target: <strong>{comp.targetLevel}</strong></span>
                  </div>

                  {comp.lastAssessmentScore !== undefined && (
                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>
                      Diagnostic Score: <strong>{comp.lastAssessmentScore}%</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EDIT PROFILE FORM */}
      <section className="panel profile-panel">
        <form className="stack-form" onSubmit={submit}>
          <div className="form-grid two">
            <label>
              Operational Role
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="Weather Forecaster">Weather Forecaster</option>
                <option value="Aviation Forecaster">Aviation Forecaster</option>
                <option value="Radar Operator">Radar Operator</option>
              </select>
            </label>

            <label>
              Station / Centre
              <input value={form.centre} onChange={e => setForm({ ...form, centre: e.target.value })} placeholder="e.g. Bhopal, Patna, Delhi" />
            </label>

            <label>
              Qualification
              <input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} />
            </label>

            <label>
              Experience (Years)
              <input type="number" value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: Number(e.target.value) })} />
            </label>

            <label>
              Department / Office
              <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            </label>

            <label>
              Designation
              <input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
            </label>
          </div>

          <label>
            Specialized Interests
            <input value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} placeholder="Radar, Forecasting, Nowcasting" />
          </label>

          <label>
            Operational Career Goals
            <textarea rows={4} value={form.goals} onChange={e => setForm({ ...form, goals: e.target.value })} />
          </label>

          <button className="btn btn-primary" style={{ width: "fit-content" }}>
            Save Trainee Profile
          </button>
        </form>
      </section>
    </>
  );
}