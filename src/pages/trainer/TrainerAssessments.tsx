import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";

type AssessmentType = "pre" | "post" | "competency";

export default function TrainerAssessments() {
  const { db, currentUser, addAssessment } = useApp();
  const trainer = db.trainers.find((item) => item.userId === currentUser?.id);
  const courses = db.courses.filter((course) => course.trainerId === trainer?.id);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({
    courseId: courses[0]?.id || "",
    type: "post" as AssessmentType,
    title: "",
    subject: courses[0]?.subject || "",
    passingPercentage: 70,
    durationMin: 10,
    deadline: "2026-10-15",
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    answer: 0,
    competency: "",
  });

  const mine = db.assessments.filter((assessment) =>
    courses.some((course) => course.id === assessment.courseId),
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    addAssessment({
      courseId: form.courseId,
      type: form.type,
      title: form.title,
      subject: form.subject,
      passingPercentage: Number(form.passingPercentage),
      durationMin: Number(form.durationMin),
      deadline: form.deadline,
      questions: [
        {
          id: `q-${Date.now()}`,
          text: form.question,
          options: [form.a, form.b, form.c, form.d],
          answer: Number(form.answer),
          competency: form.competency || form.subject,
        },
      ],
    });
    setForm((current) => ({
      ...current,
      title: "",
      question: "",
      a: "",
      b: "",
      c: "",
      d: "",
      competency: "",
    }));
    setIsFormOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Assessment Management"
        subtitle="Create subject-wise MCQ assessments and review trainee attempts."
        actions={!isFormOpen ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsFormOpen(true)}
            aria-expanded={false}
          >
            <Plus size={16} /> Create MCQ assessment
          </button>
        ) : undefined}
      />

      <div
        className={`dashboard-grid content-layout ${
          isFormOpen ? "content-layout-form-open" : "content-layout-form-closed"
        }`}
      >
        {isFormOpen && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Create MCQ assessment</h3>
                <p>Prototype supports one-question creation per submission</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsFormOpen(false)}
              >
                <X size={14} /> Close
              </button>
            </div>
            <form className="stack-form" onSubmit={submit}>
              <label>
                Course
                <select
                  value={form.courseId}
                  onChange={(event) => {
                    const course = courses.find((item) => item.id === event.target.value);
                    setForm((current) => ({
                      ...current,
                      courseId: event.target.value,
                      subject: course?.subject || current.subject,
                    }));
                  }}
                  required
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-grid two">
                <label>
                  Assessment title
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, title: event.target.value }))
                    }
                    required
                  />
                </label>
                <label>
                  Type
                  <select
                    value={form.type}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        type: event.target.value as AssessmentType,
                      }))
                    }
                  >
                    <option value="pre">Pre-training</option>
                    <option value="post">Post-training</option>
                    <option value="competency">Competency</option>
                  </select>
                </label>
                <label>
                  Passing %
                  <input
                    type="number"
                    value={form.passingPercentage}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        passingPercentage: Number(event.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  Duration (min)
                  <input
                    type="number"
                    value={form.durationMin}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        durationMin: Number(event.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  Deadline
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, deadline: event.target.value }))
                    }
                    required
                  />
                </label>
              </div>

              <label>
                Question
                <input
                  value={form.question}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, question: event.target.value }))
                  }
                  required
                />
              </label>

              <div className="form-grid two">
                {(["a", "b", "c", "d"] as const).map((option) => (
                  <label key={option}>
                    Option {option.toUpperCase()}
                    <input
                      value={form[option]}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [option]: event.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                ))}
                <label>
                  Correct answer
                  <select
                    value={form.answer}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        answer: Number(event.target.value),
                      }))
                    }
                  >
                    <option value={0}>A</option>
                    <option value={1}>B</option>
                    <option value={2}>C</option>
                    <option value={3}>D</option>
                  </select>
                </label>
                <label>
                  Competency measured
                  <input
                    value={form.competency}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        competency: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <button className="btn btn-primary" type="submit">
                Create assessment
              </button>
            </form>
          </section>
        )}

        {!isFormOpen && <section className="panel">
          <div className="panel-head">
            <div>
              <h3>My assessments</h3>
              <p>{mine.length} available</p>
            </div>
          </div>
          <div className="notification-list">
            {mine.map((assessment) => (
              <article key={assessment.id}>
                <div>
                  <Badge tone="blue">{assessment.type}</Badge>
                  <Badge tone="green">Pass {assessment.passingPercentage}%</Badge>
                </div>
                <h4>{assessment.title}</h4>
                <p>
                  {assessment.subject} · {assessment.questions.length} questions ·{" "}
                  {assessment.durationMin} min
                  {assessment.deadline ? ` · Due ${assessment.deadline}` : ""}
                </p>
                <small>
                  {db.attempts.filter((attempt) => attempt.assessmentId === assessment.id).length}{" "}
                  attempts
                </small>
              </article>
            ))}
          </div>
        </section>}
      </div>
    </>
  );
}
