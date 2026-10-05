import { ArrowRight, CheckCircle2, Eye, EyeOff, GraduationCap, LockKeyhole, Menu, ShieldCheck, Sparkles, UserCheck, UserPlus, Users, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";

export default function HomePage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read role from query param or default to trainee
  const roleParam = searchParams.get("role") as Role | null;
  const initialRole: Role = roleParam === "admin" || roleParam === "trainer" ? roleParam : "trainee";

  const [activeRole, setActiveRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState(`${initialRole}@test.com`);
  const [password, setPassword] = useState("123456");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (roleParam && (roleParam === "admin" || roleParam === "trainer" || roleParam === "trainee")) {
      setActiveRole(roleParam);
      setEmail(`${roleParam}@test.com`);
      setPassword("123456");
      setError("");
    }
  }, [roleParam]);

  const switchRole = (role: Role) => {
    setActiveRole(role);
    setSearchParams({ role });
    setEmail(`${role}@test.com`);
    setPassword("123456");
    setError("");
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      const r = login(email, password);
      setLoading(false);
      if (!r.ok) return setError(r.message);
      navigate(`/${r.role}`);
    }, 200);
  };

  const quickDemoLogin = (targetEmail: string, targetPass: string = "123456") => {
    setLoading(true);
    setError("");
    setEmail(targetEmail);
    setPassword(targetPass);
    window.setTimeout(() => {
      const r = login(targetEmail, targetPass);
      setLoading(false);
      if (!r.ok) return setError(r.message);
      navigate(`/${r.role}`);
    }, 150);
  };

  const roleMeta: Record<Role, {
    title: string;
    category: string;
    subtitle: string;
    icon: any;
    demoEmail: string;
    demoName: string;
    features: string[];
    extraDemoAccounts?: { label: string; email: string; desc: string }[];
  }> = {
    trainee: {
      title: "Operational Trainee Workspace",
      category: "OPERATIONAL PERSONNEL & FORECASTERS",
      subtitle: "Meteorological Officers, Observers, Scientific Assistants, and Radar Operators.",
      icon: GraduationCap,
      demoEmail: "trainee@test.com",
      demoName: "Rahul Verma (L1 Baseline)",
      features: [
        "Level-based competency diagnostics and gap-targeted progression (L1 to L5)",
        "Standardized Doppler Radar, Synoptic, and Warning Communication courses",
        "Interactive lesson completion tracking and locked prerequisite enforcement",
        "Post-training assessments with automated level advancement and official certificates",
        "Digital Capability Passport and verified competency transcript",
      ],
      extraDemoAccounts: [
        { label: "Priya Sharma (Mid-Level L2)", email: "trainee2@test.com", desc: "L2 in Basic Met & Radar Ops" },
        { label: "Amit Patel (Nearly Ready L3)", email: "trainee3@test.com", desc: "L3 in 3 core competencies" },
      ],
    },
    trainer: {
      title: "Trainer Workspace",
      category: "FACULTY & DOMAIN INSTRUCTORS",
      subtitle: "Senior Meteorologists, Radar Specialists, and Regional Training Centre Faculty.",
      icon: Users,
      demoEmail: "trainer@test.com",
      demoName: "Dr. Arvind Rao (Chief Radar Instructor)",
      features: [
        "Curriculum authoring studio with competency level mapping",
        "Doppler radar archives, satellite loops, and operational case repository",
        "Practical evidence evaluation and operational sign-offs",
        "Cohort competency monitoring and longitudinal trainee progression tracking",
        "National trainer registry and domain accreditation management",
      ],
    },
    admin: {
      title: "Governance & Command Console",
      category: "DIRECTORATE & SYSTEM GOVERNANCE",
      subtitle: "IMD Directorate, Training Division Heads, and Capability Governance Officers.",
      icon: ShieldCheck,
      demoEmail: "admin@test.com",
      demoName: "Directorate Administrator",
      features: [
        "User clearance approvals and role-governed credential authorization",
        "National Operational Readiness Index (ORI) diagnostics and radar station analytics",
        "Faculty accreditation compliance and syllabus quality control",
        "Security audit logging, data governance, and role requirement configuration",
        "System-wide schema versioning and official certification verification",
      ],
    },
  };

  const current = roleMeta[activeRole];
  const Icon = current.icon;

  return (
    <div className="public-site">
      {/* Top Navbar */}
      <header className="public-nav">
        <Link to="/" className="public-brand">
          <span className="public-brand-mark">CC</span>
          <div>
            <strong>CAPACITY CONNECT</strong>
            <small style={{ display: "block", fontSize: "10px", lineHeight: "1.3", marginTop: "2px" }}>India Meteorological Department<br/>Ministry of Earth Sciences</small>
          </div>
        </Link>

        <button
          className="public-menu"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle navigation"
        >
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={menu ? "show" : ""}>
          <Link to="/courses" onClick={() => setMenu(false)} style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "4px" }}>Course Catalog</Link>
        </nav>
      </header>

      {/* Main Gateway */}
      <main className="portal-gateway" style={{ maxWidth: "1280px", margin: "0 auto", padding: "36px 24px 60px" }}>
        {/* Gateway Hero */}
        <section className="gateway-hero" style={{ textAlign: "center", marginBottom: "36px" }}>
          <div className="gateway-kicker" style={{ letterSpacing: "1px", fontWeight: 700, color: "var(--brand-primary)", fontSize: "12px" }}>
            MINISTRY OF EARTH SCIENCES · GOVERNMENT OF INDIA
          </div>
          <h1 className="gateway-title" style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-heading)", margin: "12px 0 14px", lineHeight: "1.25" }}>
            Meteorological Capacity Building & Operational Readiness Portal
          </h1>
          <p className="gateway-desc" style={{ maxWidth: "780px", margin: "0 auto", fontSize: "15px", color: "var(--text-body)", lineHeight: "1.6" }}>
            The unified continuous learning, competency progression, and capability verification system for operational forecasters, faculty, and leadership across all IMD centres.
          </p>
        </section>

        {/* Grand Role Selection Bar */}
        <section style={{ marginBottom: "28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
            {(["trainee", "trainer", "admin"] as Role[]).map((r) => {
              const rInfo = roleMeta[r];
              const RIcon = rInfo.icon;
              const isSelected = activeRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  style={{
                    background: "var(--brand-dark)",
                    border: isSelected ? "2.5px solid var(--brand-primary)" : "1.5px solid rgba(253, 240, 213, 0.18)",
                    borderRadius: "12px",
                    padding: "18px 20px",
                    textAlign: "left",
                    cursor: "pointer",
                    boxShadow: isSelected ? "0 4px 16px rgba(153, 27, 27, 0.35)" : "0 2px 6px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: isSelected ? "var(--brand-primary)" : "var(--brand-accent)",
                      color: "#FFFFFF",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <RIcon size={22} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: "10.5px", fontWeight: 700, color: isSelected ? "var(--brand-accent)" : "#CBD5E1", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      {r === "trainee" ? "LEARN" : r === "trainer" ? "TEACH" : "GOVERN"}
                    </span>
                    <h3 style={{ margin: "2px 0 4px", fontSize: "16px", color: isSelected ? "#F8FAFC" : "#CBD5E1" }}>
                      {r === "trainee" ? "Operational Trainee" : r === "trainer" ? "Trainer" : "Portal Administrator"}
                    </h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#CBD5E1", lineHeight: "1.4" }}>
                      {r === "trainee" ? "Competency progression & certification" : r === "trainer" ? "Curriculum authoring & operational evaluation" : "Clearance, ORI & system command"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Grand Unified Workspace & Sign-In Card */}
        <section
          style={{
            background: "var(--brand-dark)",
            border: "1.5px solid rgba(253, 240, 213, 0.18)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          }}
        >
          {/* Left Column: Role Details & Instant 1-Click Access */}
          <div
            style={{
              padding: "36px 32px",
              background: "var(--brand-dark)",
              borderRight: "1px solid rgba(253, 240, 213, 0.18)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "var(--brand-primary)",
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand-accent)", letterSpacing: "0.5px" }}>
                    {current.category}
                  </span>
                  <h2 style={{ margin: 0, fontSize: "20px", color: "#F8FAFC" }}>
                    {current.title}
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: "13.5px", color: "#CBD5E1", margin: "0 0 20px", lineHeight: "1.5" }}>
                {current.subtitle}
              </p>

              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#F8FAFC", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "10px" }}>
                  Active Workspace Capabilities
                </span>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {current.features.map((feat, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#CBD5E1" }}>
                      <CheckCircle2 size={16} color="var(--brand-accent)" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instant Demo Accounts Box */}
            <div
              style={{
                background: "var(--brand-dark)",
                border: "1.5px solid rgba(193, 18, 31, 0.35)",
                borderRadius: "10px",
                padding: "16px",
                marginTop: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={16} color="var(--brand-accent)" />
                  <strong style={{ fontSize: "13px", color: "var(--brand-accent)" }}>Instant 1-Click Demo Evaluation</strong>
                </div>
                <span style={{ fontSize: "11px", color: "var(--brand-accent)", background: "rgba(193, 18, 31, 0.14)", border: "1px solid rgba(193, 18, 31, 0.35)", padding: "2px 8px", borderRadius: "4px" }}>
                  Pre-seeded
                </span>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => quickDemoLogin(current.demoEmail)}
                disabled={loading}
                style={{ padding: "10px 16px", fontSize: "13.5px", fontWeight: 600, background: "var(--brand-primary)", borderColor: "var(--brand-primary)" }}
              >
                <Sparkles size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                Launch Demo: {current.demoName}
              </button>

              {current.extraDemoAccounts && (
                <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(253, 240, 213, 0.18)" }}>
                  <small style={{ fontSize: "11px", color: "#CBD5E1", display: "block", marginBottom: "6px" }}>
                    Alternate Trainee Profiles:
                  </small>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {current.extraDemoAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => quickDemoLogin(acc.email)}
                        style={{
                          fontSize: "11.5px",
                          padding: "5px 10px",
                          background: "var(--brand-dark)",
                          border: "1px solid rgba(253, 240, 213, 0.18)",
                          borderRadius: "6px",
                          color: "var(--brand-soft)",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                        title={acc.desc}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Direct Sign-In Form */}
          <div style={{ padding: "36px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "var(--brand-dark)" }}>
            <div>
              <div style={{ borderBottom: "1px solid rgba(253, 240, 213, 0.18)", paddingBottom: "14px", marginBottom: "22px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#CBD5E1", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  AUTHENTICATED ACCESS
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: "20px", color: "#F8FAFC" }}>
                  Sign In to Your Account
                </h3>
                <small style={{ color: "#CBD5E1", fontSize: "12.5px" }}>
                  Enter your credentials for official clearance access.
                </small>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#CBD5E1", marginBottom: "6px" }}>
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. officer@imd.gov.in"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1.5px solid rgba(253, 240, 213, 0.18)",
                      background: "var(--brand-dark)",
                      fontSize: "13.5px",
                      outline: "none",
                      color: "#F8FAFC",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#CBD5E1", marginBottom: "6px" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 40px 10px 12px",
                        borderRadius: "6px",
                        border: "1.5px solid rgba(253, 240, 213, 0.18)",
                        background: "var(--brand-dark)",
                        fontSize: "13.5px",
                        outline: "none",
                        color: "#F8FAFC",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#CBD5E1",
                        cursor: "pointer",
                      }}
                      aria-label="Toggle password visibility"
                    >
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    style={{
                      background: "rgba(193, 18, 31, 0.14)",
                      border: "1px solid rgba(193, 18, 31, 0.35)",
                      color: "var(--brand-accent)",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                  style={{ padding: "11px 16px", fontSize: "14px", fontWeight: 600, marginTop: "6px", background: "var(--brand-primary)", borderColor: "var(--brand-primary)" }}
                >
                  {loading ? "Authenticating..." : `Sign In as ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
                </button>
              </form>
            </div>

            <div style={{ marginTop: "28px", paddingTop: "18px", borderTop: "1px solid rgba(253, 240, 213, 0.18)", textAlign: "center" }}>
              <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#CBD5E1" }}>
                Need portal clearance?
              </p>
              <Link
                to={`/register?role=${activeRole}`}
                className="btn btn-secondary btn-block"
                style={{ fontSize: "13px", padding: "9px 14px", display: "inline-block", textAlign: "center", background: "var(--brand-dark)", color: "var(--brand-soft)", borderColor: "var(--brand-accent)" }}
              >
                Register for {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Clearance →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="public-footer">
        <div>
          <strong>CAPACITY CONNECT</strong>
          <p>Digital Capacity Building & Operational Readiness Portal</p>
          <small>© {new Date().getFullYear()} India Meteorological Department · Ministry of Earth Sciences</small>
        </div>
        <div className="footer-links">
          <Link to="/courses">Course Catalog</Link>
          <Link to="/?role=trainee">Trainee Workspace</Link>
          <Link to="/?role=trainer">Faculty Portal</Link>
          <Link to="/?role=admin">Admin Command</Link>
          <Link to="/register">Account Clearance</Link>
        </div>
      </footer>
    </div>
  );
}