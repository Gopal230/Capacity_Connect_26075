import { seedDB } from "../src/data/seed";
import { DEFAULT_ROLE_REQUIREMENTS } from "../src/data/constants";
import { getRoleCompetencyRecommendations, getNextStepRecommendation, canEnroll } from "../src/utils/engine";

const db = seedDB;
const defaultLevels = {
  "u-tra1": { "Basic Meteorology": "L1", "Doppler Radar Operations": "L1", "Radar Data Interpretation": "L1", "Severe Weather Detection": "L1", "Warning Communication": "L1", "Radar Quality Control and Maintenance": "L1" },
  "ta1": { "Basic Meteorology": "L1", "Doppler Radar Operations": "L1", "Radar Data Interpretation": "L1", "Severe Weather Detection": "L1", "Warning Communication": "L1", "Radar Quality Control and Maintenance": "L1" },
  "u-tra2": { "Basic Meteorology": "L2", "Doppler Radar Operations": "L2", "Radar Data Interpretation": "L1", "Severe Weather Detection": "L1", "Warning Communication": "L1", "Radar Quality Control and Maintenance": "L1" },
  "ta2": { "Basic Meteorology": "L2", "Doppler Radar Operations": "L2", "Radar Data Interpretation": "L1", "Severe Weather Detection": "L1", "Warning Communication": "L1", "Radar Quality Control and Maintenance": "L1" },
  "u-tra3": { "Doppler Radar Operations": "L3", "Radar Data Interpretation": "L3", "Severe Weather Detection": "L3", "Basic Meteorology": "L2", "Radar Quality Control and Maintenance": "L2", "Warning Communication": "L1" },
  "ta3": { "Doppler Radar Operations": "L3", "Radar Data Interpretation": "L3", "Severe Weather Detection": "L3", "Basic Meteorology": "L2", "Radar Quality Control and Maintenance": "L2", "Warning Communication": "L1" },
};

["u-tra1", "u-tra2", "u-tra3"].forEach((uid) => {
  const user = db.users.find((u) => u.id === uid);
  const trainee = db.trainees.find((t) => t.userId === uid);
  console.log("------------------------------------------");
  console.log("User:", user?.email, `(${user?.name})`, "Role:", user?.jobRole);
  const recs = getRoleCompetencyRecommendations(trainee, db.courses, DEFAULT_ROLE_REQUIREMENTS, defaultLevels);
  const metCount = recs.filter((r) => r.status === "Met").length;
  console.log("Competencies met:", `${metCount} of ${recs.length}`);
  const nextStep = getNextStepRecommendation(recs);
  console.log("Next step:", nextStep ? `${nextStep.competency} -> ${nextStep.recommendedCourse?.title} (${nextStep.recommendedCourse?.entryLevel} to ${nextStep.recommendedCourse?.targetLevel})` : "All requirements met");

  // Test canEnroll on Advanced Radar Scanning Strategies (L2 -> L3)
  const advCourse = db.courses.find((c) => c.title.includes("Advanced Radar Scanning"));
  const check = canEnroll(trainee, advCourse, undefined, defaultLevels);
  console.log("Can enroll in Advanced Radar Scanning Strategies (L2 -> L3)?", check.canEnroll, check.reason || "(Allowed)");
});

// Edge Case 1: Trainee with everything Met
console.log("------------------------------------------");
console.log("Edge Case 1: Trainee with All Met");
const allMetLevels = {
  "test-all-met": {
    "Basic Meteorology": "L2" as const,
    "Doppler Radar Operations": "L3" as const,
    "Radar Data Interpretation": "L3" as const,
    "Severe Weather Detection": "L3" as const,
    "Warning Communication": "L2" as const,
    "Radar Quality Control and Maintenance": "L2" as const,
  }
};
const dummyTrainee = { id: "test-all-met", userId: "test-all-met", name: "Master Forecaster", role: "Radar Operator", jobRole: "Radar Operator" };
const allMetRecs = getRoleCompetencyRecommendations(dummyTrainee as any, db.courses, DEFAULT_ROLE_REQUIREMENTS, allMetLevels);
const allMetCount = allMetRecs.filter((r) => r.status === "Met").length;
console.log("All met test: met =", `${allMetCount} of ${allMetRecs.length}`);
console.log("Next step recommendation:", getNextStepRecommendation(allMetRecs) || "null (Congratulations state)");

// Edge Case 2: User with no job role or no requirements
console.log("------------------------------------------");
console.log("Edge Case 2: User with no job role");
const noRoleTrainee = { id: "test-no-role", userId: "test-no-role", name: "Guest User", role: "", jobRole: "" };
const noRoleRecs = getRoleCompetencyRecommendations(noRoleTrainee as any, db.courses, DEFAULT_ROLE_REQUIREMENTS, defaultLevels);
console.log("No role recommendations count:", noRoleRecs.length);

