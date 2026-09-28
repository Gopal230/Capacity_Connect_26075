import { ArrowLeft, CheckCircle2, Eye, EyeOff, GraduationCap, LockKeyhole, ShieldCheck, Sparkles, UserCheck, UserPlus, Users } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read role from query param or default to trainee
  const roleParam = searchParams.get("role") as Role | null;
  const initialRole: Role = roleParam === "admin" || roleParam === "trainer" ? roleParam : "trainee";

  const [activeRole, setActiveRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState(`${initialRole}@capacityconnect.in`);
  const [password, setPassword] = useState("Demo@123");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roleParam && (roleParam === "admin" || roleParam === "trainer" || roleParam === "trainee")) {
      setActiveRole(roleParam);
      setEmail(`${roleParam}@capacityconnect.in`);
      setPassword("Demo@123");
      setError("");
    }
  }, [roleParam]);

  const switchRole = (role: Role) => {
    setActiveRole(role);
    setSearchParams({ role });
    setEmail(`${role}@capacityconnect.in`);
    setPassword("Demo@123");
    setError("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      const r = login(email, password);
      setLoading(false);
      if (!r.ok) return setError(r.message);
      navigate(`/${r.role}`);
    }, 250);
  };

  // Instant 1-click Demo Account Login
  const handleDemoLogin = () => {
    const demoEmail = `${activeRole}@capacityconnect.in`;
    const demoPass = "Demo@123";
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError("");

    window.setTimeout(() => {
      const r = login(demoEmail, demoPass);
      setLoading(false);
      if (!r.ok) return setError(r.message);
      navigate(`/${r.role}`);
    }, 200);
  };

  const roleInfo: Record<Role, { title: string; subtitle: string; icon: any; badge: string }> = {
    trainee: {
      title: "Operational Trainee Sign In",
      subtitle: "Access your training coursework, competency diagnostics, and capability passport.",
      icon: GraduationCap,
      badge: "TRAINEE / FORECASTER ACCESS",
    },
    trainer: {
      title: "Accredited Faculty Sign In",
      subtitle: "Author curricula, manage training resources, and evaluate practical evidence.",
      icon: Users,
      badge: "FACULTY & TRAINER WORKSPACE",
    },
    admin: {
      title: "Administrator Sign In",
      subtitle: "Manage user clearance, accredit trainers, and monitor organization-wide readiness.",
      icon: ShieldCheck,
      badge: "GOVERNANCE & ADMIN COMMAND",
    },
  };

  const currentInfo = roleInfo[activeRole];
  const Icon = currentInfo.icon;

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Choose a different role
        </Link>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <span className="eyebrow light">CAPACITY CONNECT · IMD</span>
          <h1 style={{ fontSize: "24px", lineHeight: "1.3", margin: "12px 0 10px" }}>
            {currentInfo.title}
          </h1>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#E2E8F0", margin: 0 }}>
            {currentInfo.subtitle}
          </p>

          <div className="auth-points" style={{ marginTop: "24px" }}>
            <span><ShieldCheck size={16} /> Official IMD authentication</span>
            <span><ShieldCheck size={16} /> Role-governed workspace security</span>
            <span><ShieldCheck size={16} /> Session audit-logging active</span>
          </div>
        </div>
      </div>

      <div className="auth-card-wrap">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card-top-row">
            <div className="auth-logo">
              <Icon size={22} />
            </div>
            <span className="role-top-badge">{currentInfo.badge}</span>
          </div>

          <h2>Sign In</h2>
          <p>Sign in with your credentials or use the instant demo button.</p>

          {/* High-Visibility Demo Account Button */}
          <div className="demo-primary-container">
            <button
              type="button"
              className="btn btn-demo-large btn-block"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <Sparkles size={16} />
              <span>Use Demo {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Account</span>
            </button>
            <small className="demo-account-hint">
              1-click instant login ({activeRole}@capacityconnect.in)
            </small>
          </div>

          <div className="form-divider">
            <span>OR SIGN IN WITH EMAIL</span>
          </div>

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. officer@imd.gov.in"
              required
            />
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label="Toggle password view"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && <div className="form-error">{error}</div>}

          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={loading}
          >
            {loading ? "Authenticating..." : `Sign in as ${activeRole}`}
          </button>

          {/* Quick role switcher */}
          <div className="role-switch-pill-container">
            <span>Switch role view:</span>
            <div className="role-switch-pills">
              <button
                type="button"
                className={`switch-pill ${activeRole === "trainee" ? "active" : ""}`}
                onClick={() => switchRole("trainee")}
              >
                Trainee
              </button>
              <button
                type="button"
                className={`switch-pill ${activeRole === "trainer" ? "active" : ""}`}
                onClick={() => switchRole("trainer")}
              >
                Trainer
              </button>
              <button
                type="button"
                className={`switch-pill ${activeRole === "admin" ? "active" : ""}`}
                onClick={() => switchRole("admin")}
              >
                Admin
              </button>
            </div>
          </div>

          <p className="auth-switch">
            New user?{" "}
            <Link to={`/register?role=${activeRole}`}>
              Register for {activeRole} account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
