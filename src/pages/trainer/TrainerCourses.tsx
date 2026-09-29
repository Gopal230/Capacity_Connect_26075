import { FormEvent, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Edit3,
  FileText,
  HelpCircle,
  Layers,
  ListOrdered,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { Badge, PageHeader } from "../../components/UI";
import { LevelBadge, LevelJumpBadge } from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";
import { IMD_RADAR_COMPETENCIES, deriveDifficulty } from "../../data/constants";
import { CompetencyLevel, Course, Lesson, Level, Question } from "../../types";
import { canEnroll, formatLevel, getLevelNumber } from "../../utils/engine";

interface LevelJumpPair {
  entryLevel: CompetencyLevel;
  targetLevel: CompetencyLevel;
  label: string;
  isExisting: boolean;
  existingCourseTitle?: string;
}

export default function TrainerCourses() {
  const { db, currentUser, createCourse, updateCourse, traineeLevels } = useApp();
  const trainer = db.trainers.find((t) => t.userId === currentUser?.id);
  const myCourses = db.courses.filter((c) => c.trainerId === trainer?.id);

  // Competency options from stored master list
  const competencies = IMD_RADAR_COMPETENCIES;

  // Selected competency for the course form
  const [selectedCompetency, setSelectedCompetency] = useState<string>(
    competencies[0]?.name || "Doppler Radar Operations"
  );

  // Selected level jump (e.g. "L1->L2", "L2->L3")
  const [selectedJumpKey, setSelectedJumpKey] = useState<string>("L1->L2");

  // Form states
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState(trainer?.department || "Radar Operations");
  const [description, setDescription] = useState("");
  const [durationHours, setDurationHours] = useState(6);
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-11-15");
  const [enrollmentLimit, setEnrollmentLimit] = useState(35);
  const [icon, setIcon] = useState("📡");

  // 3 short bullet outcomes
  const [outcomes, setOutcomes] = useState<[string, string, string]>([
    "Operate and configure operational radar scan parameters in compliance with IMD standard operating procedures.",
    "Diagnose meteorological vs non-meteorological echoes to minimize false alarm rates.",
    "Formulate timely, standardized operational bulletins for disaster management authorities.",
  ]);

  // Lessons list
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "les-1",
      title: "Operational Principles & System Overview",
      type: "video",
      durationMin: 25,
      resource: "IMD Radar Core Training Video Series",
    },
    {
      id: "les-2",
      title: "IMD Standard Operating Manual Review",
      type: "pdf",
      durationMin: 30,
      resource: "IMD-SOP-Manual-Rev3.pdf",
    },
    {
      id: "les-3",
      title: "Severe Weather Case Diagnostic Exercise",
      type: "presentation",
      durationMin: 35,
      resource: "Real-Case-Diagnostic-Walkthrough.pptx",
    },
  ]);

  // Questions (assessment) list
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q-1",
      text: "What primary factor distinguishes meteorological precipitation echoes from ground clutter?",
      options: [
        "Consistent radial velocity motion and vertical continuity across elevation scans",
        "Higher ambient temperature recorded inside the radome",
        "Static zero velocity and zero vertical extent above ground",
        "Visual camera confirmation from the radar tower observation deck",
      ],
      answer: 0,
      competency: selectedCompetency,
    },
    {
      id: "q-2",
      text: "Under IMD operational guidelines, what is the mandatory action upon detecting a severe convective vortex couplet?",
      options: [
        "Issue an immediate Nowcast Red/Orange severe weather warning bulletin",
        "Power off the transmitter pedestal motors for calibration",
        "Wait 60 minutes for the subsequent volume scan to verify",
        "Request offline manual confirmation from district administration",
      ],
      answer: 0,
      competency: selectedCompetency,
    },
  ]);

  // Compute valid level jump pairs for the selected competency
  const validLevelJumps = useMemo<LevelJumpPair[]>(() => {
    // Find all published/existing courses for this competency to inspect the ladder
    const existingForComp = db.courses.filter(
      (c) =>
        (c.competency === selectedCompetency || c.subject === selectedCompetency) &&
        c.entryLevel &&
        c.targetLevel &&
        c.id !== editingCourseId
    );

    const jumps: LevelJumpPair[] = [];

    // Possible consecutive jumps up to L5: L1->L2, L2->L3, L3->L4, L4->L5
    const standardJumps: [CompetencyLevel, CompetencyLevel][] = [
      ["L1", "L2"],
      ["L2", "L3"],
      ["L3", "L4"],
      ["L4", "L5"],
    ];

    standardJumps.forEach(([entry, target]) => {
      const match = existingForComp.find(
        (c) => c.entryLevel === entry && c.targetLevel === target
      );
      jumps.push({
        entryLevel: entry,
        targetLevel: target,
        label: `${entry} → ${target}`,
        isExisting: Boolean(match),
        existingCourseTitle: match?.title,
      });
    });

    return jumps;
  }, [db.courses, selectedCompetency, editingCourseId]);

  // Ensure selectedJumpKey is valid
  const currentJump = useMemo(() => {
    const found = validLevelJumps.find(
      (j) => `${j.entryLevel}->${j.targetLevel}` === selectedJumpKey
    );
    return found || validLevelJumps[0] || {
      entryLevel: "L1" as CompetencyLevel,
      targetLevel: "L2" as CompetencyLevel,
      label: "L1 → L2",
      isExisting: false,
    };
  }, [validLevelJumps, selectedJumpKey]);

  // When competency changes, ensure jump key aligns
  const handleCompetencyChange = (newComp: string) => {
    setSelectedCompetency(newComp);
    setQuestions((prev) =>
      prev.map((q) => ({ ...q, competency: newComp }))
    );
  };

  // Helper to open edit mode for an existing course
  const handleEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setTitle(course.title);
    setCode(course.code);
    setDepartment(course.department || trainer?.department || "Radar Operations");
    setDescription(course.description);
    setDurationHours(course.durationHours || 6);
    setStartDate(course.startDate || "2026-10-01");
    setEndDate(course.endDate || "2026-11-15");
    setEnrollmentLimit(course.enrollmentLimit || 35);
    setIcon(course.code.includes("RAD") ? "📡" : course.code.includes("WRN") ? "⚠️" : "🌦️");

    if (course.competency) {
      setSelectedCompetency(course.competency);
    } else if (course.subject) {
      setSelectedCompetency(course.subject);
    }

    if (course.entryLevel && course.targetLevel) {
      setSelectedJumpKey(`${course.entryLevel}->${course.targetLevel}`);
    } else {
      setSelectedJumpKey("L1->L2");
    }

    if (course.objectives && course.objectives.length > 0) {
      setOutcomes([
        course.objectives[0] || "",
        course.objectives[1] || "",
        course.objectives[2] || "",
      ]);
    }

    // Extract lessons if available
    const allLessons = course.modules?.flatMap((m) => m.lessons) || [];
    if (allLessons.length > 0) {
      setLessons(allLessons);
    }

    // Extract questions if existing assessment found
    const courseAssessment = db.assessments.find((a) => a.courseId === course.id);
    if (courseAssessment && courseAssessment.questions.length > 0) {
      setQuestions(courseAssessment.questions);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null);
    setTitle("");
    setCode("");
    setDescription("");
    setOutcomes([
      "Operate and configure operational radar scan parameters in compliance with IMD standard operating procedures.",
      "Diagnose meteorological vs non-meteorological echoes to minimize false alarm rates.",
      "Formulate timely, standardized operational bulletins for disaster management authorities.",
    ]);
  };

  // Lesson handlers
  const handleAddLesson = () => {
    const num = lessons.length + 1;
    setLessons([
      ...lessons,
      {
        id: `les-${Date.now()}-${num}`,
        title: `Lesson ${num}: Practical Operational Procedures`,
        type: "video",
        durationMin: 20,
        resource: "IMD Standard Operating Guide",
      },
    ]);
  };

  const handleRemoveLesson = (id: string) => {
    if (lessons.length <= 1) return;
    setLessons(lessons.filter((l) => l.id !== id));
  };

  const handleUpdateLesson = (id: string, patch: Partial<Lesson>) => {
    setLessons(lessons.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  // Question handlers
  const handleAddQuestion = () => {
    const num = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}-${num}`,
        text: `Operational Question ${num}: Practical scenario evaluation criteria?`,
        options: [
          "Standard operating procedure compliant action (Optimal)",
          "Delayed secondary assessment",
          "Unverified field intervention",
          "Non-standard override",
        ],
        answer: 0,
        competency: selectedCompetency,
      },
    ]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleUpdateQuestion = (id: string, patch: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  // Submit course
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!trainer) return;

    const entryLevel = currentJump.entryLevel;
    const targetLevel = currentJump.targetLevel;
    const difficulty: Level = deriveDifficulty(entryLevel, targetLevel);

    // Find prerequisite course: if entryLevel > L1, find course that targets entryLevel in same competency
    let prerequisiteCourseId: string | null = null;
    if (getLevelNumber(entryLevel) > 1) {
      const prereq = db.courses.find(
        (c) =>
          (c.competency === selectedCompetency || c.subject === selectedCompetency) &&
          c.targetLevel === entryLevel &&
          c.id !== editingCourseId
      );
      if (prereq) {
        prerequisiteCourseId = prereq.id;
      }
    }

    const cleanOutcomes = outcomes.map((o) => o.trim()).filter(Boolean);

    // Structure course modules
    const modules = [
      {
        id: `m1-${editingCourseId || Date.now()}`,
        title: `${selectedCompetency} Curriculum Modules (${entryLevel} → ${targetLevel})`,
        lessons,
      },
    ];

    if (editingCourseId) {
      // Update existing course
      updateCourse(editingCourseId, {
        title: title.trim(),
        code: code.trim().toUpperCase(),
        competency: selectedCompetency,
        subject: selectedCompetency,
        entryLevel,
        targetLevel,
        prerequisiteCourseId,
        level: difficulty,
        department,
        description: description.trim(),
        objectives: cleanOutcomes,
        durationHours: Number(durationHours),
        duration: `${durationHours} Hours`,
        startDate,
        endDate,
        enrollmentLimit: Number(enrollmentLimit),
        modules,
      });

      // Update corresponding assessment questions if assessment exists
      const existingAssessment = db.assessments.find((a) => a.courseId === editingCourseId);
      if (existingAssessment) {
        existingAssessment.questions = questions.map((q) => ({
          ...q,
          competency: selectedCompetency,
        }));
      }
    } else {
      // Create new course proposal
      const newCourseId = `c-${Date.now()}`;
      createCourse({
        title: title.trim(),
        code: code.trim().toUpperCase() || `IMD-${selectedCompetency.slice(0, 3).toUpperCase()}-101`,
        competency: selectedCompetency,
        subject: selectedCompetency,
        entryLevel,
        targetLevel,
        prerequisiteCourseId,
        level: difficulty,
        department,
        trainerId: trainer.id,
        description: description.trim(),
        objectives: cleanOutcomes,
        durationHours: Number(durationHours),
        duration: `${durationHours} Hours`,
        startDate,
        endDate,
        enrollmentLimit: Number(enrollmentLimit),
        modules,
      });

      // Also create matching post-training assessment
      const newAssessment: Omit<typeof db.assessments[0], "id"> = {
        courseId: newCourseId,
        type: "post",
        title: `${title.trim()} Competency Assessment (${entryLevel} → ${targetLevel})`,
        subject: selectedCompetency,
        passingPercentage: 60,
        durationMin: 15,
        deadline: endDate,
        questions: questions.map((q) => ({
          ...q,
          competency: selectedCompetency,
        })),
      };

      // Add to assessments
      db.assessments.unshift({
        ...newAssessment,
        id: `a-${Date.now()}`,
      });
    }

    handleCancelEdit();
  };

  return (
    <>
      <PageHeader
        title="Course & Content Management Studio"
        subtitle="Author standardized competency ladder courses (L1 to L5) with practical lessons and assessment suites."
      />

      <div className="dashboard-grid content-layout">
        {/* =========================================================
            LEFT COLUMN: COURSE CREATION & EDITING FORM
            ========================================================= */}
        <section className="panel" style={{ background: "#FFFFFF", borderRadius: "12px", border: "1.5px solid #CBD5E1", padding: "24px" }}>
          <div className="panel-head" style={{ borderBottom: "1.5px solid #E2E8F0", paddingBottom: "14px", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#0056D2",
                    background: "#EFF6FF",
                    padding: "3px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {editingCourseId ? "Edit Mode" : "New Proposal"}
                </span>
                {editingCourseId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: "11px", padding: "2px 8px" }}
                  >
                    Cancel Editing
                  </button>
                )}
              </div>
              <h3 style={{ margin: 0, fontSize: "20px", color: "var(--text-heading)" }}>
                {editingCourseId ? "Edit Course Proposal" : "Create Competency Course Proposal"}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
                Select competency and progression step. Admin review is required before publishing.
              </p>
            </div>
          </div>

          <form className="stack-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* 1. Live Level Jump Badge Preview Banner (Prompt 1 #4) */}
            <div
              style={{
                background: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)",
                border: "1.5px solid #BFDBFE",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#1E40AF", display: "block", marginBottom: "4px" }}>
                  Live Level Jump Preview
                </span>
                <strong style={{ fontSize: "15px", color: "#0F172A" }}>
                  {selectedCompetency}
                </strong>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <LevelJumpBadge from={currentJump.entryLevel} to={currentJump.targetLevel} size="normal" />
                <Badge tone={currentJump.isExisting ? "amber" : "green"}>
                  {currentJump.isExisting ? "Existing Ladder Step" : "New Ladder Step"}
                </Badge>
              </div>
            </div>

            {/* 2. Dropdowns: Competency & Level Jump (Prompt 1 #1) */}
            <div className="form-grid two">
              <label>
                Operational Competency
                <select
                  value={selectedCompetency}
                  onChange={(e) => handleCompetencyChange(e.target.value)}
                  required
                >
                  {competencies.map((comp) => (
                    <option key={comp.id} value={comp.name}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Level Jump (Valid Entry → Target Ladder Only)
                <select
                  value={selectedJumpKey}
                  onChange={(e) => setSelectedJumpKey(e.target.value)}
                  required
                >
                  {validLevelJumps.map((jump) => {
                    const key = `${jump.entryLevel}->${jump.targetLevel}`;
                    const note = jump.isExisting
                      ? ` [Ladder Course: ${jump.existingCourseTitle || "Configured"}]`
                      : " (Create New Ladder Course)";
                    return (
                      <option key={key} value={key}>
                        {jump.label} — {jump.entryLevel} to {jump.targetLevel} {note}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>

            {/* Core Course Metadata */}
            <div className="form-grid two">
              <label>
                Course Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Doppler Radar Basics"
                  required
                />
              </label>

              <label>
                Course Code
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. IMD-RAD-101"
                  required
                />
              </label>

              <label>
                Operational Department
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Radar Operations"
                  required
                />
              </label>

              <label>
                Course Icon (Representation Symbol)
                <select value={icon} onChange={(e) => setIcon(e.target.value)}>
                  <option value="📡">📡 Doppler Weather Radar</option>
                  <option value="🌦️">🌦️ Synoptic & Forecasting</option>
                  <option value="🛰️">🛰️ Satellite Meteorology</option>
                  <option value="🌧️">🌧️ Monsoon & Hydrology</option>
                  <option value="⚠️">⚠️ Warning & Alert Services</option>
                  <option value="⚙️">⚙️ Radar Maintenance & QC</option>
                </select>
              </label>

              <label>
                Duration (Hours)
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  required
                />
              </label>

              <label>
                Enrollment Capacity Limit
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={enrollmentLimit}
                  onChange={(e) => setEnrollmentLimit(Number(e.target.value))}
                  required
                />
              </label>

              <label>
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </label>

              <label>
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </label>
            </div>

            <label>
              Course Summary & Context
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive description of radar physics, scan strategies, operational SOPs covered..."
                required
              />
            </label>

            {/* 3. Outcomes: 3 short bullets (Prompt 1 #2) */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1.5px solid #CBD5E1",
                borderRadius: "10px",
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Target size={18} color="#0056D2" />
                <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>
                  Learning Outcomes (3 Target Bullets)
                </strong>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 12px" }}>
                "After this course you will be able to..." Define 3 concrete operational capabilities acquired upon graduation.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0056D2", width: "20px" }}>1.</span>
                  <input
                    value={outcomes[0]}
                    onChange={(e) => setOutcomes([e.target.value, outcomes[1], outcomes[2]])}
                    placeholder="Outcome 1: Understand..."
                    required
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0056D2", width: "20px" }}>2.</span>
                  <input
                    value={outcomes[1]}
                    onChange={(e) => setOutcomes([outcomes[0], e.target.value, outcomes[2]])}
                    placeholder="Outcome 2: Execute..."
                    required
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0056D2", width: "20px" }}>3.</span>
                  <input
                    value={outcomes[2]}
                    onChange={(e) => setOutcomes([outcomes[0], outcomes[1], e.target.value])}
                    placeholder="Outcome 3: Analyze..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* 4. Curriculum Lessons Editor (Prompt 1 #3) */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1.5px solid #CBD5E1",
                borderRadius: "10px",
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Layers size={18} color="#0056D2" />
                  <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>
                    Course Lessons ({lessons.length} Modules)
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={handleAddLesson}
                  className="btn btn-secondary btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", padding: "4px 10px" }}
                >
                  <Plus size={14} /> Add Lesson
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      padding: "12px",
                      display: "grid",
                      gridTemplateColumns: "1.8fr 1fr 1fr auto",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "11px", color: "#64748B", display: "block" }}>Lesson {idx + 1} Title</span>
                      <input
                        value={lesson.title}
                        onChange={(e) => handleUpdateLesson(lesson.id, { title: e.target.value })}
                        required
                        style={{ padding: "6px 8px", fontSize: "13px" }}
                      />
                    </div>

                    <div>
                      <span style={{ fontSize: "11px", color: "#64748B", display: "block" }}>Type</span>
                      <select
                        value={lesson.type}
                        onChange={(e) => handleUpdateLesson(lesson.id, { type: e.target.value as any })}
                        style={{ padding: "6px 8px", fontSize: "13px" }}
                      >
                        <option value="video">Video</option>
                        <option value="pdf">PDF</option>
                        <option value="presentation">Presentation</option>
                        <option value="note">Field Note</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: "11px", color: "#64748B", display: "block" }}>Duration (Min)</span>
                      <input
                        type="number"
                        min={5}
                        max={180}
                        value={lesson.durationMin}
                        onChange={(e) => handleUpdateLesson(lesson.id, { durationMin: Number(e.target.value) })}
                        style={{ padding: "6px 8px", fontSize: "13px" }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveLesson(lesson.id)}
                      disabled={lessons.length <= 1}
                      title="Remove lesson"
                      className="btn btn-ghost"
                      style={{ padding: "8px", color: "#DC2626" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Assessment Questions Editor (Prompt 1 #3) */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1.5px solid #CBD5E1",
                borderRadius: "10px",
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <HelpCircle size={18} color="#0056D2" />
                  <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>
                    Post-Training Assessment Questions ({questions.length} MCQs)
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="btn btn-secondary btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", padding: "4px 10px" }}
                >
                  <Plus size={14} /> Add MCQ
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      padding: "14px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#0056D2" }}>
                        Question {qIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        disabled={questions.length <= 1}
                        className="btn btn-ghost"
                        style={{ padding: "4px", color: "#DC2626" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input
                      value={q.text}
                      onChange={(e) => handleUpdateQuestion(q.id, { text: e.target.value })}
                      placeholder="Question text..."
                      required
                      style={{ marginBottom: "10px", fontSize: "13.5px" }}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", width: "16px" }}>
                            {String.fromCharCode(65 + optIdx)}:
                          </span>
                          <input
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...q.options];
                              newOpts[optIdx] = e.target.value;
                              handleUpdateQuestion(q.id, { options: newOpts });
                            }}
                            required
                            style={{ padding: "6px 8px", fontSize: "12.5px" }}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#166534" }}>Correct Answer:</span>
                      <select
                        value={q.answer}
                        onChange={(e) => handleUpdateQuestion(q.id, { answer: Number(e.target.value) })}
                        style={{ width: "auto", padding: "4px 10px", fontSize: "12px" }}
                      >
                        {q.options.map((_, oIdx) => (
                          <option key={oIdx} value={oIdx}>
                            Option {String.fromCharCode(65 + oIdx)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
              {editingCourseId && (
                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                  Cancel
                </button>
              )}
              <button className="btn btn-primary" type="submit" style={{ padding: "12px 24px" }}>
                {editingCourseId ? "Save Course Changes" : "Submit Course for Admin Approval"}
              </button>
            </div>
          </form>
        </section>

        {/* =========================================================
            RIGHT COLUMN: MY COURSES LIST WITH LEVEL JUMPS & STATUS
            ========================================================= */}
        <section className="panel" style={{ background: "#FFFFFF", borderRadius: "12px", border: "1.5px solid #CBD5E1", padding: "24px" }}>
          <div className="panel-head" style={{ borderBottom: "1.5px solid #E2E8F0", paddingBottom: "14px", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "19px", color: "var(--text-heading)" }}>My Authored Courses</h3>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
                {myCourses.length} active or proposed course curriculums
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {myCourses.map((c) => {
              const comp = c.competency || c.subject;
              return (
                <article
                  key={c.id}
                  style={{
                    background: "#F8FAFC",
                    border: "1.5px solid #CBD5E1",
                    borderRadius: "10px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "10px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <Badge tone={c.status === "published" ? "green" : c.status === "pending" ? "amber" : "gray"}>
                          {c.status}
                        </Badge>
                        {c.entryLevel && c.targetLevel ? (
                          <LevelJumpBadge from={c.entryLevel} to={c.targetLevel} size="sm" />
                        ) : (
                          <Badge tone="blue">{c.level}</Badge>
                        )}
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                        {c.code}
                      </span>
                    </div>

                    <h4 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--text-heading)", fontWeight: 700 }}>
                      {c.title}
                    </h4>

                    <p style={{ margin: "0 0 8px", fontSize: "12.5px", color: "var(--text-body)", lineHeight: 1.4 }}>
                      {c.description}
                    </p>

                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "8px" }}>
                      <strong>Competency:</strong> {comp} · {c.durationHours} hrs · {c.modules?.flatMap((m) => m.lessons).length || 0} lessons
                    </div>

                    {/* Prompt 2 #2: Small stat per course: locked out (below entry level) vs eligible */}
                    {(() => {
                      const courseEnrollments = db.enrollments.filter(
                        (e) => e.courseId === c.id && e.status !== "rejected"
                      );
                      let eligible = 0;
                      let locked = 0;
                      let completed = 0;

                      courseEnrollments.forEach((e) => {
                        if (e.progress === 100 || e.status === "completed") completed++;
                        const trainee = db.trainees.find((t) => t.id === e.traineeId);
                        if (trainee && c.entryLevel) {
                          const access = canEnroll(trainee, c, undefined, traineeLevels);
                          if (access.canEnroll) {
                            eligible++;
                          } else {
                            locked++;
                          }
                        } else {
                          eligible++;
                        }
                      });

                      return (
                        <div
                          style={{
                            background: "#F1F5F9",
                            border: "1px solid #E2E8F0",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            margin: "8px 0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "11.5px",
                            flexWrap: "wrap",
                            gap: "6px",
                          }}
                        >
                          <span style={{ color: "#334155" }}>
                            <strong>{courseEnrollments.length}</strong> Enrolled ({completed} Completed)
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ color: "#166534", fontWeight: 600 }}>
                              ✓ {eligible} Eligible
                            </span>
                            {locked > 0 && (
                              <span style={{ color: "#B45309", fontWeight: 600 }}>
                                🔒 {locked} Locked out
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {c.objectives && c.objectives.length > 0 && (
                      <ul style={{ margin: "4px 0 0", paddingLeft: "18px", fontSize: "12px", color: "#475569" }}>
                        {c.objectives.slice(0, 3).map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "10px", marginTop: "6px" }}>
                    <small style={{ color: "#64748B", fontSize: "11px" }}>
                      {c.startDate} → {c.endDate}
                    </small>
                    <button
                      type="button"
                      onClick={() => handleEditCourse(c)}
                      className="btn btn-secondary btn-sm"
                      style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", padding: "4px 10px" }}
                    >
                      <Edit3 size={13} /> Edit Course
                    </button>
                  </div>
                </article>
              );
            })}

            {myCourses.length === 0 && (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748B" }}>
                No courses created yet. Use the authoring form to submit your first course proposal.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}