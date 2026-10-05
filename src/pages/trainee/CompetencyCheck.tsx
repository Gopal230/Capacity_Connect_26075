import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function CompetencyCheck() {
  const { db, currentUser, runCompetencyCheck } = useApp();
  const navigate = useNavigate();
  const trainee = db.trainees.find((item) => item.userId === currentUser?.id);
  const competencyAssessments = db.assessments.filter(
    (item) => item.type === "competency" || item.type === "post",
  );
  const [assessmentId, setAssessmentId] = useState(competencyAssessments[0]?.id || "");
  const assessment = db.assessments.find((item) => item.id === assessmentId);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!assessment || !trainee) return;

    const correct = assessment.questions.reduce(
      (score, question, index) => score + (answers[index] === question.answer ? 1 : 0),
      0,
    );
    const score = Math.round((correct / assessment.questions.length) * 100);
    const missed = assessment.questions
      .filter((question, index) => answers[index] !== question.answer)
      .map((question) => question.competency);
    const assessmentResult = runCompetencyCheck(
      trainee.designation,
      assessment.subject,
      score,
      [...new Set(missed)],
    );

    setResult(assessmentResult);
  };

  const answeredCount = answers.filter((answer) => answer !== undefined).length;

  return (
    <>
      <PageHeader
        title="Competency Check"
        subtitle="Measure your current level against the competency required for your role."
      />

      {!result ? (
        <section className="panel assessment-shell">
          <div className="assessment-intro">
            <div>
              <span>Step 1 of 3</span>
              <h3>Select role-based assessment</h3>
              <p>
                Your current designation is <strong>{trainee?.designation}</strong>. The
                prototype compares your score with the mapped role requirement.
              </p>
            </div>
            <select
              value={assessmentId}
              onChange={(event) => {
                setAssessmentId(event.target.value);
                setAnswers([]);
              }}
            >
              {competencyAssessments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {assessment && (
            <form onSubmit={submit}>
              <div className="assessment-meta">
                <Badge tone="blue">{assessment.subject}</Badge>
                <span>{assessment.questions.length} questions</span>
                <span>{assessment.durationMin} min</span>
              </div>

              <div className="mcq-list">
                {assessment.questions.map((question, questionIndex) => (
                  <div className="mcq-question" key={question.id}>
                    <div className="mcq-question-title">
                      <span className="mcq-question-number">{questionIndex + 1}</span>
                      <h4>{question.text}</h4>
                    </div>

                    <div className="mcq-options">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = answers[questionIndex] === optionIndex;
                        const letter = String.fromCharCode(65 + optionIndex);

                        return (
                          <label
                            className={`mcq-option ${isSelected ? "selected" : ""}`}
                            key={option}
                          >
                            <input
                              type="radio"
                              name={`${assessment.id}-${question.id}`}
                              checked={isSelected}
                              onChange={() => {
                                const nextAnswers = [...answers];
                                nextAnswers[questionIndex] = optionIndex;
                                setAnswers(nextAnswers);
                              }}
                              required
                            />
                            <span className="mcq-option-letter">{letter}</span>
                            <span className="mcq-option-text">{option}</span>
                            <span className="mcq-option-indicator" aria-hidden="true" />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary"
                disabled={answeredCount !== assessment.questions.length}
              >
                Submit competency check
              </button>
            </form>
          )}
        </section>
      ) : (
        <section className="panel result-panel">
          <div className="result-score">
            <strong>{result.score}%</strong>
            <span>Current competency score</span>
          </div>
          <div>
            <Badge tone="amber">{result.currentLevel}</Badge>
            <h2>{result.subject}</h2>
            <p>
              Required level: <strong>{result.requiredLevel}</strong>
            </p>
            <h3>{result.gapText}</h3>
            <p>Missing competencies identified:</p>
            <div className="chip-row">
              {result.missingCompetencies.length ? (
                result.missingCompetencies.map((item: string) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))
              ) : (
                <Badge tone="green">No gap identified</Badge>
              )}
            </div>
            <div className="result-actions">
              <button className="btn btn-secondary" onClick={() => setResult(null)}>
                Retake
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/trainee/recommendations")}
              >
                See personalized recommendations
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
