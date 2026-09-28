import { CheckCircle2, Compass, Lock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, EmptyState, PageHeader, ProgressBar } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { getLevelNumber, isLevelCourse } from "../../utils/engine";

export default function Recommendations() {
  const {
    db,
    currentUser,
    getRoleRecommendations,
    getNextStep,
    getTraineeLevel,
    requestEnrollment,
  } = useApp();

  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  const jobRole = trainee?.jobRole || trainee?.role || "";

  const roleRecommendations = getRoleRecommendations(trainee);
  const nextStep = getNextStep(trainee);

  const enrollments = db.enrollments.filter(
    (e) => e.traineeId === trainee?.id && e.status !== "rejected"
  );

  // All published courses for the catalog
  const publishedCourses = db.courses.filter((c) => c.status === "published");

  // Recommended courses map
  const recommendedCoursesMap = new Map<string, typeof roleRecommendations[0]>();
  roleRecommendations.forEach((item) => {
    if (item.status === "Gap" && item.recommendedCourse) {
      recommendedCoursesMap.set(item.recommendedCourse.id, item);
    }
  });

  const allMet = roleRecommendations.length > 0 && roleRecommendations.every((r) => r.status === "Met");

  return (
    <>
      <PageHeader
        title="Course Recommendations & Level Map"
        subtitle={`Role: ${jobRole || "Not Set"} · Level-based course progression aligned with your competency gaps`}
      />

      {/* Congratulations / All Met state */}
      {allMet && (
        <section className="next-step-panel ready-state" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle2 size={28} color="#10B981" />
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#065F46" }}>
                All Role Competency Requirements Met
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#047857" }}>
                You have reached the required level in every competency for the <strong>{jobRole}</strong> role.
                Continue learning to advance even further.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Priority next step banner */}
      {nextStep && nextStep.recommendedCourse && (
        <section className="next-step-panel" style={{ marginBottom: "24px" }}>
          <div className="next-step-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Compass size={20} color="#0056D2" />
              <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#0056D2" }}>
                Priority Recommendation
              </span>
            </div>
            <Badge tone="blue">Biggest Gap: {nextStep.competency} ({nextStep.gap} levels)</Badge>
          </div>
          <div className="next-step-content">
            <div className="next-step-info">
              <h4 className="next-step-title">{nextStep.recommendedCourse.title}</h4>
              <div className="next-step-meta">
                <Badge tone="amber">
                  {nextStep.recommendedCourse.entryLevel} → {nextStep.recommendedCourse.targetLevel}
                </Badge>
                <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                  {nextStep.recommendedCourse.competency} · {nextStep.recommendedCourse.durationHours} hrs
                </span>
              </div>
            </div>
            <div>
              {enrollments.some((e) => e.courseId === nextStep.recommendedCourse!.id) ? (
                <Link to={`/trainee/learning/${nextStep.recommendedCourse.id}`} className="btn btn-secondary">
                  Continue Learning →
                </Link>
              ) : (
                <button onClick={() => requestEnrollment(nextStep.recommendedCourse!.id)} className="btn btn-primary">
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Competency gap summary table */}
      {roleRecommendations.length > 0 && (
        <section className="competency-profile-panel" style={{ marginBottom: "24px" }}>
          <div className="panel-head">
            <div>
              <h3>Competency Gap Overview</h3>
              <p>Your current levels vs required levels for the {jobRole} role</p>
            </div>
          </div>
          <div className="competency-table-wrapper">
            <table className="competency-table">
              <thead>
                <tr>
                  <th>Competency</th>
                  <th>Current</th>
                  <th>Required</th>
                  <th>Status</th>
                  <th>Recommended Course</th>
                </tr>
              </thead>
              <tbody>
                {roleRecommendations.map((item) => {
                  const isMet = item.status === "Met";
                  return (
                    <tr key={item.competency}>
                      <td><strong>{item.competency}</strong></td>
                      <td>
                        <span style={{ fontWeight: 600, color: isMet ? "#047857" : "#0056D2" }}>
                          {item.currentLevel}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: "var(--text-heading)" }}>
                          {item.requiredLevel}
                        </span>
                      </td>
                      <td>
                        {isMet ? (
                          <Badge tone="green">Met</Badge>
                        ) : (
                          <Badge tone="amber">Gap ({item.gap})</Badge>
                        )}
                      </td>
                      <td>
                        {item.recommendedCourse ? (
                          <span style={{ fontSize: "13px" }}>
                            {item.recommendedCourse.title}{" "}
                            <Badge tone="blue">{item.recommendedCourse.entryLevel} → {item.recommendedCourse.targetLevel}</Badge>
                          </span>
                        ) : isMet ? (
                          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                        ) : (
                          <span style={{ color: "#92400E", fontSize: "12px" }}>
                            {item.reasonMessage || "No course available yet"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Full course catalog */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>All Published Courses</h3>
            <p>Level prerequisites are enforced. You must meet the entry level to enroll.</p>
          </div>
        </div>

        {publishedCourses.length === 0 ? (
          <EmptyState title="No courses published" body="Check back later as new courses are added to the catalog." />
        ) : (
          <div className="course-grid-catalog">
            {publishedCourses.map((course) => {
              const hasLevels = isLevelCourse(course);
              const competencyName = course.competency || course.subject;

              // Level gate check
              let isLocked = false;
              let lockMessage = "";
              let currentLvl = "L1";
              if (trainee && hasLevels && course.competency) {
                currentLvl = getTraineeLevel(trainee.id, course.competency);
                const currentRank = getLevelNumber(currentLvl);
                const entryRank = getLevelNumber(course.entryLevel);
                if (entryRank > currentRank) {
                  isLocked = true;
                  lockMessage = `Requires ${course.entryLevel} in ${course.competency}. Your level: ${currentLvl}.`;
                }
              }

              const isEnrolled = enrollments.some((e) => e.courseId === course.id);
              const isRecommended = recommendedCoursesMap.has(course.id);
              const trainer = db.trainers.find((t) => t.id === course.trainerId);

              return (
                <div
                  key={course.id}
                  className={`course-card-modern ${isLocked ? "locked" : ""}`}
                  style={isRecommended ? { borderColor: "#BFDBFE", borderWidth: "2px" } : {}}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      {hasLevels ? (
                        <Badge tone={isLocked ? "gray" : "blue"}>
                          {course.entryLevel} → {course.targetLevel}
                        </Badge>
                      ) : (
                        <Badge tone="gray">{course.level}</Badge>
                      )}
                      {isRecommended && <Badge tone="green">Recommended</Badge>}
                      {isLocked && (
                        <span className="locked-badge-pill">
                          <Lock size={12} /> Locked
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: "15px", margin: "0 0 6px", color: isLocked ? "#64748B" : "var(--text-heading)" }}>
                      {course.title}
                    </h4>

                    <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: "0 0 8px", lineHeight: 1.4 }}>
                      {course.description}
                    </p>

                    {/* Phase 5 requirement 3: Level info block */}
                    {hasLevels && trainee && (
                      <div style={{
                        fontSize: "12px",
                        background: isLocked ? "#FEF3C7" : "#F0F5FF",
                        border: `1px solid ${isLocked ? "#FDE68A" : "#BFDBFE"}`,
                        borderRadius: "6px",
                        padding: "8px 10px",
                        marginBottom: "10px",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>Your level now:</span>
                          <strong style={{ color: isLocked ? "#92400E" : "#0056D2" }}>{currentLvl}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>This course takes you to:</span>
                          <strong style={{ color: "#047857" }}>{course.targetLevel}</strong>
                        </div>
                        {(() => {
                          const gapItem = roleRecommendations.find((r) => r.competency === course.competency);
                          if (gapItem) {
                            return (
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Your role needs:</span>
                                <strong style={{ color: "var(--text-heading)" }}>{gapItem.requiredLevel}</strong>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                      <span><strong>Competency:</strong> {competencyName}</span>
                      <br />
                      <span>{course.durationHours} hrs · {course.code} · Trainer: {trainer?.name || "IMD Faculty"}</span>
                    </div>

                    {isLocked && (
                      <p style={{ fontSize: "11.5px", color: "#92400E", margin: "0 0 10px" }}>
                        {lockMessage}
                      </p>
                    )}
                  </div>

                  <div>
                    {isLocked ? (
                      <button disabled className="btn btn-disabled btn-block btn-sm">
                        <Lock size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                        Locked (Requires {course.entryLevel})
                      </button>
                    ) : isEnrolled ? (
                      <Link to={`/trainee/learning/${course.id}`} className="btn btn-secondary btn-block btn-sm">
                        Continue Learning
                      </Link>
                    ) : (
                      <button onClick={() => requestEnrollment(course.id)} className="btn btn-primary btn-block btn-sm">
                        Enroll in Course
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}