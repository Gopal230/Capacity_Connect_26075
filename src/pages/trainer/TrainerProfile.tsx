import { FormEvent, useEffect, useState } from "react";
import { Badge, PageHeader } from "../../components/UI";
import { LevelBadge } from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";
import { IMD_RADAR_COMPETENCIES } from "../../data/constants";
import { Level, TrainerExpertiseItem } from "../../types";
import { Award, BookOpen, CheckCircle, ShieldCheck } from "lucide-react";

export default function TrainerProfile() {
  const { db, currentUser, updateTrainerProfile, getTrainerExpertise, setTrainerExpertise } = useApp();
  const trainer = db.trainers.find(t => t.userId === currentUser?.id);

  const [form, setForm] = useState(() => ({
    qualification: trainer?.qualification || "",
    experienceYears: trainer?.experienceYears || 0,
    subjects: trainer?.subjects.join(", ") || "",
    skills: trainer?.skills.join(", ") || "",
    level: (trainer?.level || "Beginner") as Level,
    certifications: trainer?.certifications.join(", ") || "",
    availability: trainer?.availability || "Available",
    bio: trainer?.bio || "",
  }));

  // State for competency expertise keyed by competencyId: { enabled: boolean, expertiseLevel: "L3" | "L4" | "L5" }
  const [expertiseMap, setExpertiseMap] = useState<Record<string, { enabled: boolean; level: "L3" | "L4" | "L5" }>>(() => {
    const initialMap: Record<string, { enabled: boolean; level: "L3" | "L4" | "L5" }> = {};
    IMD_RADAR_COMPETENCIES.forEach(c => {
      initialMap[c.id] = { enabled: false, level: "L3" };
    });

    if (trainer) {
      const stored = getTrainerExpertise(trainer.id);
      stored.forEach(item => {
        initialMap[item.competencyId] = {
          enabled: true,
          level: item.expertiseLevel,
        };
      });
    }
    return initialMap;
  });

  // Keep state in sync if trainer id changes or loads
  useEffect(() => {
    if (trainer) {
      const stored = getTrainerExpertise(trainer.id);
      const updated: Record<string, { enabled: boolean; level: "L3" | "L4" | "L5" }> = {};
      IMD_RADAR_COMPETENCIES.forEach(c => {
        const found = stored.find(s => s.competencyId === c.id);
        if (found) {
          updated[c.id] = { enabled: true, level: found.expertiseLevel };
        } else {
          updated[c.id] = { enabled: false, level: "L3" };
        }
      });
      setExpertiseMap(updated);
    }
  }, [trainer?.id]);

  if (!trainer) return <div className="panel">Trainer profile not available.</div>;

  const toggleCompetency = (compId: string) => {
    setExpertiseMap(prev => ({
      ...prev,
      [compId]: {
        ...prev[compId],
        enabled: !prev[compId]?.enabled,
      },
    }));
  };

  const setExpertiseLevel = (compId: string, level: "L3" | "L4" | "L5") => {
    setExpertiseMap(prev => ({
      ...prev,
      [compId]: {
        ...prev[compId],
        level,
      },
    }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    updateTrainerProfile({
      qualification: form.qualification,
      experienceYears: Number(form.experienceYears),
      subjects: form.subjects.split(",").map(x => x.trim()).filter(Boolean),
      skills: form.skills.split(",").map(x => x.trim()).filter(Boolean),
      level: form.level,
      certifications: form.certifications.split(",").map(x => x.trim()).filter(Boolean),
      availability: form.availability as any,
      bio: form.bio,
    });

    // Save Competency Expertise for Admin recommendation
    const itemsToSave: TrainerExpertiseItem[] = [];
    IMD_RADAR_COMPETENCIES.forEach(comp => {
      const entry = expertiseMap[comp.id];
      if (entry && entry.enabled) {
        itemsToSave.push({
          competencyId: comp.id,
          expertiseLevel: entry.level,
        });
      }
    });

    setTrainerExpertise(trainer.id, itemsToSave);
  };

  const teachingCount = Object.values(expertiseMap).filter(x => x.enabled).length;

  return (
    <>
      <PageHeader
        title="Trainer Profile & Competency Expertise"
        subtitle="Maintain qualification, competency instructional capability (L3–L5), and availability for Admin verification."
        actions={trainer.verified ? <Badge tone="green"><ShieldCheck size={14} style={{ marginRight: 4 }} /> Admin Verified</Badge> : <Badge tone="amber">Verification pending</Badge>}
      />

      <form className="stack-form" onSubmit={submit}>
        {/* Competency Expertise Section */}
        <section className="panel profile-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h3 style={{ margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.1rem" }}>
                <Award size={20} className="text-primary" /> Competency Expertise & Instructional Levels
              </h3>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Select which radar competencies you can deliver courses for and your verified expertise level (L3 to L5). Used for smart admin course-trainer matching.
              </p>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)", background: "var(--color-primary-soft, #f0fdf4)", padding: "0.25rem 0.75rem", borderRadius: "1rem", border: "1px solid var(--border-color)" }}>
              {teachingCount} of {IMD_RADAR_COMPETENCIES.length} Competencies Selected
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.85rem", marginTop: "1rem" }}>
            {IMD_RADAR_COMPETENCIES.map(comp => {
              const current = expertiseMap[comp.id] || { enabled: false, level: "L3" };
              return (
                <div
                  key={comp.id}
                  style={{
                    padding: "0.85rem 1rem",
                    border: current.enabled ? "1.5px solid var(--color-primary, #059669)" : "1px solid var(--border-color, #e2e8f0)",
                    borderRadius: "0.5rem",
                    backgroundColor: current.enabled ? "var(--color-primary-soft, rgba(5, 150, 105, 0.03))" : "var(--bg-card, #ffffff)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <input
                      type="checkbox"
                      id={`comp-${comp.id}`}
                      checked={current.enabled}
                      onChange={() => toggleCompetency(comp.id)}
                      style={{ marginTop: "0.2rem", width: "1.1rem", height: "1.1rem", cursor: "pointer", accentColor: "var(--color-primary, #059669)" }}
                    />
                    <label htmlFor={`comp-${comp.id}`} style={{ cursor: "pointer", flex: 1, margin: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.925rem", color: current.enabled ? "var(--text-main, #0f172a)" : "var(--text-muted, #64748b)" }}>
                        {comp.name}
                      </div>
                      {comp.description && (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted, #64748b)", marginTop: "0.15rem", lineHeight: 1.3 }}>
                          {comp.description}
                        </div>
                      )}
                    </label>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px dashed var(--border-color, #e2e8f0)", opacity: current.enabled ? 1 : 0.4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Level:</span>
                      <select
                        disabled={!current.enabled}
                        value={current.level}
                        onChange={e => setExpertiseLevel(comp.id, e.target.value as "L3" | "L4" | "L5")}
                        style={{
                          fontSize: "0.825rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.25rem",
                          border: "1px solid var(--border-color)",
                          background: current.enabled ? "var(--bg-surface, #fff)" : "#f1f5f9",
                          fontWeight: 500,
                        }}
                      >
                        <option value="L3">L3 (Proficient)</option>
                        <option value="L4">L4 (Advanced)</option>
                        <option value="L5">L5 (Expert)</option>
                      </select>
                    </div>

                    <LevelBadge level={current.level} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Existing General Profile Form */}
        <section className="panel profile-panel">
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>Professional Background & Credentials</h3>
          <div className="form-grid two">
            <label>
              Qualification
              <input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} />
            </label>
            <label>
              Experience (years)
              <input type="number" min={0} value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: Number(e.target.value) })} />
            </label>
            <label>
              Subjects of expertise
              <input value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} placeholder="Comma separated" />
            </label>
            <label>
              Competency level
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value as Level })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
            <label>
              Skills
              <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="Comma separated" />
            </label>
            <label>
              Certifications
              <input value={form.certifications} onChange={e => setForm({ ...form, certifications: e.target.value })} placeholder="Comma separated" />
            </label>
            <label>
              Availability
              <select value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value as any })}>
                <option>Available</option>
                <option>Limited</option>
                <option>Unavailable</option>
              </select>
            </label>
          </div>
          <label style={{ marginTop: "1rem" }}>
            Professional biography
            <textarea rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </label>
          <div style={{ marginTop: "1.5rem" }}>
            <button type="submit" className="btn btn-primary" style={{ minWidth: "220px" }}>
              Save Profile & Competency Expertise
            </button>
          </div>
        </section>
      </form>
    </>
  );
}