import { ArrowLeft, CheckCircle2, ShieldCheck, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function RegisterPage() {
  const { register } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "trainee" as "trainer" | "trainee",
    department: "",
    designation: "",
  });
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = register(form);
    setMessage({ ok: r.ok, text: r.message });
    if (r.ok) {
      setForm({
        name: "",
        email: "",
        password: "",
        role: "trainee",
        department: "",
        designation: "",
      });
    }
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
            Register for Portal Clearance
          </h1>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#E2E8F0", margin: 0 }}>
            Submit your departmental details for account review and role-governed access.
          </p>
          <div className="auth-points" style={{ marginTop: "20px" }}>
            <span><ShieldCheck size={16} /> Role clearance verification</span>
            <span><ShieldCheck size={16} /> Departmental access approval</span>
            <span><ShieldCheck size={16} /> Secure credentials setup</span>
          </div>
        </div>
      </div>

      <div className="auth-card-wrap">
        <form className="auth-card wide" onSubmit={submit}>
          <div className="auth-logo">
            <UserPlus size={22} />
          </div>
          <h2>Create Account</h2>
          <p>Submit your professional credentials for review.</p>

          <div className="form-grid two">
            <label>
              Full name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                required
              />
            </label>
            <label>
              Official Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="officer@imd.gov.in"
                required
              />
            </label>
            <label>
              Account Role
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as any })}
              >
                <option value="trainee">Trainee (Learner)</option>
                <option value="trainer">Trainer (Faculty)</option>
              </select>
            </label>
            <label>
              Password
              <input
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
                required
              />
            </label>
            <label>
              Department
              <input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                required
                placeholder="e.g. Weather Forecasting"
              />
            </label>
            <label>
              Designation
              <input
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                required
                placeholder="e.g. Scientific Assistant"
              />
            </label>
          </div>

          {message && (
            <div className={message.ok ? "form-success" : "form-error"}>
              {message.text}
            </div>
          )}

          <button className="btn btn-primary btn-block" type="submit">
            Submit Registration
          </button>

          <p className="auth-switch">
            Already approved? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}