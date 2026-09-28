import { ArrowRight, CloudLightning, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles, UserCheck, UserPlus, Users } from "lucide-react";
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

  // Login form state
  const [email, setEmail] = useState("trainee@capacityconnect.in");
  const [password, setPassword] = useState("Demo@123");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "trainee" as "trainer" | "trainee",
    department: "Weather Forecasting",
    designation: "Operational Forecaster",
  });
  const [regStatus, setRegStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  const departments = [
    "Weather Forecasting",
    "Doppler Weather Radar (DWR)",
    "Satellite Meteorology",
    "Cyclone Warning & Severe Weather",
    "Aviation & Marine Services",
    "Numerical Weather Prediction (NWP)",
    "Agricultural Meteorology",
    "Climate Research & Services",
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
    }, 250);
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
          department: "Weather Forecasting",
          designation: "Operational Forecaster",
        });
      }
    }, 300);
  };

  // Instant 1-click test sign-in helper
  const quickSignIn = (role: Role) => {
    const testEmail = `${role}@capacityconnect.in`;
    const testPass = "Demo@123";
    setEmail(testEmail);
    setPassword(testPass);
    setLoginLoading(true);
    window.setTimeout(() => {
      const result = login(testEmail, testPass);
      setLoginLoading(false);
      if (result.ok) {
        navigate(`/${result.role}`);
      }
    }, 200);
  };

  return (
    <div className="modern-auth-screen">
      {/* Top clean header */}
      <header className="modern-auth-nav">
        <Link to="/explore" className="modern-auth-brand">
          <div className="brand-logo-pill">
            <CloudLightning size={20} />
          </div>
          <div>
            <strong>MeteoLearn</strong>
            <span>India Meteorological Department · MoES</span>
          </div>
        </Link>
        <Link to="/explore" className="btn btn-secondary btn-sm browse-btn">
          Browse Courses <ArrowRight size={14} />
        </Link>
      </header>

      {/* Main Container */}
      <main className="modern-auth-main">
        <div className="modern-auth-card">
          {/* Welcome Header */}
          <div className="auth-card-hero">
            <div className="badge-pill-soft">
              <Sparkles size={14} />
              <span>Training & Qualification Hub</span>
            </div>
            <h2>Welcome to MeteoLearn</h2>
            <p>Sign in to your account or register to start training.</p>
          </div>

          {/* Segmented Pill Tabs */}
          <div className="segmented-pill-tabs">
            <button
              type="button"
              className={`pill-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => {
                setTab("login");
                setLoginError("");
              }}
            >
              <LockKeyhole size={16} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`pill-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => {
                setTab("register");
                setRegStatus(null);
              }}
            >
              <UserPlus size={16} />
              <span>Create Account</span>
            </button>
          </div>

          {/* TAB 1: LOGIN */}
          {tab === "login" && (
            <form className="modern-form-body" onSubmit={handleLoginSubmit}>
              <div className="input-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@imd.gov.in"
                  required
                />
              </div>

              <div className="input-field">
                <div className="label-with-link">
                  <label>Password</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Please contact the IMD IT Administrator to recover your credentials.");
                    }}
                    className="subtle-link"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password view"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="checkbox-row">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {loginError && <div className="feedback-badge error">{loginError}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block auth-submit-btn"
                disabled={loginLoading}
              >
                {loginLoading ? "Signing in..." : "Sign In to Portal"}
              </button>

              {/* 1-Click Fast Profile Switcher */}
              <div className="fast-access-box">
                <span className="fast-access-title">Quick Test Sign In (1-Click):</span>
                <div className="fast-access-pills">
                  <button
                    type="button"
                    className="fast-pill"
                    onClick={() => quickSignIn("trainee")}
                  >
                    <UserCheck size={14} /> Trainee (Officer)
                  </button>
                  <button
                    type="button"
                    className="fast-pill"
                    onClick={() => quickSignIn("trainer")}
                  >
                    <Users size={14} /> Trainer (Faculty)
                  </button>
                  <button
                    type="button"
                    className="fast-pill"
                    onClick={() => quickSignIn("admin")}
                  >
                    <ShieldCheck size={14} /> Admin
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === "register" && (
            <form className="modern-form-body" onSubmit={handleRegisterSubmit}>
              <div className="input-field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>

              <div className="input-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="e.g. ramesh@imd.gov.in"
                  required
                />
              </div>

              <div className="input-grid-2">
                <div className="input-field">
                  <label>Department</label>
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

                <div className="input-field">
                  <label>Designation</label>
                  <input
                    type="text"
                    value={regForm.designation}
                    onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })}
                    placeholder="e.g. Forecaster"
                    required
                  />
                </div>
              </div>

              <div className="input-grid-2">
                <div className="input-field">
                  <label>Account Role</label>
                  <select
                    value={regForm.role}
                    onChange={(e) =>
                      setRegForm({
                        ...regForm,
                        role: e.target.value as "trainer" | "trainee",
                      })
                    }
                  >
                    <option value="trainee">Trainee (Learner)</option>
                    <option value="trainer">Trainer (Faculty)</option>
                  </select>
                </div>

                <div className="input-field">
                  <label>Password</label>
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
                <div className={`feedback-badge ${regStatus.ok ? "success" : "error"}`}>
                  {regStatus.text}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block auth-submit-btn"
                disabled={regLoading}
              >
                {regLoading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="switch-card-footer">
                <span>Already have an account? </span>
                <button
                  type="button"
                  className="text-action-link"
                  onClick={() => setTab("login")}
                >
                  Sign In instead
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="modern-auth-footer">
        <span>© {new Date().getFullYear()} India Meteorological Department · Ministry of Earth Sciences</span>
        <div className="auth-footer-links">
          <Link to="/explore">Course Catalog</Link>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}
