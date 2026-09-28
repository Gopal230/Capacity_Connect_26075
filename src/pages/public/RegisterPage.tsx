import { ArrowLeft, ShieldCheck, UserPlus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function RegisterPage() {
  const { register, roleRequirements } = useApp();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");

  const initialRole: "trainer" | "trainee" = roleParam === "trainer" ? "trainer" : "trainee";

  // Dynamic job roles list derived from role requirements map
  const availableJobRoles = Object.keys(roleRequirements).length > 0
    ? Object.keys(roleRequirements)
    : ["Radar Operator"];

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
    jobRole: availableJobRoles[0] || "Radar Operator",
    department: "",
    designation: "",
  });

  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (roleParam === "trainer" || roleParam === "trainee") {
      setForm((prev) => ({ ...prev, role: roleParam }));
    }
  }, [roleParam]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      department: form.department,
      designation: form.designation,
      jobRole: form.role === "trainee" ? form.jobRole : undefined,
    });
    setMessage({ ok: r.ok, text: r.message });
    if (r.ok) {
      setForm({
        name: "",
        email: "",
        password: "",
        role: initialRole,
        jobRole: availableJobRoles[0] || "Radar Operator",
        department: "",
        designation: "",
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to role selection
        </Link>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <span className="eyebrow light">CAPACITY CONNECT · IMD</span>
          <h1 style={{ fontSize: "24px", lineHeight: "1.3", margin: "12px 0 10px" }}>
            Official Account Registration
          </h1>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#E2E8F0", margin: 0 }}>
            Operational personnel and accredited faculty can request portal clearance. Accounts undergo verification before operational privileges are activated.
          </p>

          <div className="auth-points" style={{ marginTop: "24px" }}>
            <span><ShieldCheck size={16} /> IMD institutional verification</span>
            <span><ShieldCheck size={16} /> Role-governed curriculum access</span>
            <span><ShieldCheck size={16} /> Direct integration with capability tracking</span>
          </div>
        </div>
      </div>

      <div className="auth-card-wrap">
        <form className="auth-card wide" onSubmit={submit}>
          <div className="auth-card-top-row">
            <div className="auth-logo">
              <UserPlus size={22} />
            </div>
            <span className="role-top-badge">
              {form.role === "trainer" ? "FACULTY REGISTRATION" : "TRAINEE REGISTRATION"}
            </span>
          </div>

          <h2>Create Registration</h2>
          <p>Submit your institutional credentials for administrative clearance.</p>

          <div className="form-grid two">
            <label>
              Full Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. / Sh. Full Name"
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
              Portal User Type
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as "trainer" | "trainee" })}
              >
                <option value="trainee">Operational Trainee / Forecaster</option>
                <option value="trainer">Accredited Faculty / Trainer</option>
              </select>
            </label>

            {/* Job Role dropdown for Trainees only */}
            {form.role === "trainee" && (
              <label>
                Target Job Role
                <select
                  value={form.jobRole}
                  onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
                  required
                >
                  {availableJobRoles.map((jr) => (
                    <option key={jr} value={jr}>
                      {jr}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              Password
              <input
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                required
              />
            </label>
            <label>
              Department / Center
              <input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                required
                placeholder="e.g. Radar Division / Bhopal DWR"
              />
            </label>
            <label>
              Designation
              <input
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                required
                placeholder="e.g. Scientific Assistant / Radar Operator"
              />
            </label>
          </div>

          {message && (
            <div className={message.ok ? "form-success" : "form-error"} style={{ marginTop: "16px" }}>
              {message.text}
            </div>
          )}

          <button className="btn btn-primary btn-block" style={{ marginTop: "20px" }}>
            Submit for Clearance
          </button>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p className="auth-switch" style={{ margin: 0 }}>
              Already approved? <Link to={`/login?role=${form.role}`}>Sign in as {form.role === "trainer" ? "Trainer" : "Trainee"}</Link>
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
              Want to test the platform immediately?{" "}
              <Link to={`/login?role=${form.role}`} style={{ color: "#16A34A", fontWeight: 600 }}>
                ⚡ Use 1-Click Demo Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}