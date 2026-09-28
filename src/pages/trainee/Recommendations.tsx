import { CheckCircle2, Clock, Sparkles, Star } from "lucide-react";
import { Badge, ConfirmButton, EmptyState, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function Recommendations() {
  const { db, currentUser, recommendationsForCurrentTrainee, requestEnrollment } =
    useApp();
  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  const recs = recommendationsForCurrentTrainee();
  const latest = db.competencyResults.find((r) => r.traineeId === trainee?.id);

  return (
    <>
      <PageHeader
        title="Personalized Learning Pathways"
        subtitle="Specializations and faculty mentorship curated based on your operational competency diagnostic."
      />

      {latest && (
        <section className="gap-banner">
          <div>
            <span>Identified Developmental Focus</span>
            <strong>
              {latest.subject}: Current {latest.currentLevel} → Target {latest.requiredLevel}
            </strong>
          </div>
          <div className="chip-row">
            {latest.missingCompetencies.map((x) => (
              <span className="chip" key={x}>
                {x}
              </span>
            ))}
          </div>
        </section>
      )}

      {recs.length ? (
        <div className="recommend-grid">
          {recs.map((r, i) => {
            const existing = db.enrollments.find(
              (e) =>
                e.traineeId === trainee?.id &&
                e.courseId === r.course.id &&
                e.status !== "rejected"
            );

            return (
              <article className="recommend-card" key={r.course.id}>
                <div className="recommend-rank">
                  <Sparkles size={14} /> Recommended #{i + 1}
                </div>
                <div className="match-score">
                  <strong>{r.match}%</strong>
                  <span>skill fit</span>
                </div>
                <div className="recommend-main">
                  <div className="course-top">
                    <span>{r.course.department}</span>
                    <Badge tone="blue">{r.course.level}</Badge>
                  </div>
                  <h2>{r.course.title}</h2>
                  <p>{r.course.description}</p>

                  <div className="trainer-strip">
                    <div className="avatar">
                      {r.trainer?.name
                        .split(" ")
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <strong>{r.trainer?.name}</strong>
                      <span>
                        {r.trainer?.verified ? "Accredited Senior Faculty · " : ""}
                        <Star size={13} fill="#F59E0B" color="#F59E0B" /> {r.trainer?.rating} ·{" "}
                        {r.trainer?.availability}
                      </span>
                    </div>
                  </div>

                  <div className="why-box">
                    <strong>Competency Alignment</strong>
                    <ul>
                      {r.reasons.map((x) => (
                        <li key={x}>
                          <CheckCircle2 size={14} /> {x}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="recommend-footer">
                    <span>
                      <Clock size={14} /> {r.course.durationHours} hours · Begins{" "}
                      {r.course.startDate}
                    </span>
                    {existing ? (
                      <Badge
                        tone={
                          existing.status === "approved"
                            ? "green"
                            : existing.status === "completed"
                            ? "green"
                            : "amber"
                        }
                      >
                        {existing.status === "approved"
                          ? "Enrolled"
                          : existing.status === "requested"
                          ? "Enrollment Pending"
                          : existing.status}
                      </Badge>
                    ) : (
                      <ConfirmButton
                        label="Enroll in Specialization"
                        confirmText={`Request enrollment in "${r.course.title}"?`}
                        onConfirm={() => requestEnrollment(r.course.id)}
                      />
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Diagnostic required"
          body="Complete your role-based competency diagnostic to receive personalized specialization recommendations."
        />
      )}
    </>
  );
}