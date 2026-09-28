import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
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
    }, 350);
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to homepage
        </Link>
        <div>
          <span className="eyebrow light">IDENTITY & ACCESS MANAGEMENT</span>
          <h1>Authorized Portal Access for IMD Personnel</h1>
          <p>
            Sign in with your official departmental credentials to access your designated
            operational training workspace, specialized curricula, and capability records.
          </p>
          <div className="auth-points">
            <span>
              <ShieldCheck size={16} /> Centralized MoES & IMD authorization
            </span>
            <span>
              <ShieldCheck size={16} /> Role-governed workspace clearance
            </span>
            <span>
              <ShieldCheck size={16} /> Audit-logged secure session protocol
            </span>
          </div>
        </div>
      </div>
      <div className="auth-card-wrap">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-logo">
            <LockKeyhole size={24} />
          </div>
          <h2>Sign in</h2>
          <p>Access your CAPACITY CONNECT operational workspace.</p>

          <label>
            Official Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@capacityconnect.in or trainee@capacityconnect.in"
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
                placeholder="Enter account password"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label="Toggle password visibility"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div className="auth-remember-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember this device</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert("Please contact the IMD System Administrator or your Divisional Head for credential recovery.");
              }}
              className="text-link"
            >
              Forgot password?
            </a>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying clearance..." : "Sign In to Workspace"}
          </button>

          <p className="auth-switch">
            New personnel or researcher? <Link to="/register">Submit registration for clearance</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
