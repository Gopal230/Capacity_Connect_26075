import { ArrowLeft, CheckCircle2, GraduationCap, ShieldCheck, UserCheck, UserPlus, Users } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";

export default function RegisterPage() {
  const { register, roleRequirements } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get("role") as Role | null;

  const initialRole: Role = roleParam === "admin" || roleParam === "trainer" ? roleParam : "trainee";
  const [activeRole, setActiveRole] = useState<Role>(initialRole);

  // Dynamic job roles list derived from role requirements map
  const availableJobRoles = Object.keys(roleRequirements).length > 0
    ? Object.keys(roleRequirements)
    : ["Radar Operator", "Weather Forecaster", "Aviation Forecaster"];

  // Common credentials
  const [common, setCommon] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Trainee-specific inputs
  const [traineeFields, setTraineeFields] = useState({
    jobRole: availableJobRoles[0] || "Radar Operator",
    centre: "MC Bhopal",
    employeeId: "IMD-MET-4821",
    experienceYears: "1-3 Years",
    specialization: "Doppler Radar Operations",
  });

  // Trainer-specific inputs
  const [trainerFields, setTrainerFields] = useState({
    facultyRank: "Scientist-E",
    institute: "Central Training Institute (CTI) Pune",
    subjectExpertise: "Doppler Radar Operations & Processing",
    teachingExperience: "5-10 Years",
    qualification: "M.Tech / M.Sc Meteorology",
  });

  // Admin-specific inputs
  const [adminFields, setAdminFields] = useState({
    division: "Capacity Building & Training Directorate",
    clearanceLevel: "Level 1 - Directorate System Administrator",
    serviceCode: "GOI-IMD-ADM-9021",
    justification: "Mandated oversight of operational readiness, trainee credential verification, and syllabus governance.",
  });

  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (roleParam && (roleParam === "admin" || roleParam === "trainer" || roleParam === "trainee")) {
      setActiveRole(roleParam);
    }
  }, [roleParam]);

  const switchRole = (role: Role) => {
    setActiveRole(role);
    setSearchParams({ role });
    setMessage(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();

    let department = "";
    let designation = "";
    let jobRole: string | undefined = undefined;

    if (activeRole === "trainee") {
      department = `${traineeFields.centre} (${traineeFields.specialization})`;
      designation = `Operational Trainee · ${traineeFields.experienceYears} exp · ID: ${traineeFields.employeeId}`;
      jobRole = traineeFields.jobRole;
    } else if (activeRole === "trainer") {
      department = trainerFields.institute;
      designation = `${trainerFields.facultyRank} · ${trainerFields.subjectExpertise} (${trainerFields.qualification})`;
    } else if (activeRole === "admin") {
      department = adminFields.division;
      designation = `${adminFields.clearanceLevel} · Code: ${adminFields.serviceCode}`;
    }

    const r = register({
      name: common.name,
      email: common.email,
      password: common.password,
      role: activeRole,
      department,
      designation,
      jobRole,
    });

    setMessage({ ok: r.ok, text: r.message });
    if (r.ok) {
      setCommon({ name: "", email: "", password: "" });
    }
  };

  const roleMeta: Record<Role, {
    title: string;
    badge: string;
    subtitle: string;
    icon: any;
  }> = {
    trainee: {
      title: "Operational Trainee Registration",
      badge: "FORECASTER & OBSERVER CLEARANCE",
      subtitle: "Submit station posting and competency domain for structured level progression.",
      icon: GraduationCap,
    },
    trainer: {
      title: "Trainer Registration",
      badge: "INSTRUCTOR & SCIENTIST ACCREDITATION",
      subtitle: "Submit academic qualifications and syllabus domain for curriculum authoring privileges.",
      icon: Users,
    },
    admin: {
      title: "Administrator Clearance Request",
      badge: "GOVERNANCE & SYSTEM COMMAND",
      subtitle: "Submit official service credentials for directorate-level administrative authorization.",
      icon: ShieldCheck,
    },
  };

  const currentRole = roleMeta[activeRole];
  const Icon = currentRole.icon;

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Return to Portal Gateway
        </Link>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <span className="eyebrow light">CAPACITY CONNECT · IMD</span>
          <h1 style={{ fontSize: "24px", lineHeight: "1.3", margin: "12px 0 10px" }}>
            {currentRole.title}
          </h1>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#E2E8F0", margin: 0 }}>
            {currentRole.subtitle}
          </p>

          <div className="auth-points" style={{ marginTop: "24px" }}>
            <span><ShieldCheck size={16} /> Role-specific clearance validation</span>
            <span><ShieldCheck size={16} /> Automated competency profile initialization</span>
            <span><ShieldCheck size={16} /> Directorate oversight and audit compliance</span>
          </div>
        </div>
      </div>

      <div className="auth-card-wrap">
        <form className="auth-card wide" onSubmit={submit}>
          <div className="auth-card-top-row">
            <div className="auth-logo">
              <Icon size={22} />
            </div>
            <span className="role-top-badge">{currentRole.badge}</span>
          </div>

          <h2>Request Portal Clearance</h2>
          <p>Select your user type to view and complete role-specific verification inputs.</p>

          {/* 3-Way Role Selector */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", margin: "14px 0 20px" }}>
            {(["trainee", "trainer", "admin"] as Role[]).map((r) => {
              const isSel = activeRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: isSel ? "2px solid #0056D2" : "1.5px solid #CBD5E1",
                    background: isSel ? "#EFF6FF" : "#F8FAFC",
                    color: isSel ? "#0056D2" : "#334155",
                    fontSize: "12px",
                    fontWeight: isSel ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  {r === "trainee" ? "Operational Trainee" : r === "trainer" ? "Trainer" : "Administrator"}
                </button>
              );
            })}
          </div>

          {/* Universal Base Inputs */}
          <div className="form-grid two" style={{ marginBottom: "16px" }}>
            <label>
              Full Name
              <input
                value={common.name}
                onChange={(e) => setCommon({ ...common, name: e.target.value })}
                placeholder="Dr. / Sh. Full Name"
                required
              />
            </label>
            <label>
              Official IMD Email Address
              <input
                type="email"
                value={common.email}
                onChange={(e) => setCommon({ ...common, email: e.target.value })}
                placeholder="officer@imd.gov.in"
                required
              />
            </label>
            <label style={{ gridColumn: "span 2" }}>
              Account Password (Min. 6 characters)
              <input
                type="password"
                value={common.password}
                onChange={(e) => setCommon({ ...common, password: e.target.value })}
                placeholder="Choose a strong security password"
                minLength={6}
                required
              />
            </label>
          </div>

          {/* Distinct Role-Specific Section */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1.5px solid #CBD5E1",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#0056D2",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "block",
                marginBottom: "12px",
              }}
            >
              {activeRole === "trainee"
                ? "Trainee-Specific Operational Inputs"
                : activeRole === "trainer"
                ? "Trainer-Specific Accreditation Inputs"
                : "Administrator-Specific Governance Inputs"}
            </span>

            {/* 1. TRAINEE FIELDS */}
            {activeRole === "trainee" && (
              <div className="form-grid two">
                <label>
                  Target Job Role
                  <select
                    value={traineeFields.jobRole}
                    onChange={(e) => setTraineeFields({ ...traineeFields, jobRole: e.target.value })}
                    required
                  >
                    {availableJobRoles.map((jr) => (
                      <option key={jr} value={jr}>
                        {jr}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Station / Centre Posting
                  <select
                    value={traineeFields.centre}
                    onChange={(e) => setTraineeFields({ ...traineeFields, centre: e.target.value })}
                  >
                    <option value="MC Bhopal">Meteorological Centre Bhopal</option>
                    <option value="RMC New Delhi">Regional Met Centre New Delhi</option>
                    <option value="MC Chennai">Meteorological Centre Chennai</option>
                    <option value="MC Kolkata">Meteorological Centre Kolkata</option>
                    <option value="MC Mumbai">Regional Met Centre Mumbai</option>
                    <option value="DWR Bhuj">Doppler Weather Radar Station Bhuj</option>
                    <option value="IMD HQ New Delhi">IMD Headquarters Lodhi Road</option>
                  </select>
                </label>

                <label>
                  Cadre / Employee ID
                  <input
                    value={traineeFields.employeeId}
                    onChange={(e) => setTraineeFields({ ...traineeFields, employeeId: e.target.value })}
                    placeholder="e.g. IMD-MET-XXXX"
                    required
                  />
                </label>

                <label>
                  Current Operational Experience
                  <select
                    value={traineeFields.experienceYears}
                    onChange={(e) => setTraineeFields({ ...traineeFields, experienceYears: e.target.value })}
                  >
                    <option value="< 1 Year">Less than 1 Year (Induction / Probation)</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years (Max for Trainee Cadre)</option>
                  </select>
                </label>

                <label style={{ gridColumn: "span 2" }}>
                  Primary Specialization Interest
                  <select
                    value={traineeFields.specialization}
                    onChange={(e) => setTraineeFields({ ...traineeFields, specialization: e.target.value })}
                  >
                    <option value="Doppler Radar Operations">Doppler Radar Operations</option>
                    <option value="Radar Data Interpretation">Radar Data Interpretation</option>
                    <option value="Severe Weather Detection">Severe Weather Detection</option>
                    <option value="Warning Communication">Warning Communication</option>
                    <option value="Radar Quality Control & Maintenance">Radar Quality Control & Maintenance</option>
                  </select>
                </label>
              </div>
            )}

            {/* 2. TRAINER FIELDS */}
            {activeRole === "trainer" && (
              <div className="form-grid two">
                <label>
                  Faculty Rank / Designation
                  <select
                    value={trainerFields.facultyRank}
                    onChange={(e) => setTrainerFields({ ...trainerFields, facultyRank: e.target.value })}
                  >
                    <option value="Scientist-D">Scientist-D</option>
                    <option value="Scientist-E">Scientist-E (Senior Specialist)</option>
                    <option value="Senior Meteorologist">Senior Meteorologist / Forecaster</option>
                    <option value="Chief Radar Instructor">Chief Radar Meteorology Instructor</option>
                    <option value="Visiting Faculty Expert">Visiting Domain Expert</option>
                  </select>
                </label>

                <label>
                  Training Directorate / Institute
                  <select
                    value={trainerFields.institute}
                    onChange={(e) => setTrainerFields({ ...trainerFields, institute: e.target.value })}
                  >
                    <option value="Central Training Institute (CTI) Pune">Central Training Institute (CTI) Pune</option>
                    <option value="National Weather Forecasting Centre (NWFC) New Delhi">National Weather Forecasting Centre (NWFC) New Delhi</option>
                    <option value="Regional Radar Training Cell">Regional Radar Training Cell</option>
                    <option value="IMD Meteorological Training Facility">IMD Meteorological Training Facility</option>
                  </select>
                </label>

                <label>
                  Primary Domain of Expertise
                  <select
                    value={trainerFields.subjectExpertise}
                    onChange={(e) => setTrainerFields({ ...trainerFields, subjectExpertise: e.target.value })}
                  >
                    <option value="Doppler Radar Operations & Processing">Doppler Radar Operations & Processing</option>
                    <option value="Severe Storm Nowcasting & Meso-Analysis">Severe Storm Nowcasting & Meso-Analysis</option>
                    <option value="NWP & High-Resolution Numerical Modeling">NWP & High-Resolution Numerical Modeling</option>
                    <option value="Radar Quality Control & Dual-Pol Calibration">Radar Quality Control & Dual-Pol Calibration</option>
                    <option value="Impact-Based Weather Warning Protocols">Impact-Based Weather Warning Protocols</option>
                  </select>
                </label>

                <label>
                  Teaching & Operational Experience
                  <select
                    value={trainerFields.teachingExperience}
                    onChange={(e) => setTrainerFields({ ...trainerFields, teachingExperience: e.target.value })}
                  >
                    <option value="3-5 Years">3 - 5 Years Instruction</option>
                    <option value="5-10 Years">5 - 10 Years Instruction</option>
                    <option value="10-15 Years">10 - 15 Years Instruction</option>
                    <option value="15+ Years">15+ Years Senior Faculty</option>
                  </select>
                </label>

                <label style={{ gridColumn: "span 2" }}>
                  Highest Academic & Technical Qualification
                  <select
                    value={trainerFields.qualification}
                    onChange={(e) => setTrainerFields({ ...trainerFields, qualification: e.target.value })}
                  >
                    <option value="Ph.D Atmospheric Sciences / Meteorology">Ph.D Atmospheric Sciences / Meteorology</option>
                    <option value="M.Tech / M.Sc Meteorology">M.Tech / M.Sc Meteorology</option>
                    <option value="B.Tech Electronics & Radar Engineering">B.Tech Electronics & Radar Engineering</option>
                    <option value="WMO Class-I / Specialized Radar Fellowship">WMO Class-I / Specialized Radar Fellowship</option>
                  </select>
                </label>
              </div>
            )}

            {/* 3. ADMIN FIELDS */}
            {activeRole === "admin" && (
              <div className="form-grid two">
                <label>
                  Administrative Division
                  <select
                    value={adminFields.division}
                    onChange={(e) => setAdminFields({ ...adminFields, division: e.target.value })}
                  >
                    <option value="Capacity Building & Training Directorate">Capacity Building & Training Directorate</option>
                    <option value="HQ Meteorological Governance Division">HQ Meteorological Governance Division</option>
                    <option value="IT, Radar & Telecommunication Division">IT, Radar & Telecommunication Division</option>
                    <option value="National Operational Readiness Oversight Board">National Operational Readiness Oversight Board</option>
                  </select>
                </label>

                <label>
                  Clearance Authority Level
                  <select
                    value={adminFields.clearanceLevel}
                    onChange={(e) => setAdminFields({ ...adminFields, clearanceLevel: e.target.value })}
                  >
                    <option value="Level 1 - Directorate System Administrator">Level 1 - Directorate System Administrator</option>
                    <option value="Level 2 - Regional Training Administrator">Level 2 - Regional Training Administrator</option>
                    <option value="Level 3 - Divisional Clearance Officer">Level 3 - Divisional Clearance Officer</option>
                  </select>
                </label>

                <label style={{ gridColumn: "span 2" }}>
                  Government Official Clearance PIN / Service ID
                  <input
                    value={adminFields.serviceCode}
                    onChange={(e) => setAdminFields({ ...adminFields, serviceCode: e.target.value })}
                    placeholder="e.g. GOI-IMD-ADM-XXXX"
                    required
                  />
                </label>

                <label style={{ gridColumn: "span 2" }}>
                  Official Access Justification / Purpose
                  <textarea
                    rows={2}
                    value={adminFields.justification}
                    onChange={(e) => setAdminFields({ ...adminFields, justification: e.target.value })}
                    placeholder="State administrative oversight mandate..."
                    required
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1.5px solid #CBD5E1",
                      fontSize: "13px",
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {message && (
            <div
              className={`auth-alert ${message.ok ? "success" : "error"}`}
              style={{
                padding: "10px 14px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "13px",
                background: message.ok ? "#ECFDF5" : "#FEF2F2",
                border: `1px solid ${message.ok ? "#A7F3D0" : "#FCA5A5"}`,
                color: message.ok ? "#065F46" : "#991B1B",
              }}
            >
              {message.text}
            </div>
          )}

          <button className="btn btn-primary btn-block" type="submit">
            Submit Clearance Registration ({activeRole.charAt(0).toUpperCase() + activeRole.slice(1)})
          </button>

          <p className="auth-switch">
            Already have clearance? <Link to={`/?role=${activeRole}`}>Return to Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}