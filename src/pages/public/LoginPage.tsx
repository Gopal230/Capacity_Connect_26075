import { ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck, UserCheck, Users } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("trainee@capacityconnect.in");
  const [password, setPassword] = useState("Demo@123");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const selectTestProfile = (role: "admin" | "trainer" | "trainee") => {
    setEmail(`${role}@capacityconnect.in`);
    setPassword("Demo@123");
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to homepage
        </Link>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <span className="eyebrow light">CAPACITY CONNECT · IMD</span>
          <h1 style={{ fontSize: "24px", lineHeight: "1.3", margin: "12px 0 10px" }}>
            Authorized Portal Access
          </h1>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#E2E8F0", margin: 0 }}>
            Official continuous training and operational qualification platform for India Meteorological Department personnel.
          </p>
          <div className="auth-points" style={{ marginTop: "20px" }}>
            <span><ShieldCheck size={16} /> Centralized IMD authorization</span>
            <span><ShieldCheck size={16} /> Role-governed workspace access</span>
            <span><ShieldCheck size={16} /> Audit-logged session protocol</span>
          </div>
        </div>
      </div>

      <div className="auth-card-wrap">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-logo">
            <LockKeyhole size={22} />
          </div>
          <h2>Sign In</h2>
          <p>Access your CAPACITY CONNECT workspace.</p>

          <label>
            Official Email Address
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
            {loading ? "Authenticating..." : "Sign In to Workspace"}
          </button>

          {/* Clean Test Account Selector */}
          <div className="fast-access-box">
            <span className="fast-access-title">Test Profile Quick Fill:</span>
            <div className="fast-access-pills">
              <button
                type="button"
                className="fast-pill"
                onClick={() => selectTestProfile("trainee")}
              >
                <UserCheck size={13} /> Trainee
              </button>
              <button
                type="button"
                className="fast-pill"
                onClick={() => selectTestProfile("trainer")}
              >
                <Users size={13} /> Trainer
              </button>
              <button
                type="button"
                className="fast-pill"
                onClick={() => selectTestProfile("admin")}
              >
                <ShieldCheck size={13} /> Admin
              </button>
            </div>
          </div>

          <p className="auth-switch">
            New user? <Link to="/register">Register for approval</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
