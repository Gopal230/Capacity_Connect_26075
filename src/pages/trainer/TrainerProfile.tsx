import { FormEvent, useEffect, useState } from "react";
import { Badge, PageHeader } from "../../components/UI";
import { LevelBadge } from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";
import { IMD_RADAR_COMPETENCIES } from "../../data/constants";
import { ExpertiseStatus, Level, TrainerExpertiseItem } from "../../types";
import { Award, Clock, ShieldCheck } from "lucide-react";

interface CompetencyEntryState {
  enabled: boolean;
  level: "L3" | "L4" | "L5";
  status: ExpertiseStatus;
  originalLevel?: "L3" | "L4" | "L5";
  originalStatus?: ExpertiseStatus;
}

export default function TrainerProfile() {
  const { db, currentUser, updateTrainerProfile, getTrainerExpertise, setTrainerExpertise, notify } = useApp();
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

  // State for competency expertise keyed by competencyId
  const [expertiseMap, setExpertiseMap] = useState<Record<string, CompetencyEntryState>>(() => {
    const initialMap: Record<string, CompetencyEntryState> = {};
    IMD_RADAR_COMPETENCIES.forEach(c => {
      initialMap[c.id] = { enabled: false, level: "L3", status: "Pending" };
    });

    if (trainer) {
      const stored = getTrainerExpertise(trainer.id);
      stored.forEach(item => {
        initialMap[item.competencyId] = {
          enabled: true,
          level: item.expertiseLevel,
          status: item.status || "Approved",
          originalLevel: item.expertiseLevel,
          originalStatus: item.status || "Approved",
        };
      });
    }
    return initialMap;
  });

  // Keep state in sync if trainer id changes or loads
  useEffect(() => {
    if (trainer) {
      const stored = getTrainerExpertise(trainer.id);
      const updated: Record<string, CompetencyEntryState> = {};
      IMD_RADAR_COMPETENCIES.forEach(c => {
        const found = stored.find(s => s.competencyId === c.id);
        if (found) {
          updated[c.id] = {
            enabled: true,
            level: found.expertiseLevel,
            status: found.status || "Approved",
            originalLevel: found.expertiseLevel,
            originalStatus: found.status || "Approved",
          };
        } else {
          updated[c.id] = {
            enabled: false,
            level: "L3",
            status: "Pending",
          };
        }
      });
      setExpertiseMap(updated);
    }
  }, [trainer?.id]);

  if (!trainer) return <div className="panel">Trainer profile not available.</div>;

  const toggleCompetency = (compId: string) => {
    setExpertiseMap(prev => {
      const current = prev[compId];
      const nextEnabled = !current?.enabled;
      let nextStatus: ExpertiseStatus = "Pending";

      if (nextEnabled) {
        // If toggling on, check if it was originally approved with the exact same level
        if (current?.originalStatus === "Approved" && current.level === current.originalLevel) {
          nextStatus = "Approved";
        } else {
          nextStatus = "Pending";
        }
      }

      return {
        ...prev,
        [compId]: {
          ...current,
          enabled: nextEnabled,
          status: nextStatus,
        },
      };
    });
  };

  const setExpertiseLevel = (compId: string, newLevel: "L3" | "L4" | "L5") => {
    setExpertiseMap(prev => {
      const current = prev[compId];
      // If the level changed from originally approved level, mark as Pending
      let nextStatus: ExpertiseStatus = "Pending";
      if (current?.originalStatus === "Approved" && newLevel === current.originalLevel) {
        nextStatus = "Approved";
      }

      return {
        ...prev,
        [compId]: {
          ...current,
          level: newLevel,
          status: nextStatus,
        },
      };
    });
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

    // Save Competency Expertise with status (Approved / Pending) for Admin recommendation
    const itemsToSave: TrainerExpertiseItem[] = [];
    IMD_RADAR_COMPETENCIES.forEach(comp => {
      const entry = expertiseMap[comp.id];
      if (entry && entry.enabled) {
        itemsToSave.push({
          competencyId: comp.id,
          expertiseLevel: entry.level,
          status: entry.status,
        });
      }
    });

    setTrainerExpertise(trainer.id, itemsToSave);
    notify("Trainer profile and competency expertise updated successfully.", "success");
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
        <section className="panel profile-panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h3 style={{ margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.1rem" }}>
                <Award size={20} color="#0056D2" /> Competency Expertise & Instructional Levels
              </h3>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Select which radar competencies you can deliver courses for and your verified expertise level (L3 to L5). Newly added or edited competencies require Admin approval before being matched to courses.
              </p>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0056D2", background: "#EFF6FF", padding: "0.35rem 0.85rem", borderRadius: "1rem", border: "1px solid #BFDBFE" }}>
              {teachingCount} of {IMD_RADAR_COMPETENCIES.length} Competencies Selected
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "0.9rem", marginTop: "1rem" }}>
            {IMD_RADAR_COMPETENCIES.map(comp => {
              const current = expertiseMap[comp.id] || { enabled: false, level: "L3", status: "Pending" };
              return (
                <div
                  key={comp.id}
                  style={{
                    padding: "1rem",
                    border: current.enabled ? "1.5px solid #0056D2" : "1px solid #CBD5E1",
                    borderRadius: "8px",
                    backgroundColor: current.enabled ? "#F0F5FF" : "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.85rem",
                    transition: "all 0.15s ease",
                    boxShadow: current.enabled ? "0 2px 6px rgba(0, 86, 210, 0.08)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <input
                      type="checkbox"
                      id={`comp-${comp.id}`}
                      checked={current.enabled}
                      onChange={() => toggleCompetency(comp.id)}
                      style={{ marginTop: "0.2rem", width: "1.1rem", height: "1.1rem", cursor: "pointer", accentColor: "#0056D2" }}
                    />
                    <label htmlFor={`comp-${comp.id}`} style={{ cursor: "pointer", flex: 1, margin: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem", color: current.enabled ? "#0F172A" : "#64748B" }}>
                        {comp.name}
                      </div>
                      {comp.description && (
                        <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.15rem", lineHeight: 1.3 }}>
                          {comp.description}
                        </div>
                      )}
                    </label>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", paddingTop: "0.6rem", borderTop: "1px dashed #CBD5E1", opacity: current.enabled ? 1 : 0.45 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Level:</span>
                      <select
                        disabled={!current.enabled}
                        value={current.level}
                        onChange={e => setExpertiseLevel(comp.id, e.target.value as "L3" | "L4" | "L5")}
                        style={{
                          fontSize: "0.825rem",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          border: "1px solid #CBD5E1",
                          background: current.enabled ? "#FFFFFF" : "#F1F5F9",
                          fontWeight: 600,
                          cursor: current.enabled ? "pointer" : "default",
                        }}
                      >
                        <option value="L3">L3 (Proficient)</option>
                        <option value="L4">L4 (Advanced)</option>
                        <option value="L5">L5 (Expert)</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "nowrap" }}>
                      <LevelBadge level={current.level} size="sm" />
                      {current.enabled && current.status === "Pending" && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "#FEF3C7",
                            color: "#92400E",
                            border: "1px solid #FDE68A",
                            whiteSpace: "nowrap",
                            lineHeight: 1,
                          }}
                        >
                          <Clock size={11} style={{ flexShrink: 0 }} /> Pending admin approval
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Existing General Profile Form */}
        <section className="panel profile-panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px" }}>
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