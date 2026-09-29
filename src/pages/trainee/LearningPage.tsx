import { BookOpen, CheckCircle2, FileText, PlayCircle, ShieldCheck, Compass, Sparkles, TrendingUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { EvidenceItem } from "../../types";
import { Badge, EmptyState, PageHeader, ProgressBar } from "../../components/UI";
import { LevelBadge, LevelJumpBadge, StatusBadge } from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";

type CourseTab = "all" | "my" | "recommended";

export default function LearningPage() {
  const { courseId } = useParams();
  const {
    db,
    currentUser,
    toggleLesson,
    submitEvidence,
    submitFeedback,
    requestEnrollment,
    getRoleRecommendations,
    getNextStep,
  } = useApp();

  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceType, setEvidenceType] = useState<EvidenceItem["type"]>("Operational Task");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [activeTab, setActiveTab] = useState<CourseTab>("all");

  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  const jobRole = trainee?.jobRole || trainee?.role || "Radar Operator";

  const enrollments = db.enrollments.filter(
    (e) => e.traineeId === trainee?.id && ["approved", "completed"].includes(e.status)
  );
  const allEnrollments = db.enrollments.filter(
    (e) => e.traineeId === trainee?.id && e.status !== "rejected"
  );

  const enrollment = courseId ? enrollments.find((e) => e.courseId === courseId) : undefined;
  const course = enrollment ? db.courses.find((c) => c.id === enrollment.courseId) : undefined;
  const mappedResources = course
    ? db.resources.filter((r) => r.courseId === course.id && (r.status || "published") === "published")
    : [];

  // Data for tabs
  const publishedCourses = db.courses.filter((c) => c.status === "published");

  // Recommendations & Next step
  const roleRecommendations = getRoleRecommendations(trainee);
  const nextStep = getNextStep(trainee);
  const recommendedCourses = roleRecommendations
    .filter((r) => r.status === "Gap" && r.recommendedCourse)
    .map((r) => r.recommendedCourse!);
  const recommendedCourseIds = new Set(recommendedCourses.map((c) => c.id));
  const allMet = roleRecommendations.length > 0 && roleRecommendations.every((r) => r.status === "Met");

  // If viewing a specific course detail
  if (courseId) {
    if (!course || !enrollment)
      return <EmptyState title="Course unavailable" body="This course is not currently approved for your trainee account." />;
    return (
      <>
        <PageHeader
          title={course.title}
          subtitle={`${course.code} · ${course.level} · ${course.durationHours} hours`}
          actions={<Link className="btn btn-secondary" to="/trainee/learning">Back to courses</Link>}
        />
        <section className="course-hero">
          <div>
            <Badge tone="green">{enrollment.status}</Badge>
            <h2>{course.description}</h2>
            <p>{course.objectives.join(" · ")}</p>
          </div>
          <div>
            <strong>{enrollment.progress}%</strong>
            <span>completed</span>
            <ProgressBar value={enrollment.progress} />
          </div>
        </section>
        <div className="course-learning-layout">
          <section>
            <div className="video-placeholder">
              <PlayCircle />
              <strong>Recorded lecture player</strong>
              <span>Select a video lesson to preview learning content.</span>
            </div>
            {course.modules.map((m, mi) => (
              <article className="module-card" key={m.id}>
                <h3>Module {mi + 1}: {m.title}</h3>
                {m.lessons.map((l) => {
                  const done = enrollment.completedLessonIds.includes(l.id);
                  return (
                    <div className={`lesson-row ${done ? "done" : ""}`} key={l.id}>
                      <div className="lesson-type">{l.type === "video" ? <PlayCircle /> : <FileText />}</div>
                      <div>
                        <strong>{l.title}</strong>
                        <span>{l.type} · {l.durationMin} min · {l.resource}</span>
                      </div>
                      <button className={done ? "btn btn-success-soft" : "btn btn-secondary"} onClick={() => toggleLesson(course.id, l.id)}>
                        {done ? <><CheckCircle2 size={16} /> Completed</> : "Mark complete"}
                      </button>
                    </div>
                  );
                })}
              </article>
            ))}
            {mappedResources.length > 0 && (
              <article className="module-card">
                <h3>Mapped IMD Learning Resources</h3>
                {mappedResources.map((r) => (
                  <div className="lesson-row" key={r.id}>
                    <div className="lesson-type"><FileText /></div>
                    <div>
                      <strong>{r.title}</strong>
                      <span>{r.type} · {r.competency || r.subject} · {r.level}</span>
                    </div>
                    {r.dataUrl ? (
                      <a className="btn btn-secondary" href={r.dataUrl} target="_blank" download={r.downloadable ? r.fileName : undefined}>Open</a>
                    ) : r.externalUrl ? (
                      <a className="btn btn-secondary" href={r.externalUrl} target="_blank" rel="noreferrer">Open</a>
                    ) : (
                      <Badge tone="gray">Library item</Badge>
                    )}
                  </div>
                ))}
              </article>
            )}
          </section>
          <aside className="panel sticky-panel">
            <h3>Course progress</h3>
            <div className="big-progress">{enrollment.progress}%</div>
            <ProgressBar value={enrollment.progress} />
            <p>Complete all lessons, then pass the post-training assessment before competency verification.</p>
            <Link className="btn btn-primary btn-block" to="/trainee/assessments">Go to assessments</Link>
            <div className="capability-evidence-box">
              <div className="evidence-title">
                <ShieldCheck size={18} />
                <div>
                  <strong>Capability Evidence</strong>
                  <span>Required before final competency verification</span>
                </div>
              </div>
              <select value={evidenceType} onChange={(e) => setEvidenceType(e.target.value as EvidenceItem["type"])}>
                <option>Operational Task</option>
                <option>Simulation</option>
                <option>Case Report</option>
                <option>Dataset Review</option>
              </select>
              <input value={evidenceTitle} onChange={(e) => setEvidenceTitle(e.target.value)} placeholder="Evidence title / task completed" />
              <button className="btn btn-secondary btn-block" disabled={!evidenceTitle.trim()} onClick={() => { submitEvidence(course.id, evidenceTitle, evidenceType); setEvidenceTitle(""); }}>Submit evidence</button>
              <small>{db.evidence.filter((e) => e.traineeId === trainee?.id && e.courseId === course.id).length} evidence item(s) submitted</small>
            </div>
            <div className="course-feedback-box">
              <strong>Course feedback</strong>
              <div className="feedback-rating">
                <span>Rating</span>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  <option value={5}>5 — Excellent</option>
                  <option value={4}>4 — Very good</option>
                  <option value={3}>3 — Good</option>
                  <option value={2}>2 — Needs improvement</option>
                  <option value={1}>1 — Poor</option>
                </select>
              </div>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="How useful was this training for your work?" />
              <button className="btn btn-secondary btn-block" disabled={!feedback.trim()} onClick={() => { submitFeedback(course.id, rating, feedback); setFeedback(""); }}>Submit feedback</button>
              {db.feedback.find((f) => f.traineeId === trainee?.id && f.courseId === course.id) && <small>✓ Your feedback is saved</small>}
            </div>
            <div className="discussion-box">
              <strong>Question / discussion</strong>
              <textarea placeholder="Ask the trainer a question..." />
              <button className="btn btn-secondary" onClick={() => alert("Question sent to trainer in prototype.")}>Send question</button>
            </div>
          </aside>
        </div>
      </>
    );
  }

  // ========= COURSE LIST VIEW WITH 3 TABS =========
  const tabConfig: { key: CourseTab; label: string; count: number }[] = [
    { key: "all", label: "All Courses", count: publishedCourses.length },
    { key: "my", label: "My Courses", count: enrollments.length },
    { key: "recommended", label: "Recommended & Gap Map", count: recommendedCourses.length },
  ];

  const renderCourseCard = (c: typeof publishedCourses[0], opts?: { showRecommendBadge?: boolean }) => {
    const enr = allEnrollments.find((e) => e.courseId === c.id);
    const isEnrolled = !!enr;
    const isRecommended = recommendedCourseIds.has(c.id);

    return (
      <article className="learning-card" key={c.id} style={{ border: "1.5px solid #CBD5E1", borderRadius: "10px", background: "#FFFFFF", padding: "18px" }}>
        <div className="learning-cover"><BookOpen /></div>
        <div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
            {isEnrolled && <Badge tone={enr?.status === "completed" ? "green" : "blue"}>{enr?.status}</Badge>}
            {(opts?.showRecommendBadge || (!isEnrolled && isRecommended)) && (
              <Badge tone="amber">Recommended</Badge>
            )}
            {c.competency && c.entryLevel && c.targetLevel && (
              <LevelJumpBadge from={c.entryLevel} to={c.targetLevel} size="sm" />
            )}
          </div>
          <h3 style={{ margin: "4px 0 6px", fontSize: "16px", color: "var(--text-heading)" }}>{c.title}</h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 8px" }}>{c.description}</p>
          {c.competency && (
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 10px" }}>
              <Compass size={13} style={{ verticalAlign: "middle", marginRight: "4px" }} />
              {c.competency} · {c.durationHours}h
            </p>
          )}
          {isEnrolled && enr && (
            <>
              <div className="progress-label"><span>Progress</span><b>{enr.progress}%</b></div>
              <ProgressBar value={enr.progress} />
              <Link className="btn btn-primary btn-block" to={`/trainee/learning/${c.id}`} style={{ marginTop: "10px" }}>Open course</Link>
            </>
          )}
          {!isEnrolled && (
            <button
              className="btn btn-secondary btn-block"
              style={{ marginTop: "10px" }}
              onClick={() => requestEnrollment(c.id)}
            >
              Request Enrollment
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <>
      <PageHeader
        title="Operational Courses & Recommendations"
        subtitle={`Role: ${jobRole} · Explore all published courses, manage active enrollments, and target competency gap courses.`}
      />

      {/* Tab bar */}
      <div
        className="courses-tab-bar"
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "2px solid var(--border-clean)",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.key ? "2.5px solid var(--brand-primary)" : "2.5px solid transparent",
              color: activeTab === tab.key ? "var(--brand-primary)" : "var(--text-muted)",
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              marginBottom: "-2px",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
            <span
              style={{
                marginLeft: "6px",
                fontSize: "11px",
                background: activeTab === tab.key ? "var(--brand-soft)" : "var(--surface-alt)",
                padding: "2px 7px",
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* =========================================================
          TAB 1: ALL COURSES
          ========================================================= */}
      {activeTab === "all" && (
        <div className="learning-grid">
          {publishedCourses.map((c) => renderCourseCard(c))}
          {!publishedCourses.length && <EmptyState title="No courses available" body="No published courses are available at this time." />}
        </div>
      )}

      {/* =========================================================
          TAB 2: MY ENROLLED COURSES
          ========================================================= */}
      {activeTab === "my" && (
        <div className="learning-grid">
          {enrollments.map((e) => {
            const c = db.courses.find((x) => x.id === e.courseId)!;
            return renderCourseCard(c);
          })}
          {!enrollments.length && (
            <EmptyState
              title="No Enrolled Courses Yet"
              body="Request enrollment from All Courses or Recommended & Gap Map tab."
            />
          )}
        </div>
      )}

      {/* =========================================================
          TAB 3: RECOMMENDED & COMPETENCY GAP MAP (Integrated)
          ========================================================= */}
      {activeTab === "recommended" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* All requirements met banner */}
          {allMet && (
            <section className="next-step-panel ready-state">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <CheckCircle2 size={28} color="#10B981" />
                <div>
                  <h3 style={{ margin: 0, fontSize: "17.5px", color: "#065F46" }}>
                    All Role Competency Requirements Met
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#047857" }}>
                    You have achieved the required level in every competency for the <strong>{jobRole}</strong> role.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Priority Next Step Recommendation */}
          {nextStep && nextStep.recommendedCourse && (
            <section
              style={{
                background: "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)",
                border: "1.5px solid #BFDBFE",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0, 86, 210, 0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={18} color="#0056D2" />
                  <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#0056D2" }}>
                    Priority Next Step Recommendation
                  </span>
                </div>
                <Badge tone="blue">Biggest Gap: {nextStep.competency} ({nextStep.gap} Level Jump)</Badge>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h4 style={{ margin: "0 0 6px", fontSize: "17px", color: "#0F172A" }}>{nextStep.recommendedCourse.title}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <LevelJumpBadge from={nextStep.recommendedCourse.entryLevel || "L1"} to={nextStep.recommendedCourse.targetLevel || "L2"} size="sm" />
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
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
                      Request Enrollment
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Competency Gap Breakdown Overview */}
          {roleRecommendations.length > 0 && (
            <section style={{ background: "#FFFFFF", border: "1.5px solid #CBD5E1", borderRadius: "10px", padding: "20px" }}>
              <div style={{ marginBottom: "14px", borderBottom: "1px solid #E2E8F0", paddingBottom: "10px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: "16.5px" }}>Role Competency Gap Map ({jobRole})</h3>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)" }}>
                  Targeted progression matching your verified competency baseline against operational role requirements.
                </p>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #CBD5E1", textAlign: "left" }}>
                      <th style={{ padding: "10px 12px" }}>Competency Area</th>
                      <th style={{ padding: "10px 12px" }}>Current Level</th>
                      <th style={{ padding: "10px 12px" }}>Required Level</th>
                      <th style={{ padding: "10px 12px" }}>Status</th>
                      <th style={{ padding: "10px 12px" }}>Recommended Course</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleRecommendations.map((item) => {
                      const isMet = item.status === "Met";
                      return (
                        <tr key={item.competency} style={{ borderBottom: "1px solid #E2E8F0" }}>
                          <td style={{ padding: "10px 12px" }}>
                            <strong>{item.competency}</strong>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <LevelBadge level={item.currentLevel} size="sm" />
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <LevelBadge level={item.requiredLevel} size="sm" />
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <StatusBadge status={item.status} size="sm" />
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            {item.recommendedCourse ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#0056D2" }}>{item.recommendedCourse.title}</span>
                                <LevelJumpBadge from={item.recommendedCourse.entryLevel || "L1"} to={item.recommendedCourse.targetLevel || "L2"} size="sm" />
                              </div>
                            ) : isMet ? (
                              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>— Target Reached —</span>
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

          {/* Gap-targeted recommended courses grid */}
          <div>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", color: "var(--text-heading)" }}>
              Recommended Courses Aligned to Your Gaps
            </h3>
            <div className="learning-grid">
              {recommendedCourses.map((c) => renderCourseCard(c, { showRecommendBadge: true }))}
              {!recommendedCourses.length && (
                <EmptyState
                  title="No Pending Course Recommendations"
                  body="All your role competency requirements are met, or no gap-specific courses are available."
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}