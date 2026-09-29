import { seedDB } from "../src/data/seed.ts";
import { DEFAULT_ROLE_REQUIREMENTS } from "../src/data/constants.ts";
import { getRoleCompetencyRecommendations, getNextStepRecommendation, canEnroll } from "../src/utils/engine.ts";

console.log("=================================================");
console.log("PROMPT 3: RECOMMENDATION LOGIC VERIFICATION CHECKS");
console.log("=================================================\n");

const db = seedDB;
const roleRequirements = DEFAULT_ROLE_REQUIREMENTS;

// 1. trainee@test.com (All L1)
const trainee1 = db.trainees.find(t => t.userId === "u-tra1");
const levels1 = { [trainee1.id]: {} }; // Default L1
const recs1 = getRoleCompetencyRecommendations(trainee1, db.courses, roleRequirements, levels1);
const next1 = getNextStepRecommendation(recs1);

console.log("--- 1. trainee@test.com (New Joiner / All L1) ---");
console.log("User Job Role:", trainee1.jobRole);
console.log("Recommendations Count:", recs1.length);
console.table(recs1.map(r => ({
  Competency: r.competency,
  Current: r.currentLevel,
  Required: r.requiredLevel,
  Gap: r.gap,
  Status: r.status,
  RecommendedCourse: r.recommendedCourse ? `${r.recommendedCourse.title} (${r.recommendedCourse.entryLevel}->${r.recommendedCourse.targetLevel})` : "None"
})));
console.log("getNextStep():", next1 ? `${next1.recommendedCourse?.title} for ${next1.competency} (Gap: ${next1.gap})` : "None");

// canEnroll test for trainee1
const courseL1toL2 = db.courses.find(c => c.id === "c-dop-rad-basics");
const courseL2toL3 = db.courses.find(c => c.id === "c-adv-scan-strat");
console.log("canEnroll(c-dop-rad-basics, entry L1):", canEnroll(trainee1, courseL1toL2, "L1"));
console.log("canEnroll(c-adv-scan-strat, entry L2):", canEnroll(trainee1, courseL2toL3, "L1"));

// 2. trainee2@test.com (Mid-level: L2 in Basic Met & Doppler Radar Ops)
const trainee2 = db.trainees.find(t => t.userId === "u-tra2");
const levels2 = { [trainee2.id]: { "Basic Meteorology": "L2", "Doppler Radar Operations": "L2" } };
const recs2 = getRoleCompetencyRecommendations(trainee2, db.courses, roleRequirements, levels2);
const next2 = getNextStepRecommendation(recs2);

console.log("\n--- 2. trainee2@test.com (Mid-Level: L2 in 2 Competencies) ---");
console.log("User Job Role:", trainee2.jobRole);
console.table(recs2.map(r => ({
  Competency: r.competency,
  Current: r.currentLevel,
  Required: r.requiredLevel,
  Gap: r.gap,
  Status: r.status,
  RecommendedCourse: r.recommendedCourse ? `${r.recommendedCourse.title} (${r.recommendedCourse.entryLevel}->${r.recommendedCourse.targetLevel})` : "None"
})));
console.log("getNextStep():", next2 ? `${next2.recommendedCourse?.title} for ${next2.competency} (Gap: ${next2.gap})` : "None");

// 3. trainee3@test.com (Nearly ready: L3 in 3 comps, L2 in 2 comps, L1 in Warning Comm)
const trainee3 = db.trainees.find(t => t.userId === "u-tra3");
const levels3 = {
  [trainee3.id]: {
    "Doppler Radar Operations": "L3",
    "Radar Data Interpretation": "L3",
    "Severe Weather Detection": "L3",
    "Basic Meteorology": "L2",
    "Radar Quality Control and Maintenance": "L2",
    "Warning Communication": "L1"
  }
};
const recs3 = getRoleCompetencyRecommendations(trainee3, db.courses, roleRequirements, levels3);
const next3 = getNextStepRecommendation(recs3);

console.log("\n--- 3. trainee3@test.com (Nearly Ready: 5 Met, 1 Gap) ---");
console.log("User Job Role:", trainee3.jobRole);
console.table(recs3.map(r => ({
  Competency: r.competency,
  Current: r.currentLevel,
  Required: r.requiredLevel,
  Gap: r.gap,
  Status: r.status,
  RecommendedCourse: r.recommendedCourse ? `${r.recommendedCourse.title} (${r.recommendedCourse.entryLevel}->${r.recommendedCourse.targetLevel})` : "None"
})));
console.log("getNextStep():", next3 ? `${next3.recommendedCourse?.title} for ${next3.competency} (Gap: ${next3.gap})` : "None");

// 4. User with no role or role with no requirements
console.log("\n--- 4. User With No Role / No Requirements ---");
const userNoRole = { id: "u-norole", userId: "u-norole", name: "Guest User", jobRole: undefined, role: undefined };
const recsNoRole = getRoleCompetencyRecommendations(userNoRole as any, db.courses, roleRequirements, {});
console.log("Recommendations for user with no role:", recsNoRole);
console.log("getNextStep() for user with no role:", getNextStepRecommendation(recsNoRole));

// 5. Case where no course exists for a required competency
console.log("\n--- 5. Case Where No Course Exists for Competency ---");
const mockRoleReqs = {
  "Satellite Specialist": {
    "Satellite Remote Sensing": "L3",
  }
};
const traineeMock = { id: "u-mock", userId: "u-mock", name: "Satellite Officer", jobRole: "Satellite Specialist" };
const recsNoCourse = getRoleCompetencyRecommendations(traineeMock as any, db.courses, mockRoleReqs as any, {});
console.table(recsNoCourse.map(r => ({
  Competency: r.competency,
  Current: r.currentLevel,
  Required: r.requiredLevel,
  Status: r.status,
  RecommendedCourse: r.recommendedCourse ? r.recommendedCourse.title : "None",
  ReasonMessage: r.reasonMessage
})));

console.log("\n=================================================");
console.log("ALL PROMPT 3 CONSOLE CHECKS COMPLETED SUCCESSFULLY");
console.log("=================================================");
