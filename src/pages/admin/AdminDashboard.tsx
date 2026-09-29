import {
  Award,
  BookOpen,
  Building2,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  Gauge,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CompetencyChart, ParticipationChart } from "../../components/Charts";
import { LevelBadge, LevelPathBar, StatusBadge } from "../../components/LevelUI";
import { Badge, ConfirmButton, EmptyState, PageHeader, ProgressBar, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { IMD_RADAR_COMPETENCIES } from "../../data/constants";
import { Certificate, Trainee, TrainerExpertiseItem } from "../../types";
import { formatLevel, getLevelNumber, operationalReadiness, trainingImpact } from "../../utils/engine";

export default function AdminDashboard() {
  const {
    db,
    resetDemo,
    roleRequirements,
    traineeLevels,
    trainerExpertise,
    approveTrainerExpertise,
    rejectTrainerExpertise,
  } = useApp();

  // Navigation tab state for governance sections
  const [activeTab, setActiveTab] = useState<"overview" | "approvals" | "skill-gap" | "trainees">("overview");

  // State for Approvals sub-tab: "pending" | "approved"
  const [approvalSubTab, setApprovalSubTab] = useState<"pending" | "approved">("pending");

  // State for Trainee search & filter
  const [traineeSearch, setTraineeSearch] = useState("");
  const [traineeCentreFilter, setTraineeCentreFilter] = useState("all");
  const [selectedTraineeForCert, setSelectedTraineeForCert] = useState<Trainee | null>(null);

  // Stats calculation
  const pendingUsers = db.users.filter((u) => u.status === "pending").length;
  const activeCourses = db.courses.filter((c) => c.status === "published").length;
  const completed = db.enrollments.filter((e) => e.status === "completed").length;
  const completion = db.enrollments.length ? Math.round((completed / db.enrollments.length) * 100) : 0;
  const impact = trainingImpact(db);
  const readiness = db.trainees.length
    ? Math.round(db.trainees.reduce((s, t) => s + operationalReadiness(db, t.id).score, 0) / db.trainees.length)
    : 0;

  // =========================================================
  // PROMPT 1: TRAINER EXPERTISE APPROVALS DATA
  // Collect all pending and approved expertise entries across all trainers
  // =========================================================
  const allExpertiseEntries = useMemo(() => {
    const entries: {
      trainerId: string;
      trainerName: string;
      trainerDept: string;
      competencyId: string;
      competencyName: string;
      expertiseLevel: "L3" | "L4" | "L5";
      status: "Pending" | "Approved";
    }[] = [];

    db.trainers.forEach((trainer) => {
      const list = trainerExpertise[trainer.id] || [];
      list.forEach((item) => {
        const comp = IMD_RADAR_COMPETENCIES.find((c) => c.id === item.competencyId);
        entries.push({
          trainerId: trainer.id,
          trainerName: trainer.name,
          trainerDept: trainer.department,
          competencyId: item.competencyId,
          competencyName: comp?.name || item.competencyId,
          expertiseLevel: item.expertiseLevel,
          status: item.status || "Approved",
        });
      });
    });

    return entries;
  }, [db.trainers, trainerExpertise]);

  const pendingExpertise = allExpertiseEntries.filter((e) => e.status === "Pending");
  const approvedExpertise = allExpertiseEntries.filter((e) => e.status === "Approved");

  // =========================================================
  // PROMPT 3: CENTRE-WISE SKILL GAP DATA
  // Group trainees by centre, compute average level per competency and gap
  // =========================================================
  const centres = useMemo(() => {
    const centreMap = new Map<string, Trainee[]>();

    db.trainees.forEach((trainee) => {
      const cName = trainee.centre || "National Headquarters (New Delhi)";
      if (!centreMap.has(cName)) {
        centreMap.set(cName, []);
      }
      centreMap.get(cName)!.push(trainee);
    });

    // Make sure all distinct seeded centres are present
    const standardCentres = [
      "Bhopal Doppler Radar Station",
      "Patna Doppler Radar Station",
      "Visakhapatnam Cyclone Radar Station",
    ];
    standardCentres.forEach((sc) => {
      if (!centreMap.has(sc)) {
        centreMap.set(sc, []);
      }
    });

    return Array.from(centreMap.entries()).map(([centreName, centreTrainees]) => {
      const defaultRole = "Radar Operator";
      const roleReqs = roleRequirements[defaultRole] || {};

      // Compute competency stats for this centre
      const competencyStats = IMD_RADAR_COMPETENCIES.map((comp) => {
        const compName = comp.name;
        const requiredLevelStr = roleReqs[compName] || "L3";
        const requiredRank = getLevelNumber(requiredLevelStr);

        let sumRank = 0;
        let traineesWithGap = 0;

        centreTrainees.forEach((tr) => {
          const storedLevels = traineeLevels[tr.id] || traineeLevels[tr.userId] || {};
          const currentLevelStr = storedLevels[compName] || tr.competencies?.find((c) => c.name === compName)?.currentLevel || "L1";
          const currentRank = getLevelNumber(currentLevelStr);
          sumRank += currentRank;
          if (currentRank < requiredRank) {
            traineesWithGap += 1;
          }
        });

        const avgRank = centreTrainees.length ? sumRank / centreTrainees.length : 1;
        const avgLevel = formatLevel(Math.round(avgRank));
        const gap = Math.max(0, requiredRank - avgRank);
        const status: "Met" | "Gap" = avgRank >= requiredRank ? "Met" : "Gap";

        return {
          competencyId: comp.id,
          competencyName: compName,
          avgRank,
          avgLevel,
          requiredRank,
          requiredLevel: requiredLevelStr,
          gap,
          status,
          traineesWithGap,
        };
      });

      // Sort competencies within centre by biggest gap first
      competencyStats.sort((a, b) => b.gap - a.gap);

      // Summary of urgent training requirements
      const urgentRequirements = competencyStats
        .filter((c) => c.traineesWithGap > 0)
        .map((c) => `${c.traineesWithGap} trainee(s) need ${c.competencyName} (${c.avgLevel} → ${c.requiredLevel})`);

      return {
        centreName,
        trainees: centreTrainees,
        traineeCount: centreTrainees.length,
        competencyStats,
        urgentRequirements,
        allMet: centreTrainees.length > 0 && competencyStats.every((c) => c.status === "Met"),
      };
    });
  }, [db.trainees, roleRequirements, traineeLevels]);

  // =========================================================
  // PROMPT 4: TRAINEE MATRIX & CERTIFICATES DATA
  // Searchable trainee table with levels per competency and overall Met/Gap
  // =========================================================
  const filteredTrainees = useMemo(() => {
    return db.trainees.filter((t) => {
      const matchSearch = `${t.name} ${t.jobRole || t.role} ${t.centre || ""} ${t.department}`
        .toLowerCase()
        .includes(traineeSearch.toLowerCase());
      const matchCentre = traineeCentreFilter === "all" || t.centre === traineeCentreFilter;
      return matchSearch && matchCentre;
    });
  }, [db.trainees, traineeSearch, traineeCentreFilter]);

  // Helper to compute overall status for a trainee
  const getTraineeOverallStatus = (t: Trainee): { status: "Met" | "Gap"; gapCount: number } => {
    const roleName = t.jobRole || t.role || "Radar Operator";
    const reqs = roleRequirements[roleName] || {};
    const stored = traineeLevels[t.id] || traineeLevels[t.userId] || {};

    let gapCount = 0;
    Object.entries(reqs).forEach(([compName, reqLevelStr]) => {
      const reqRank = getLevelNumber(reqLevelStr);
      const currLevelStr = stored[compName] || t.competencies?.find((c) => c.name === compName)?.currentLevel || "L1";
      const currRank = getLevelNumber(currLevelStr);
      if (currRank < reqRank) {
        gapCount += 1;
      }
    });

    return { status: gapCount === 0 ? "Met" : "Gap", gapCount };
  };

  // Trainee certificates lookup
  const getTraineeCertificates = (traineeId: string): Certificate[] => {
    return db.certificates.filter((c) => c.traineeId === traineeId);
  };

  return (
    <>
      <PageHeader
        title="Directorate Governance & Admin Command"
        subtitle="National capacity oversight, trainer expertise verification, centre skill gaps, and competency certifications."
        actions={
          <ConfirmButton
            label="Reset demo data"
            className="btn btn-secondary"
            confirmText="Restore the original SIH demo dataset and sign out?"
            onConfirm={resetDemo}
          />
        }
      />

      {/* Main Admin Tab Bar */}
      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "2px solid var(--border-clean)",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {[
          { key: "overview", label: "Executive Overview", count: null },
          { key: "approvals", label: "Trainer Expertise Approvals", count: pendingExpertise.length },
          { key: "skill-gap", label: "Centre-wise Skill Gap", count: centres.length },
          { key: "trainees", label: "Trainee Level & Certificate Matrix", count: db.trainees.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: "10px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.key ? "2.5px solid #DC2626" : "2.5px solid transparent",
              color: activeTab === tab.key ? "#DC2626" : "var(--text-muted)",
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: "13.5px",
              cursor: "pointer",
              marginBottom: "-2px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
            {tab.count !== null && (
              <span
                style={{
                  fontSize: "11px",
                  background: activeTab === tab.key ? "#FEF2F2" : "#F1F5F9",
                  color: activeTab === tab.key ? "#DC2626" : "#64748B",
                  padding: "2px 7px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  border: activeTab === tab.key ? "1px solid #FECACA" : "1px solid #E2E8F0",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* =========================================================
          TAB 1: EXECUTIVE OVERVIEW
          ========================================================= */}
      {activeTab === "overview" && (
        <>
          <div className="stats-grid">
            <StatCard label="Total Trainees" value={db.trainees.length} icon={<GraduationCap />} caption="Across 3 radar centres" />
            <StatCard label="Total Trainers" value={db.trainers.length} icon={<Users />} caption={`${db.trainers.filter((t) => t.verified).length} verified`} />
            <StatCard label="Pending Registrations" value={pendingUsers} icon={<UserCheck />} caption="User clearance" />
            <StatCard label="Pending Expertise" value={pendingExpertise.length} icon={<Clock />} caption="Faculty level approvals" />
            <StatCard label="Active Courses" value={activeCourses} icon={<BookOpen />} />
            <StatCard label="Enrollments" value={db.enrollments.length} icon={<CheckCircle2 />} />
            <StatCard label="Assessments Passed" value={db.attempts.filter((a) => a.passed).length} icon={<ClipboardCheck />} />
            <StatCard label="Issued Certificates" value={db.certificates.length} icon={<Award />} />
            <StatCard label="Operational Readiness" value={`${readiness}/100`} icon={<Gauge />} caption={`${impact.readinessRate}% personnel ready`} />
          </div>

          <div className="dashboard-grid two">
            <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px" }}>
              <div className="panel-head">
                <div>
                  <h3>Competency improvement</h3>
                  <p>Average verified score trend</p>
                </div>
                <Badge tone="green">+30 pts</Badge>
              </div>
              <CompetencyChart />
            </section>
            <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px" }}>
              <div className="panel-head">
                <div>
                  <h3>Department participation</h3>
                  <p>Active learners by training area</p>
                </div>
              </div>
              <ParticipationChart />
            </section>
          </div>

          <div className="dashboard-grid two">
            <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px" }}>
              <div className="panel-head">
                <div>
                  <h3>Recent activity</h3>
                  <p>Latest workflow events</p>
                </div>
              </div>
              <div className="activity-list">
                {db.activities.slice(0, 6).map((a) => (
                  <div key={a.id}>
                    <i />
                    <div>
                      <strong>{a.text}</strong>
                      <span>{a.at}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px" }}>
              <div className="panel-head">
                <div>
                  <h3>Governance quick actions</h3>
                  <p>Pending directorial approvals</p>
                </div>
              </div>
              <div className="action-summary">
                <div style={{ cursor: "pointer" }} onClick={() => setActiveTab("approvals")}>
                  <span>Trainer Expertise Approvals</span>
                  <Badge tone={pendingExpertise.length ? "amber" : "gray"}>{pendingExpertise.length} pending</Badge>
                </div>
                <div>
                  <span>User registrations</span>
                  <Badge tone={pendingUsers ? "amber" : "gray"}>{pendingUsers}</Badge>
                </div>
                <div>
                  <span>Course proposals</span>
                  <Badge tone="amber">{db.courses.filter((c) => c.status === "pending").length}</Badge>
                </div>
                <div>
                  <span>Enrollment requests</span>
                  <Badge tone="amber">{db.enrollments.filter((e) => e.status === "requested").length}</Badge>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {/* =========================================================
          TAB 2: PROMPT 1 - TRAINER EXPERTISE APPROVALS
          ========================================================= */}
      {activeTab === "approvals" && (
        <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={20} color="#DC2626" /> Trainer Expertise Approvals
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
                Review trainer self-declared competency instructional authority (L3–L5). Approved expertise enables smart course matching.
              </p>
            </div>

            {/* Sub-tab switcher */}
            <div style={{ display: "flex", background: "#F1F5F9", padding: "3px", borderRadius: "8px", border: "1px solid #CBD5E1" }}>
              <button
                type="button"
                onClick={() => setApprovalSubTab("pending")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: approvalSubTab === "pending" ? "#FFFFFF" : "none",
                  color: approvalSubTab === "pending" ? "#0F172A" : "#64748B",
                  fontWeight: approvalSubTab === "pending" ? 700 : 500,
                  fontSize: "12.5px",
                  cursor: "pointer",
                  boxShadow: approvalSubTab === "pending" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Pending Review ({pendingExpertise.length})
              </button>
              <button
                type="button"
                onClick={() => setApprovalSubTab("approved")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: approvalSubTab === "approved" ? "#FFFFFF" : "none",
                  color: approvalSubTab === "approved" ? "#0F172A" : "#64748B",
                  fontWeight: approvalSubTab === "approved" ? 700 : 500,
                  fontSize: "12.5px",
                  cursor: "pointer",
                  boxShadow: approvalSubTab === "approved" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Approved Registry ({approvedExpertise.length})
              </button>
            </div>
          </div>

          {/* Pending Sub-tab */}
          {approvalSubTab === "pending" && (
            <>
              {pendingExpertise.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #CBD5E1", textAlign: "left" }}>
                        <th style={{ padding: "12px 14px" }}>Trainer</th>
                        <th style={{ padding: "12px 14px" }}>Competency Area</th>
                        <th style={{ padding: "12px 14px" }}>Requested Level</th>
                        <th style={{ padding: "12px 14px" }}>Status</th>
                        <th style={{ padding: "12px 14px", textAlign: "right" }}>Directorial Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingExpertise.map((item) => (
                        <tr key={`${item.trainerId}-${item.competencyId}`} style={{ borderBottom: "1px solid #E2E8F0" }}>
                          <td style={{ padding: "12px 14px" }}>
                            <strong>{item.trainerName}</strong>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.trainerDept}</div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <strong>{item.competencyName}</strong>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <LevelBadge level={item.expertiseLevel} size="sm" />
                          </td>
                          <td style={{ padding: "12px 14px" }}>
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
                              }}
                            >
                              <Clock size={11} /> Pending approval
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "8px" }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ background: "#059669", borderColor: "#059669", padding: "5px 12px", fontSize: "12px" }}
                                onClick={() => approveTrainerExpertise(item.trainerId, item.competencyId)}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ color: "#DC2626", borderColor: "#FCA5A5", background: "#FEF2F2", padding: "5px 12px", fontSize: "12px" }}
                                onClick={() => rejectTrainerExpertise(item.trainerId, item.competencyId)}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  title="No Pending Expertise Requests"
                  body="All trainer competency expertise submissions have been reviewed and approved."
                />
              )}
            </>
          )}

          {/* Approved Sub-tab */}
          {approvalSubTab === "approved" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #CBD5E1", textAlign: "left" }}>
                    <th style={{ padding: "12px 14px" }}>Trainer</th>
                    <th style={{ padding: "12px 14px" }}>Competency Area</th>
                    <th style={{ padding: "12px 14px" }}>Verified Level</th>
                    <th style={{ padding: "12px 14px" }}>Governance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedExpertise.map((item) => (
                    <tr key={`${item.trainerId}-${item.competencyId}`} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <strong>{item.trainerName}</strong>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.trainerDept}</div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <strong>{item.competencyName}</strong>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <LevelBadge level={item.expertiseLevel} size="sm" />
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Badge tone="green">
                          <CheckCircle size={12} style={{ marginRight: 4 }} /> Approved & Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =========================================================
          TAB 3: PROMPT 3 - CENTRE-WISE SKILL GAP DASHBOARD
          ========================================================= */}
      {activeTab === "skill-gap" && (
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px", padding: "20px", background: "#FFFFFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <Building2 size={22} color="#DC2626" />
              <h3 style={{ margin: 0, fontSize: "18px" }}>Radar Operational Centre Skill Gap Diagnostics</h3>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
              Aggregated capability readiness across all regional radar stations. Competencies are prioritized by largest gap first.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))", gap: "20px" }}>
            {centres.map((centre) => (
              <article
                key={centre.centreName}
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid #CBD5E1",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* Centre Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#DC2626", fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        <MapPin size={14} /> Regional Radar Centre
                      </div>
                      <h4 style={{ margin: "3px 0 2px", fontSize: "16.5px", color: "#0F172A" }}>{centre.centreName}</h4>
                      <small style={{ color: "#64748B", fontSize: "12px" }}>
                        {centre.traineeCount} Trainee(s) Deployed · Standard Role: Radar Operator
                      </small>
                    </div>
                    {centre.allMet ? (
                      <Badge tone="green">Centre Met</Badge>
                    ) : (
                      <Badge tone="amber">{centre.urgentRequirements.length} Gap(s)</Badge>
                    )}
                  </div>

                  {/* Training Requirement Summary */}
                  {centre.urgentRequirements.length > 0 ? (
                    <div
                      style={{
                        background: "#FFFBEB",
                        border: "1px solid #FDE68A",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        marginBottom: "16px",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: "12px", color: "#92400E", marginBottom: "4px" }}>
                        ⚡ Targeted Training Requirement:
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#78350F", lineHeight: "1.4" }}>
                        {centre.urgentRequirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        marginBottom: "16px",
                        fontSize: "12px",
                        color: "#166534",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <CheckCircle2 size={15} color="#16A34A" /> All station personnel have achieved required competency benchmarks.
                    </div>
                  )}

                  {/* Competency Gap Breakdown Rows */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {centre.competencyStats.map((stat) => (
                      <div
                        key={stat.competencyId}
                        style={{
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          background: "#F8FAFC",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <strong style={{ fontSize: "13px", color: "#0F172A" }}>{stat.competencyName}</strong>
                          <StatusBadge status={stat.status} size="sm" />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Avg Level:</span>
                            <LevelBadge level={stat.avgLevel} size="sm" />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Required:</span>
                            <LevelBadge level={stat.requiredLevel} size="sm" />
                          </div>
                        </div>

                        <LevelPathBar currentLevel={stat.avgLevel} requiredLevel={stat.requiredLevel} compact={true} />
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          TAB 4: PROMPT 4 - TRAINEE LEVEL & CERTIFICATE MATRIX
          ========================================================= */}
      {activeTab === "trainees" && (
        <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px", padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <GraduationCap size={22} color="#DC2626" /> Trainee Competency Matrix & Verified Certificates
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
                Inspect real-time skill levels, role gap status, and verified digital certificates for operational personnel.
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search trainee name, role..."
                  value={traineeSearch}
                  onChange={(e) => setTraineeSearch(e.target.value)}
                  style={{
                    padding: "7px 12px 7px 32px",
                    borderRadius: "6px",
                    border: "1.5px solid #CBD5E1",
                    fontSize: "13px",
                    width: "220px",
                  }}
                />
                <Search size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              </div>

              <select
                value={traineeCentreFilter}
                onChange={(e) => setTraineeCentreFilter(e.target.value)}
                style={{
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1.5px solid #CBD5E1",
                  fontSize: "13px",
                  background: "#FFFFFF",
                }}
              >
                <option value="all">All Radar Centres</option>
                <option value="Bhopal Doppler Radar Station">Bhopal Station</option>
                <option value="Patna Doppler Radar Station">Patna Station</option>
                <option value="Visakhapatnam Cyclone Radar Station">Visakhapatnam Station</option>
              </select>
            </div>
          </div>

          {/* Matrix Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #CBD5E1", textAlign: "left" }}>
                  <th style={{ padding: "12px 10px" }}>Trainee</th>
                  <th style={{ padding: "12px 10px" }}>Centre & Job Role</th>
                  <th style={{ padding: "12px 10px" }}>Overall Status</th>
                  <th style={{ padding: "12px 10px" }}>Competency Levels</th>
                  <th style={{ padding: "12px 10px", textAlign: "right" }}>Certificates</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainees.map((trainee) => {
                  const certs = getTraineeCertificates(trainee.id);
                  const overall = getTraineeOverallStatus(trainee);
                  const stored = traineeLevels[trainee.id] || traineeLevels[trainee.userId] || {};

                  return (
                    <tr key={trainee.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "12px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "#DC2626",
                              color: "#FFFFFF",
                              display: "grid",
                              placeItems: "center",
                              fontWeight: 700,
                              fontSize: "12px",
                              flexShrink: 0,
                            }}
                          >
                            {trainee.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <strong>{trainee.name}</strong>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{trainee.qualification}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        <div><strong>{trainee.jobRole || trainee.role}</strong></div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{trainee.centre || "National HQ"}</div>
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        {overall.status === "Met" ? (
                          <Badge tone="green">
                            <CheckCircle size={12} style={{ marginRight: 3 }} /> Requirements Met
                          </Badge>
                        ) : (
                          <Badge tone="amber">
                            <Sparkles size={12} style={{ marginRight: 3 }} /> {overall.gapCount} Gap(s) to Close
                          </Badge>
                        )}
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "420px" }}>
                          {IMD_RADAR_COMPETENCIES.map((comp) => {
                            const lvl = stored[comp.name] || trainee.competencies?.find((c) => c.name === comp.name)?.currentLevel || "L1";
                            return (
                              <div
                                key={comp.id}
                                title={`${comp.name}: ${lvl}`}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: "#F1F5F9",
                                  border: "1px solid #CBD5E1",
                                  fontSize: "11px",
                                }}
                              >
                                <span style={{ color: "#64748B", fontSize: "10px" }}>{comp.name.split(" ")[0]}:</span>
                                <strong>{lvl}</strong>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: "12px", padding: "5px 10px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                          onClick={() => setSelectedTraineeForCert(trainee)}
                        >
                          <Award size={14} color="#DC2626" />
                          <span>{certs.length} Certificate(s)</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =========================================================
          TRAINEE CERTIFICATES MODAL (PROMPT 4)
          ========================================================= */}
      {selectedTraineeForCert && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: "680px", border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Award size={20} color="#DC2626" /> Verified Certificates & Credentials
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
                  Trainee: <strong>{selectedTraineeForCert.name}</strong> ({selectedTraineeForCert.jobRole || selectedTraineeForCert.role}) · {selectedTraineeForCert.centre}
                </p>
              </div>
              <button
                type="button"
                className="sidebar-close"
                onClick={() => setSelectedTraineeForCert(null)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {getTraineeCertificates(selectedTraineeForCert.id).length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {getTraineeCertificates(selectedTraineeForCert.id).map((cert) => {
                  const course = db.courses.find((c) => c.id === cert.courseId);
                  return (
                    <div
                      key={cert.id}
                      style={{
                        background: "linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)",
                        border: "1.5px solid #86EFAC",
                        borderRadius: "10px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <ShieldCheck size={16} color="#16A34A" />
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            IMD OFFICIAL CERTIFICATE
                          </span>
                          <span style={{ fontSize: "11px", color: "#64748B" }}>· Code: {cert.certificateCode || cert.id}</span>
                        </div>
                        <h4 style={{ margin: "0 0 4px", fontSize: "15.5px", color: "#0F172A" }}>
                          {course?.title || cert.competency}
                        </h4>
                        <p style={{ margin: 0, fontSize: "12.5px", color: "#475569" }}>
                          Competency: <strong>{cert.competency}</strong> · Issued: {cert.issuedAt}
                        </p>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <LevelBadge level={cert.levelAchieved || "L2"} size="sm" />
                        <div style={{ marginTop: "4px", fontSize: "11px", color: "#16A34A", fontWeight: 600 }}>
                          Verified
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <Award size={36} color="#CBD5E1" style={{ margin: "0 auto 10px" }} />
                <h4 style={{ margin: "0 0 4px", color: "#475569" }}>No Certificates Issued Yet</h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>
                  Trainee is currently progressing through required modules and assessments.
                </p>
              </div>
            )}

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedTraineeForCert(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}