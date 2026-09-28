import { ArrowRight, CheckCircle2, Eye, EyeOff, GraduationCap, LockKeyhole, ShieldCheck, Sparkles, UserPlus, Users } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";

interface LoginPageProps {
  initialTab?: "login" | "register";
}

export default function LoginPage({ initialTab = "login" }: LoginPageProps) {
  const { login, register } = useApp();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"login" | "register">(initialTab);

  // Login state
  const [email, setEmail] = useState("admin@capacityconnect.in");
  const [password, setPassword] = useState("Demo@123");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "trainee" as "trainer" | "trainee",
    department: "Numerical Weather Prediction",
    designation: "Operational Forecaster",
  });
  const [regStatus, setRegStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  const departments = [
    "Numerical Weather Prediction (NWP)",
    "Doppler Weather Radar (DWR)",
    "Satellite Meteorology (INSAT-3DR)",
    "Cyclone Warning & Severe Weather",
    "Aviation & Marine Forecasting",
    "Climate Research & Services",
    "Agricultural Meteorology",
    "Hydrometeorological Observation",
  ];

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    window.setTimeout(() => {
      const result = login(email, password);
      setLoginLoading(false);
      if (!result.ok) {
        setLoginError(result.message);
        return;
      }
      navigate(`/${result.role}`);
    }, 300);
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegStatus(null);

    window.setTimeout(() => {
      const result = register(regForm);
      setRegLoading(false);
      setRegStatus({ ok: result.ok, text: result.message });
      if (result.ok) {
        setRegForm({
          name: "",
          email: "",
          password: "",
          role: "trainee",
          department: "Numerical Weather Prediction",
          designation: "Operational Forecaster",
        });
      }
    }, 400);
  };

  const fillProfile = (role: Role) => {
    setEmail(`${role}@capacityconnect.in`);
    setPassword("Demo@123");
    setLoginError("");
  };

  return (
    <div className="auth-portal-shell">
      {/* Top Ministry Banner */}
      <header className="auth-gov-header">
        <div className="auth-gov-brand">
          <div className="gov-emblem-badge">IMD</div>
          <div>
            <strong>NATIONAL METEOROLOGICAL ACADEMY</strong>
            <span>India Meteorological Department · Ministry of Earth Sciences, Govt. of India</span>
          </div>
        </div>
        <div className="auth-gov-meta">
          <span className="gov-status-pill">
            <span className="status-dot" /> Secure Authentication Gateway
          </span>
          <Link to="/explore" className="catalog-link">
            Explore Program Catalog <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Main Split Portal Area */}
      <div className="auth-portal-content">
        {/* Left Information & Institutional Dossier */}
        <section className="auth-dossier-panel">
          <div className="dossier-top">
            <span className="dossier-kicker">CONTINUOUS TECHNICAL EDUCATION</span>
            <h1>Advancing National Meteorological Capabilities</h1>
            <p>
              The official centralized training and qualification system for atmospheric
              scientists, forecasters, and technical personnel of the India Meteorological
              Department.
            </p>
          </div>

          <div className="dossier-highlights">
            <div className="dossier-highlight-item">
              <div className="highlight-icon">
                <GraduationCap size={20} />
              </div>
              <div>
                <strong>WMO-Aligned Technical Specializations</strong>
                <p>Curricula mapped to WMO-No. 1083 competency standards in NWP, DWR, and Satellite Analysis.</p>
              </div>
            </div>

            <div className="dossier-highlight-item">
              <div className="highlight-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong>Faculty-Evaluated Practical Deliverables</strong>
                <p>Direct evaluation of synoptic diagnoses and forecast briefings by accredited senior meteorologists.</p>
              </div>
            </div>

            <div className="dossier-highlight-item">
              <div className="highlight-icon">
                <Users size={20} />
              </div>
              <div>
                <strong>Digital Competency Transcript</strong>
                <p>Verifiable record of frontline operational proficiency and disaster-response simulation readiness.</p>
              </div>
            </div>
          </div>

          <div className="dossier-stats-strip">
            <div>
              <strong>850+</strong>
              <span>Officers Certified</span>
            </div>
            <div>
              <strong>24</strong>
              <span>Specializations</span>
            </div>
            <div>
              <strong>14</strong>
              <span>Accredited Faculty</span>
            </div>
          </div>

          <div className="dossier-footer-note">
            <CheckCircle2 size={16} />
            <span>Authorized access under Ministry of Earth Sciences digital security guidelines.</span>
          </div>
        </section>

        {/* Right Authentication & Clearance Card */}
        <section className="auth-form-card-container">
          <div className="auth-terminal-card">
            {/* Tab Switcher */}
            <div className="auth-tab-switch">
              <button
                type="button"
                className={`tab-btn ${tab === "login" ? "active" : ""}`}
                onClick={() => setTab("login")}
              >
                <LockKeyhole size={16} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${tab === "register" ? "active" : ""}`}
                onClick={() => setTab("register")}
              >
                <UserPlus size={16} />
                <span>Register Officer</span>
              </button>
            </div>

            {/* TAB 1: LOGIN */}
            {tab === "login" && (
              <form className="auth-form-body" onSubmit={handleLoginSubmit}>
                <div className="form-intro">
                  <h2>Portal Sign In</h2>
                  <p>Enter your departmental credentials to access your designated workspace.</p>
                </div>

                <div className="field-group">
                  <label>Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. officer@imd.gov.in"
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Account Password</label>
                  <div className="password-input-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="auth-meta-row">
                  <label className="checkbox-wrap">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember terminal</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Please contact the IMD IT Services Directorate at support@imd.gov.in for password reset.");
                    }}
                    className="forgot-link"
                  >
                    Forgot password?
                  </a>
                </div>

                {loginError && <div className="form-feedback error">{loginError}</div>}

                <button
                  type="submit"
                  className="btn btn-primary btn-block submit-btn"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Verifying Credentials..." : "Authenticate & Open Workspace"}
                </button>

                {/* Instant Role Access Pills for smooth pair-programming review */}
                <div className="profile-quick-switch">
                  <span className="quick-switch-title">Quick Select Profile:</span>
                  <div className="quick-switch-pills">
                    <button
                      type="button"
                      className="quick-pill"
                      onClick={() => fillProfile("admin")}
                    >
                      Director / Admin
                    </button>
                    <button
                      type="button"
                      className="quick-pill"
                      onClick={() => fillProfile("trainer")}
                    >
                      Faculty Lead
                    </button>
                    <button
                      type="button"
                      className="quick-pill"
                      onClick={() => fillProfile("trainee")}
                    >
                      Forecaster Trainee
                    </button>
                  </div>
                </div>

                <div className="auth-card-footnote">
                  <span>New to the academy? </span>
                  <button
                    type="button"
                    className="inline-tab-link"
                    onClick={() => setTab("register")}
                  >
                    Submit registration for departmental clearance
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {tab === "register" && (
              <form className="auth-form-body" onSubmit={handleRegisterSubmit}>
                <div className="form-intro">
                  <h2>Personnel Clearance Registration</h2>
                  <p>Submit your professional credentials for departmental account provisioning.</p>
                </div>

                <div className="field-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="e.g. Dr. Ramesh Chander"
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Official Email</label>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="officer@imd.gov.in"
                    required
                  />
                </div>

                <div className="form-grid-two">
                  <div className="field-group">
                    <label>Meteorological Division</label>
                    <select
                      value={regForm.department}
                      onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      value={regForm.designation}
                      onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })}
                      placeholder="e.g. Meteorologist-B"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-two">
                  <div className="field-group">
                    <label>Requested Clearance</label>
                    <select
                      value={regForm.role}
                      onChange={(e) =>
                        setRegForm({
                          ...regForm,
                          role: e.target.value as "trainer" | "trainee",
                        })
                      }
                    >
                      <option value="trainee">Operational Trainee / Forecaster</option>
                      <option value="trainer">Accredited Faculty / Trainer</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <label>Create Password</label>
                    <input
                      type="password"
                      minLength={6}
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>
                </div>

                {regStatus && (
                  <div className={`form-feedback ${regStatus.ok ? "success" : "error"}`}>
                    {regStatus.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-block submit-btn"
                  disabled={regLoading}
                >
                  {regLoading ? "Submitting Clearance Request..." : "Submit Registration for Approval"}
                </button>

                <div className="auth-card-footnote">
                  <span>Already hold clearance? </span>
                  <button
                    type="button"
                    className="inline-tab-link"
                    onClick={() => setTab("login")}
                  >
                    Return to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>

      {/* Footer Strip */}
      <footer className="auth-portal-footer">
        <p>© {new Date().getFullYear()} India Meteorological Department · Ministry of Earth Sciences, Government of India.</p>
        <div className="footer-mini-links">
          <Link to="/explore">Public Curricula</Link>
          <a href="#">Information Security Policy</a>
          <a href="#">WMO Competency Framework</a>
          <a href="#">Help Desk</a>
        </div>
      </footer>
    </div>
  );
}
