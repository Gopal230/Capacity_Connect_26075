import { CompetencyItem, CompetencyLevel, Level, LevelDefinition, RoleRequirementsMap } from "../types";

export const KEYS = {
  SCHEMA_VERSION: "cc_schema_version",
  DB: "cc_database_v7",
  SESSION: "cc_session_v1",
  ROLE_REQUIREMENTS: "cc_role_requirements",
  TRAINEE_LEVELS: "cc_trainee_levels",
  CERTIFICATES: "cc_certificates_v1",
  TRAINER_EXPERTISE: "cc_trainer_expertise_v2",
};

export const CURRENT_SCHEMA_VERSION = "10.0.0";

export const COMPETENCY_LEVELS: Record<CompetencyLevel, LevelDefinition> = {
  L1: { level: "L1", code: "L1", name: "Awareness", fullName: "L1 Awareness", rank: 1 },
  L2: { level: "L2", code: "L2", name: "Working", fullName: "L2 Working", rank: 2 },
  L3: { level: "L3", code: "L3", name: "Proficient", fullName: "L3 Proficient", rank: 3 },
  L4: { level: "L4", code: "L4", name: "Advanced", fullName: "L4 Advanced", rank: 4 },
  L5: { level: "L5", code: "L5", name: "Expert", fullName: "L5 Expert", rank: 5 },
};

export const IMD_RADAR_COMPETENCIES: CompetencyItem[] = [
  { id: "basic-meteorology", name: "Basic Meteorology", description: "Atmospheric thermodynamics, wind circulation, and frontal analysis." },
  { id: "doppler-radar-operations", name: "Doppler Radar Operations", description: "Hardware operations, beam parameters, PRF, and volume scan strategies." },
  { id: "radar-data-interpretation", name: "Radar Data Interpretation", description: "Reflectivity (dBZ), radial velocity, spectral width, and signature diagnostics." },
  { id: "severe-weather-detection", name: "Severe Weather Detection", description: "Thunderstorm dynamics, convective storms, squall lines, and tropical cyclones." },
  { id: "warning-communication", name: "Warning Communication", description: "Standardized IMD alert bulletins, nowcast briefings, and disaster response coordination." },
  { id: "radar-quality-control-and-maintenance", name: "Radar Quality Control and Maintenance", description: "Clutter identification, AP mitigation, blockage diagnostics, and calibration." },
];

export const DEFAULT_ROLE_REQUIREMENTS: RoleRequirementsMap = {
  "Radar Operator": {
    "Basic Meteorology": "L2",
    "Doppler Radar Operations": "L3",
    "Radar Data Interpretation": "L3",
    "Severe Weather Detection": "L3",
    "Warning Communication": "L2",
    "Radar Quality Control and Maintenance": "L2",
  },
};

/**
 * Derive course difficulty label strictly from entry and target levels.
 * L1 to L2 = Beginner
 * L2 to L3 = Intermediate
 * L3 and above = Advanced
 */
export function deriveDifficulty(entryLevel?: CompetencyLevel, targetLevel?: CompetencyLevel): Level {
  if (!entryLevel || !targetLevel) return "Beginner";
  const entryNum = Number(entryLevel.replace("L", "")) || 1;
  const targetNum = Number(targetLevel.replace("L", "")) || 2;

  if (entryNum >= 3 || targetNum >= 4) {
    return "Advanced";
  }
  if (entryNum === 2 || targetNum === 3) {
    return "Intermediate";
  }
  return "Beginner";
}

/**
 * Helper to ensure level is strictly within L1 to L5 and never lowers.
 */
export function sanitizeLevel(level: string | undefined): CompetencyLevel {
  if (!level) return "L1";
  const num = Number(level.replace(/[^0-9]/g, ""));
  if (isNaN(num) || num <= 1) return "L1";
  if (num === 2) return "L2";
  if (num === 3) return "L3";
  if (num === 4) return "L4";
  return "L5";
}
