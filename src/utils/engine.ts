import { CompetencyLevel, Course, CourseAccessCheck, DB, Level, LevelRecommendation, RoleCompetencyRequirement, Trainee, TraineeCompetency, Trainer } from "../types";

export const levelRank: Record<Level, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };

export interface MatchBreakdown {
  key: string;
  label: string;
  points: number;
  max: number;
  explanation: string;
}

export interface Recommendation {
  course: Course;
  trainer?: Trainer;
  match: number;
  reasons: string[];
  breakdown: MatchBreakdown[];
}

export interface ReadinessSnapshot {
  score: number;
  band: "Needs Development" | "Developing" | "Operationally Ready" | "High Readiness";
  competency: number;
  learning: number;
  assessment: number;
  evidence: number;
  scenario: number;
}

export function levelFromScore(score: number): Level {
  if (score >= 75) return "Advanced";
  if (score >= 50) return "Intermediate";
  return "Beginner";
}

export function gapText(current: Level, required: Level) {
  if (levelRank[current] >= levelRank[required]) return "Required level met";
  if (current === "Beginner" && required === "Advanced") return "Intermediate to Advanced development required";
  return `${current} → ${required}`;
}

export function recommend(db: DB, subject: string, current: Level, required: Level): Recommendation[] {
  const courses = db.courses.filter(c => c.status === "published" && c.subject === subject);
  return courses.map(course => {
    const trainer = db.trainers.find(t => t.id === course.trainerId);
    const trainerCourses = db.courses.filter(c => c.trainerId === trainer?.id).map(c => c.id);
    const activeLoad = db.enrollments.filter(e => trainerCourses.includes(e.courseId) && ["approved","requested"].includes(e.status)).length;
    const breakdown: MatchBreakdown[] = [];

    const exact = course.subject === subject ? 30 : 0;
    breakdown.push({key:"subject", label:"Competency alignment", points:exact, max:30, explanation:exact ? `Exact match for ${subject}` : "Partial subject match"});

    const targetFit = levelRank[course.level] >= levelRank[current] && levelRank[course.level] <= levelRank[required] ? 15 : 8;
    breakdown.push({key:"level", label:"Learning-level fit", points:targetFit, max:15, explanation:`Course ${course.level}; current ${current}; target ${required}`});

    const expertise = trainer?.subjects.includes(subject) ? 15 : trainer?.skills.some(s=>s.toLowerCase().includes(subject.toLowerCase())) ? 10 : 4;
    breakdown.push({key:"expertise", label:"Trainer expertise", points:expertise, max:15, explanation:trainer?.subjects.includes(subject)?"Subject listed in verified trainer profile":"Related trainer expertise"});

    const verified = trainer?.verified ? 12 : 0;
    breakdown.push({key:"verified", label:"Verification trust", points:verified, max:12, explanation:trainer?.verified?"Admin-verified qualification and expertise":"Trainer verification pending"});

    const rating = trainer ? Math.round(Math.min(10,(trainer.rating/5)*10)) : 0;
    breakdown.push({key:"rating", label:"Training quality", points:rating, max:10, explanation:trainer?`${trainer.rating.toFixed(1)}/5 historical rating`:"No rating available"});

    const availability = trainer?.availability === "Available" ? 10 : trainer?.availability === "Limited" ? 6 : 1;
    breakdown.push({key:"availability", label:"Availability", points:availability, max:10, explanation:trainer?`${trainer.availability} for current cycle`:"Availability unknown"});

    const load = activeLoad <= 3 ? 8 : activeLoad <= 6 ? 5 : 2;
    breakdown.push({key:"load", label:"Trainer load balance", points:load, max:8, explanation:`${activeLoad} active/requested learners across assigned courses`});

    const match = Math.min(98, breakdown.reduce((sum,b)=>sum+b.points,0));
    const reasons = breakdown.filter(b=>b.points >= b.max*.7).map(b=>b.explanation).slice(0,5);
    return { course, trainer, match, reasons, breakdown };
  }).sort((a,b)=>b.match-a.match);
}

export function assessmentImprovement(db:DB, traineeId:string, courseId:string){
  const pre=db.assessments.find(a=>a.courseId===courseId&&a.type==="pre");
  const post=db.assessments.find(a=>a.courseId===courseId&&a.type==="post");
  const best=(assessmentId?:string)=>assessmentId?Math.max(0,...db.attempts.filter(a=>a.traineeId===traineeId&&a.assessmentId===assessmentId).map(a=>a.score)):0;
  const preScore=best(pre?.id);const postScore=best(post?.id);
  return {pre:preScore,post:postScore,delta:postScore&&preScore?postScore-preScore:0};
}

export function operationalReadiness(db:DB, traineeId:string):ReadinessSnapshot{
  const latest=[...db.competencyResults].filter(r=>r.traineeId===traineeId).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
  const competency=Math.round((latest?.score||0)*.30);

  const enrollments=db.enrollments.filter(e=>e.traineeId===traineeId&&e.status!=="rejected");
  const avgProgress=enrollments.length?enrollments.reduce((s,e)=>s+e.progress,0)/enrollments.length:0;
  const learning=Math.round(avgProgress*.15);

  const postIds=db.assessments.filter(a=>a.type==="post").map(a=>a.id);
  const postAttempts=db.attempts.filter(a=>a.traineeId===traineeId&&postIds.includes(a.assessmentId));
  const bestPost=postAttempts.length?Math.max(...postAttempts.map(a=>a.score)):0;
  const assessment=Math.round(bestPost*.25);

  const evidenceCount=db.evidence.filter(e=>e.traineeId===traineeId).length;
  const verifiedEvidence=db.evidence.filter(e=>e.traineeId===traineeId&&e.status==="verified").length;
  const evidence=Math.round((evidenceCount?verifiedEvidence/evidenceCount:0)*15);

  const scenarios=db.scenarioAttempts.filter(a=>a.traineeId===traineeId);
  const bestScenario=scenarios.length?Math.max(...scenarios.map(a=>a.score)):0;
  const scenario=Math.round(bestScenario*.15);

  const score=Math.min(100,competency+learning+assessment+evidence+scenario);
  const band:ReadinessSnapshot["band"]=score>=85?"High Readiness":score>=70?"Operationally Ready":score>=45?"Developing":"Needs Development";
  return {score,band,competency,learning,assessment,evidence,scenario};
}

export function trainingImpact(db:DB){
  const completed=db.enrollments.filter(e=>e.status==="completed");
  const deltas=completed.map(e=>assessmentImprovement(db,e.traineeId,e.courseId).delta).filter(x=>x!==0);
  const avgDelta=deltas.length?Math.round(deltas.reduce((a,b)=>a+b,0)/deltas.length):0;
  const verified=db.evidence.filter(e=>e.status==="verified").length;
  const evidenceRate=db.evidence.length?Math.round(verified/db.evidence.length*100):0;
  const ready=db.trainees.filter(t=>operationalReadiness(db,t.id).score>=70).length;
  const readinessRate=db.trainees.length?Math.round(ready/db.trainees.length*100):0;
  return {avgDelta,evidenceRate,readinessRate,verified};
}

/* =========================================================
   TRAINEE LEVEL-BASED COURSE RECOMMENDATION SYSTEM
   ========================================================= */

export const roleRequirements: Record<string, RoleCompetencyRequirement[]> = {
  "Weather Forecaster": [
    { competency: "Radar Interpretation", requiredLevel: "L3" },
    { competency: "Synoptic Forecasting", requiredLevel: "L3" },
    { competency: "Satellite Meteorology", requiredLevel: "L2" }
  ],
  "Aviation Forecaster": [
    { competency: "Aviation Meteorology", requiredLevel: "L3" },
    { competency: "METAR/TAF Interpretation", requiredLevel: "L3" },
    { competency: "Radar Interpretation", requiredLevel: "L2" }
  ],
  "Radar Operator": [
    { competency: "Radar Interpretation", requiredLevel: "L3" },
    { competency: "Doppler Radar Analysis", requiredLevel: "L3" }
  ]
};

export function getLevelNumber(level: string | undefined): number {
  if (!level) return 1;
  const num = Number(level.replace(/[^0-9]/g, ""));
  return isNaN(num) || num <= 0 ? 1 : num;
}

export function getLevelBasedRecommendations(trainee: Trainee, courses: Course[]): LevelRecommendation[] {
  const recommendations: LevelRecommendation[] = [];
  const competencies = trainee.competencies && trainee.competencies.length > 0 
    ? trainee.competencies 
    : [
        { name: "Radar Interpretation", currentLevel: "L1" as CompetencyLevel, targetLevel: "L3" as CompetencyLevel, lastAssessmentScore: 45 },
        { name: "Synoptic Forecasting", currentLevel: "L2" as CompetencyLevel, targetLevel: "L3" as CompetencyLevel, lastAssessmentScore: 68 },
        { name: "Satellite Meteorology", currentLevel: "L2" as CompetencyLevel, targetLevel: "L2" as CompetencyLevel, lastAssessmentScore: 75 }
      ];

  competencies.forEach((skill) => {
    const currentLevel = getLevelNumber(skill.currentLevel);
    const targetLevel = getLevelNumber(skill.targetLevel);

    // If trainee already reached the required level, do not force another course
    if (currentLevel >= targetLevel) {
      recommendations.push({
        competency: skill.name,
        currentLevel: skill.currentLevel,
        targetLevel: skill.targetLevel,
        gap: 0,
        status: "target-achieved",
        message: "You have reached the required level for your role."
      });
      return;
    }

    // Find only the immediate next course, not an advanced course
    const nextCourse = courses.find((course) => {
      const courseEntryLevel = getLevelNumber(course.entryLevel || "L1");
      const courseTargetLevel = getLevelNumber(course.targetLevel || "L2");

      return (
        (course.competency === skill.name || course.subject === skill.name) &&
        courseEntryLevel === currentLevel &&
        courseTargetLevel === currentLevel + 1 &&
        course.status === "published"
      );
    });

    if (nextCourse) {
      recommendations.push({
        competency: skill.name,
        currentLevel: skill.currentLevel,
        targetLevel: skill.targetLevel,
        gap: targetLevel - currentLevel,
        status: "recommended",
        recommendedCourse: nextCourse
      });
    } else {
      recommendations.push({
        competency: skill.name,
        currentLevel: skill.currentLevel,
        targetLevel: skill.targetLevel,
        gap: targetLevel - currentLevel,
        status: "no-course-found",
        message: "No suitable next-level course is available yet."
      });
    }
  });

  return recommendations;
}

export function checkCourseAccess(
  traineeCompetency: TraineeCompetency | undefined,
  selectedCourse: Course,
  courses: Course[]
): CourseAccessCheck {
  const currentLevelStr = traineeCompetency?.currentLevel || "L1";
  const traineeLevel = getLevelNumber(currentLevelStr);
  const requiredLevelStr = selectedCourse.entryLevel || "L1";
  const requiredLevel = getLevelNumber(requiredLevelStr);

  // Trainee can enroll if current level matches or is above entry level
  if (traineeLevel >= requiredLevel) {
    return {
      canEnroll: true,
      status: "available",
      message: "You are eligible for this course.",
      recommendedCourse: null
    };
  }

  // Find the exact course trainee should complete first
  const foundationCourse = courses.find((course) => {
    const courseEntryLevel = getLevelNumber(course.entryLevel || "L1");
    const courseTargetLevel = getLevelNumber(course.targetLevel || "L2");

    return (
      (course.competency === selectedCourse.competency || course.subject === selectedCourse.subject) &&
      courseEntryLevel === traineeLevel &&
      courseTargetLevel === traineeLevel + 1 &&
      course.status === "published"
    );
  });

  return {
    canEnroll: false,
    status: "locked",
    message: `${selectedCourse.title} requires Level ${selectedCourse.entryLevel || "L1"}. Your current level is ${currentLevelStr}.`,
    recommendedCourse: foundationCourse || null
  };
}

export function updateLevelAfterAssessment(
  traineeCompetency: TraineeCompetency,
  completedCourse: Course,
  assessmentScore: number
) {
  const passMark = 60;

  // Do not update level if trainee fails
  if (assessmentScore < passMark) {
    return {
      updated: false,
      newLevel: traineeCompetency.currentLevel,
      message: "You did not pass the assessment. Please revise the material and try again."
    };
  }

  // Update only to the completed course's target level (L1 -> L2, even if 95%)
  const newLevel = completedCourse.targetLevel || "L2";
  traineeCompetency.currentLevel = newLevel;
  traineeCompetency.lastAssessmentScore = assessmentScore;
  traineeCompetency.updatedAt = new Date().toISOString().slice(0, 10);

  return {
    updated: true,
    newLevel,
    message: `Congratulations! You achieved ${newLevel}. The next-level course is now unlocked.`
  };
}

