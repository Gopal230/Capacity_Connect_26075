import { Award, CheckCircle2, FileCheck2, Gauge, QrCode, ShieldCheck } from "lucide-react";
import { Badge, PageHeader, ProgressBar, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { operationalReadiness } from "../../utils/engine";

export default function CapabilityPassport() {
  const { db, currentUser } = useApp();
  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  if (!trainee) return null;

  const ready = operationalReadiness(db, trainee.id);
  const certs = db.certificates.filter((c) => c.traineeId === trainee.id);
  const evidence = db.evidence.filter((e) => e.traineeId === trainee.id);
  const results = db.competencyResults.filter((r) => r.traineeId === trainee.id);
  const scenarios = db.scenarioAttempts.filter((a) => a.traineeId === trainee.id);

  return (
    <>
      <PageHeader
        title="Official Capability Passport"
        subtitle="Verifiable institutional record of meteorological competencies, faculty-approved deliverables, and accredited credentials."
        actions={
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Export Official Transcript (PDF)
          </button>
        }
      />

      <section className="passport-hero">
        <div className="passport-id">
          <div className="passport-avatar">
            {trainee.name
              .split(" ")
              .map((x) => x[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <span className="eyebrow">MOES / IMD · ACCREDITED RECORD</span>
            <h2>{trainee.name}</h2>
            <p>
              {trainee.designation} · {trainee.department}
            </p>
            <Badge tone="green">
              <ShieldCheck size={13} /> Official Certified Record
            </Badge>
          </div>
        </div>
        <div className="passport-readiness">
          <div className="readiness-circle">
            <strong>{ready.score}</strong>
            <span>ORI / 100</span>
          </div>
          <div>
            <b>{ready.band}</b>
            <span>Operational Readiness Index</span>
          </div>
        </div>
        <div className="passport-qr">
          <QrCode />
          <span>Official Credential ID</span>
          <strong>CC-PASS-{trainee.id.toUpperCase()}</strong>
        </div>
      </section>

      <div className="stats-grid compact">
        <StatCard
          label="Verified Competencies"
          value={results.filter((r) => r.gapText === "Required level met").length}
          icon={<CheckCircle2 />}
        />
        <StatCard
          label="Verified Deliverables"
          value={evidence.filter((e) => e.status === "verified").length}
          icon={<FileCheck2 />}
        />
        <StatCard
          label="Scenario Simulations"
          value={scenarios.length}
          icon={<Gauge />}
        />
        <StatCard
          label="Accredited Certificates"
          value={certs.length}
          icon={<Award />}
        />
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Operational Readiness Synthesis</h3>
            <p>Components comprising your active Operational Readiness Index.</p>
          </div>
        </div>
        <div className="readiness-breakdown">
          <div>
            <span>Competency Diagnostic Baseline</span>
            <b>{ready.competency}/30</b>
            <ProgressBar value={(ready.competency / 30) * 100} />
          </div>
          <div>
            <span>Coursework Completion</span>
            <b>{ready.learning}/15</b>
            <ProgressBar value={(ready.learning / 15) * 100} />
          </div>
          <div>
            <span>Summative Examinations</span>
            <b>{ready.assessment}/25</b>
            <ProgressBar value={(ready.assessment / 25) * 100} />
          </div>
          <div>
            <span>Faculty-Verified Deliverables</span>
            <b>{ready.evidence}/15</b>
            <ProgressBar value={(ready.evidence / 15) * 100} />
          </div>
          <div>
            <span>Emergency Decision Scenarios</span>
            <b>{ready.scenario}/15</b>
            <ProgressBar value={(ready.scenario / 15) * 100} />
          </div>
        </div>
      </section>

      <div className="dashboard-grid two">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Role Competency Ledger</h3>
              <p>Current operational qualifications by subject</p>
            </div>
          </div>
          <div className="passport-list">
            {results.map((r) => (
              <article key={r.id}>
                <div>
                  <strong>{r.subject}</strong>
                  <span>{r.role}</span>
                </div>
                <div>
                  <Badge tone={r.gapText === "Required level met" ? "green" : "amber"}>
                    {r.currentLevel}
                  </Badge>
                  <small>
                    {r.score}% · Target: {r.requiredLevel}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Operational Deliverables Ledger</h3>
              <p>Faculty-evaluated synoptic and forecasting evidence</p>
            </div>
          </div>
          <div className="passport-list">
            {evidence.map((e) => (
              <article key={e.id}>
                <div>
                  <strong>{e.title}</strong>
                  <span>
                    {e.type} · {e.subject}
                  </span>
                </div>
                <div>
                  <Badge
                    tone={
                      e.status === "verified"
                        ? "green"
                        : e.status === "revision"
                        ? "red"
                        : "amber"
                    }
                  >
                    {e.status === "verified" ? "Approved" : e.status}
                  </Badge>
                  {e.score !== undefined && <small>{e.score}/100</small>}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Verifiable Credentials</h3>
            <p>Accredited certificates with digital credential keys and recertification dates.</p>
          </div>
        </div>
        <div className="passport-list credential-list">
          {certs.map((c) => {
            const course = db.courses.find((x) => x.id === c.courseId);
            return (
              <article key={c.id}>
                <div>
                  <Award />
                  <div>
                    <strong>{c.competency}</strong>
                    <span>
                      {course?.title} · Credential ID: {c.certificateCode}
                    </span>
                  </div>
                </div>
                <div>
                  <Badge tone="green">Verified & Active</Badge>
                  <small>
                    Issued {c.issuedAt}
                    {c.validUntil ? ` · Valid through ${c.validUntil}` : ""}
                  </small>
                </div>
              </article>
            );
          })}
          {!certs.length && (
            <p className="muted-copy">
              No certificates issued yet. Complete an accredited specialization, pass post-training examination, and submit faculty-reviewed operational evidence to receive official credentials.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
