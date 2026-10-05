import { useState } from "react";
import { Award, Compass, Search, ShieldCheck, Sparkles, UserCheck, Users } from "lucide-react";
import { LevelBadge } from "../../components/LevelUI";
import { Badge, ConfirmButton, Drawer, EmptyState, PageHeader, SearchBox } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { IMD_RADAR_COMPETENCIES } from "../../data/constants";
import { Trainer } from "../../types";
import { matchTrainersForCompetency } from "../../utils/engine";

export default function AdminTrainers() {
  const { db, verifyTrainer, trainerExpertise } = useApp();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Trainer | null>(null);

  // State for Level-Based Trainer Matching Tool (Prompt 2)
  const [matchingCompetency, setMatchingCompetency] = useState(IMD_RADAR_COMPETENCIES[0].id);

  const trainers = db.trainers.filter((t) =>
    `${t.name} ${t.department} ${t.subjects.join(" ")}`.toLowerCase().includes(q.toLowerCase())
  );

  // Calculate matched trainers using the level-based engine
  const matchedTrainers = matchTrainersForCompetency(db.trainers, matchingCompetency, trainerExpertise);
  const selectedCompObj = IMD_RADAR_COMPETENCIES.find((c) => c.id === matchingCompetency);

  return (
    <>
      <PageHeader
        title="Trainer Faculty & Competency Matching"
        subtitle="Manage certified trainers, verify instructional authority, and match faculty to competencies by level (L3–L5)."
      />

      {/* =========================================================
          PROMPT 2: LEVEL-BASED TRAINER MATCHING TOOL
          ========================================================= */}
      <section
        className="panel"
        style={{
          border: "1.5px solid #CBD5E1",
          borderRadius: "12px",
          padding: "22px",
          marginBottom: "24px",
          background: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Compass size={20} color="var(--brand-primary)" />
              <h3 style={{ margin: 0, fontSize: "17.5px", color: "#0F172A" }}>
                Level-Based Trainer Competency Matcher
              </h3>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
              Find and rank faculty by approved competency expertise level (L5 &gt; L4 &gt; L3), instructional rating, experience, and availability.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-body)" }}>Target Competency:</span>
            <select
              value={matchingCompetency}
              onChange={(e) => setMatchingCompetency(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1.5px solid #CBD5E1",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--brand-primary)",
                background: "#FEF2F2",
              }}
            >
              {IMD_RADAR_COMPETENCIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {matchedTrainers.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "14px" }}>
            {matchedTrainers.map((m, rank) => (
              <div
                key={m.trainer.id}
                style={{
                  border: rank === 0 ? "2px solid var(--brand-primary)" : "1.5px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "16px",
                  background: rank === 0 ? "linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)" : "#FFFFFF",
                  boxShadow: rank === 0 ? "0 4px 12px rgba(193, 18, 31, 0.1)" : "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: rank === 0 ? "var(--brand-primary)" : "#475569",
                        color: "#FFFFFF",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      #{rank + 1}
                    </div>
                    <div>
                      <strong style={{ fontSize: "14.5px", color: "#0F172A" }}>{m.trainer.name}</strong>
                      <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{m.trainer.department}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--brand-primary)" }}>
                      {m.matchScore}%
                    </div>
                    <span style={{ fontSize: "10.5px", color: "#64748B" }}>Match Score</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", margin: "10px 0", flexWrap: "wrap" }}>
                  <LevelBadge level={m.expertiseLevel} size="sm" />
                  <Badge tone="green">Approved</Badge>
                  <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    ★ {m.trainer.rating.toFixed(1)} · {m.trainer.experienceYears}y exp · {m.trainer.availability}
                  </span>
                </div>

                {/* Score Formula Breakdown */}
                <div style={{ background: "#F8FAFC", borderRadius: "6px", padding: "8px 10px", fontSize: "11.5px", color: "#334155", border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span>Level Authority ({m.expertiseLevel}):</span>
                    <strong>+{m.breakdown.levelPoints} pts</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span>Rating Score:</span>
                    <strong>+{m.breakdown.ratingPoints} pts</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span>Experience Score:</span>
                    <strong>+{m.breakdown.experiencePoints} pts</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Availability ({m.trainer.availability}):</span>
                    <strong>+{m.breakdown.availabilityPoints} pts</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No Approved Trainers Found for ${selectedCompObj?.name || matchingCompetency}`}
            body="No trainers currently have an approved expertise entry (L3–L5) for this competency. Review pending trainer submissions on the Admin Dashboard."
          />
        )}
      </section>

      {/* =========================================================
          FACULTY DIRECTORY CARDS
          ========================================================= */}
      <div className="toolbar" style={{ marginBottom: "16px" }}>
        <SearchBox value={q} onChange={setQ} placeholder="Search trainer name, department, or subject..." />
      </div>

      <div className="card-grid">
        {trainers.map((t) => {
          const expList = trainerExpertise[t.id] || [];
          const approvedCount = expList.filter((x) => x.status === "Approved").length;

          return (
            <article className="trainer-card" key={t.id} style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px", padding: "18px" }}>
              <div className="trainer-card-head">
                <div className="avatar large">{t.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.department}</p>
                </div>
                {t.verified ? <Badge tone="green">Admin Verified</Badge> : <Badge tone="amber">Review needed</Badge>}
              </div>

              <div className="trainer-metrics">
                <span><b>{t.rating || "—"}</b> Rating</span>
                <span><b>{t.experienceYears}</b> Years</span>
                <span><b>{approvedCount}</b> Competencies</span>
              </div>

              <p className="clamp">{t.bio}</p>

              {/* Verified Competency Level Badges */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "8px 0" }}>
                {expList
                  .filter((x) => x.status === "Approved")
                  .slice(0, 3)
                  .map((item) => {
                    const cObj = IMD_RADAR_COMPETENCIES.find((c) => c.id === item.competencyId);
                    return (
                      <div key={item.competencyId} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{cObj?.name.split(" ")[0]}:</span>
                        <LevelBadge level={item.expertiseLevel} size="sm" />
                      </div>
                    );
                  })}
              </div>

              <div className="card-actions" style={{ marginTop: "12px" }}>
                <button className="btn btn-secondary" onClick={() => setSelected(t)}>
                  Review profile
                </button>
                {!t.verified ? (
                  <ConfirmButton
                    label="Verify"
                    confirmText={`Verify ${t.name}'s expertise and trainer profile?`}
                    onConfirm={() => verifyTrainer(t.id, true)}
                  />
                ) : (
                  <ConfirmButton
                    label="Remove verification"
                    className="btn btn-danger-soft"
                    confirmText={`Remove verification badge from ${t.name}?`}
                    onConfirm={() => verifyTrainer(t.id, false)}
                  />
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Drawer Review */}
      {selected && (
        <Drawer title="Trainer Verification & Expertise Profile" onClose={() => setSelected(null)}>
          <div className="profile-review">
            <h2>{selected.name}</h2>
            <Badge tone={selected.verified ? "green" : "amber"}>
              {selected.verified ? "Admin Verified" : "Pending verification"}
            </Badge>

            <dl>
              <dt>Qualification</dt>
              <dd>{selected.qualification}</dd>
              <dt>Experience</dt>
              <dd>{selected.experienceYears} years</dd>
              <dt>Availability</dt>
              <dd>{selected.availability}</dd>
              <dt>Rating</dt>
              <dd>{selected.rating ? `${selected.rating} / 5` : "No rating yet"}</dd>
              <dt>Approved Competency Levels</dt>
              <dd>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                  {(trainerExpertise[selected.id] || [])
                    .filter((x) => x.status === "Approved")
                    .map((item) => {
                      const cObj = IMD_RADAR_COMPETENCIES.find((c) => c.id === item.competencyId);
                      return (
                        <div key={item.competencyId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: "4px" }}>
                          <span style={{ fontSize: "12.5px" }}>{cObj?.name || item.competencyId}</span>
                          <LevelBadge level={item.expertiseLevel} size="sm" />
                        </div>
                      );
                    })}
                </div>
              </dd>
            </dl>
          </div>
        </Drawer>
      )}
    </>
  );
}