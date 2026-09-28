import { Archive, Award, BookOpen, CheckCircle2, ClipboardCheck, FileText, Gauge, GraduationCap, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { CompetencyChart, ParticipationChart } from "../../components/Charts";
import { Badge, PageHeader, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { operationalReadiness, trainingImpact } from "../../utils/engine";
import MeteorologyContext from "../../components/MeteorologyContext";

export default function AdminDashboard() {
  const { db } = useApp();
  const pending = db.users.filter((u) => u.status === "pending").length;
  const activeCourses = db.courses.filter((c) => c.status === "published").length;
  const completed = db.enrollments.filter((e) => e.status === "completed").length;
  const completion = db.enrollments.length
    ? Math.round((completed / db.enrollments.length) * 100)
    : 0;
  const impact = trainingImpact(db);
  const readiness = db.trainees.length
    ? Math.round(
        db.trainees.reduce((s, t) => s + operationalReadiness(db, t.id).score, 0) /
          db.trainees.length
      )
    : 0;

  return (
    <>
      <PageHeader
        title="Administrative Command Center"
        subtitle="Organization-wide training metrics, operational competency benchmarks, and faculty governance."
        actions={
          <div className="page-actions">
            <Link to="/admin/reports" className="btn btn-secondary">
              <FileText size={16} /> Audit Reports
            </Link>
            {pending > 0 && (
              <Link to="/admin/users" className="btn btn-primary">
                <UserCheck size={16} /> Review Approvals ({pending})
              </Link>
            )}
          </div>
        }
      />

      <MeteorologyContext />

      <div className="stats-grid">
        <StatCard
          label="Total Trainees"
          value={db.trainees.length}
          icon={<GraduationCap />}
          caption="Approved personnel"
        />
        <StatCard
          label="Accredited Faculty"
          value={db.trainers.length}
          icon={<Users />}
          caption={`${db.trainers.filter((t) => t.verified).length} verified faculty`}
        />
        <StatCard
          label="Pending Approvals"
          value={pending}
          icon={<UserCheck />}
          caption="Clearance requests"
        />
        <StatCard
          label="Active Specializations"
          value={activeCourses}
          icon={<BookOpen />}
          caption="Published curricula"
        />
        <StatCard
          label="Active Enrollments"
          value={db.enrollments.length}
          icon={<CheckCircle2 />}
        />
        <StatCard
          label="Examinations Administered"
          value={db.attempts.length}
          icon={<ClipboardCheck />}
        />
        <StatCard
          label="Certificates Issued"
          value={db.certificates.length}
          icon={<Award />}
        />
        <StatCard
          label="Completion Rate"
          value={`${completion}%`}
          icon={<CheckCircle2 />}
          caption="Organization average"
        />
        <StatCard
          label="Operational Readiness"
          value={`${readiness}/100`}
          icon={<Gauge />}
          caption={`${impact.readinessRate}% personnel certified`}
        />
        <StatCard
          label="Verified Evidence"
          value={impact.verified}
          icon={<ShieldCheck />}
          caption={`${impact.evidenceRate}% deliverables approved`}
        />
        <StatCard
          label="Knowledge Assets"
          value={db.knowledgeAssets.length}
          icon={<Archive />}
          caption="Institutional memory"
        />
      </div>

      <div className="dashboard-grid two">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Competency Progression Trend</h3>
              <p>Average assessed score across cohorts</p>
            </div>
            <Badge tone="green">+30 pts gain</Badge>
          </div>
          <CompetencyChart />
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Divisional Participation</h3>
              <p>Active learners by meteorological discipline</p>
            </div>
          </div>
          <ParticipationChart />
        </section>
      </div>

      <div className="dashboard-grid two">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Recent Operational Activity</h3>
              <p>Chronological system audit events</p>
            </div>
          </div>
          <div className="activity-list">
            {db.activities.slice(0, 6).map((a) => (
              <div key={a.id}>
                <i />
                <div>
                  <strong>{a.text}</strong>
                  <span>{a.at}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Pending Governance Actions</h3>
              <p>Tasks requiring administrative decision</p>
            </div>
          </div>
          <div className="action-summary">
            <div>
              <span>User account clearance</span>
              <Badge tone="amber">{pending}</Badge>
            </div>
            <div>
              <span>Curriculum review proposals</span>
              <Badge tone="amber">
                {db.courses.filter((c) => c.status === "pending").length}
              </Badge>
            </div>
            <div>
              <span>Enrollment applications</span>
              <Badge tone="amber">
                {db.enrollments.filter((e) => e.status === "requested").length}
              </Badge>
            </div>
            <div>
              <span>Trainer accreditation reviews</span>
              <Badge tone="gray">
                {db.trainers.filter((t) => !t.verified).length}
              </Badge>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}