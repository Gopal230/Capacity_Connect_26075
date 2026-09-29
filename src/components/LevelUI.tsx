import { ArrowRight, CheckCircle2, Info, Lock, Sparkles, Trophy } from "lucide-react";
import React from "react";
import { COMPETENCY_LEVELS } from "../data/constants";
import { CompetencyLevel } from "../types";
import { formatLevel, getLevelNumber } from "../utils/engine";

// Helper to normalize input level to CompetencyLevel (e.g. 2 -> "L2", "L2" -> "L2")
export function toLevel(levelInput: number | string | undefined): CompetencyLevel {
  if (typeof levelInput === "number") {
    return formatLevel(levelInput);
  }
  return formatLevel(getLevelNumber(levelInput || "L1"));
}

/* =========================================================
   1. LEVEL BADGE
   "L2 Working" with level number & name, small and normal
   ========================================================= */
export function LevelBadge({
  level,
  size = "normal",
  className = "",
}: {
  level: number | string | undefined;
  size?: "sm" | "normal";
  className?: string;
}) {
  const lvl = toLevel(level);
  const def = COMPETENCY_LEVELS[lvl] || { fullName: `${lvl}`, name: lvl };
  const sizeClass = size === "sm" ? "level-badge-sm" : "level-badge-normal";

  return (
    <span
      className={`level-badge level-badge-${lvl.toLowerCase()} ${sizeClass} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        gap: "5px",
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      <span className="level-code" style={{ whiteSpace: "nowrap", fontWeight: 700 }}>{lvl}</span>
      <span className="level-name" style={{ whiteSpace: "nowrap" }}>{def.name}</span>
    </span>
  );
}

/* =========================================================
   2. LEVEL JUMP BADGE
   "L1 to L2" with an arrow - ALWAYS strictly horizontal single line
   ========================================================= */
export function LevelJumpBadge({
  from,
  to,
  size = "normal",
  className = "",
}: {
  from: number | string;
  to: number | string;
  size?: "sm" | "normal";
  className?: string;
}) {
  const fromLvl = toLevel(from);
  const toLvl = toLevel(to);
  const sizeClass = size === "sm" ? "level-jump-sm" : "level-jump-normal";

  return (
    <span
      className={`level-jump-badge ${sizeClass} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        gap: "4px",
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      <span className="jump-from" style={{ whiteSpace: "nowrap", fontWeight: 700 }}>{fromLvl}</span>
      <ArrowRight size={size === "sm" ? 12 : 14} className="jump-arrow" style={{ flexShrink: 0, display: "inline-block" }} />
      <span className="jump-to" style={{ whiteSpace: "nowrap", fontWeight: 700 }}>{toLvl}</span>
    </span>
  );
}

/* =========================================================
   3. LEVEL PATH BAR
   5 connected steps, filled to current level, distinct marker on required,
   steps > L3 drawn lighter with "coming soon" tooltip.
   ========================================================= */
export function LevelPathBar({
  currentLevel,
  requiredLevel,
  compact = false,
}: {
  currentLevel: number | string;
  requiredLevel: number | string;
  compact?: boolean;
}) {
  const currentRank = getLevelNumber(toLevel(currentLevel));
  const requiredRank = getLevelNumber(toLevel(requiredLevel));

  return (
    <div className={`level-path-bar ${compact ? "compact" : ""}`}>
      {[1, 2, 3, 4, 5].map((lvlNum) => {
        const lvlKey = `L${lvlNum}` as CompetencyLevel;
        const isFilled = lvlNum <= currentRank;
        const isRequired = lvlNum === requiredRank;
        const isComingSoon = lvlNum > 3;

        let stepClass = "step";
        if (isFilled) stepClass += " filled";
        if (isFilled && currentRank >= requiredRank) stepClass += " met";
        if (isRequired) stepClass += " required-target";
        if (isComingSoon) stepClass += " coming-soon";

        return (
          <div
            key={lvlNum}
            className={`path-step ${stepClass}`}
            title={isComingSoon ? `${lvlKey} (Coming soon)` : `${lvlKey} ${COMPETENCY_LEVELS[lvlKey]?.name}`}
          >
            <span className="step-label">{lvlKey}</span>
            {!compact && <span className="step-name">{COMPETENCY_LEVELS[lvlKey]?.name}</span>}

            {isRequired && (
              <span className="required-pin" title={`Required level: ${lvlKey}`}>
                REQ
              </span>
            )}

            {isComingSoon && !compact && (
              <span className="soon-tag">Soon</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   4. STATUS BADGES
   Met (green), Gap (orange), No course yet (grey), Locked (grey with lock)
   ========================================================= */
export function StatusBadge({
  status,
  size = "normal",
}: {
  status: "Met" | "Gap" | "no-course" | "locked";
  size?: "sm" | "normal";
}) {
  if (status === "Met") {
    return (
      <span className={`status-badge status-met ${size}`}>
        <CheckCircle2 size={size === "sm" ? 13 : 15} />
        <span>Requirement Met</span>
      </span>
    );
  }
  if (status === "Gap") {
    return (
      <span className={`status-badge status-gap ${size}`}>
        <Sparkles size={size === "sm" ? 13 : 15} />
        <span>Gap to Close</span>
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span className={`status-badge status-locked ${size}`}>
        <Lock size={size === "sm" ? 12 : 14} />
        <span>Locked Prerequisite</span>
      </span>
    );
  }
  return (
    <span className={`status-badge status-no-course ${size}`}>
      <Info size={size === "sm" ? 13 : 15} />
      <span>No course yet</span>
    </span>
  );
}

/* =========================================================
   5. COMPETENCY CARD / ROW
   Name, level path bar, current & required badges, status
   ========================================================= */
export function CompetencyCardRow({
  name,
  currentLevel,
  requiredLevel,
  status,
  recommendedCourseTitle,
}: {
  name: string;
  currentLevel: number | string;
  requiredLevel: number | string;
  status: "Met" | "Gap" | "no-course" | "locked";
  recommendedCourseTitle?: string | null;
}) {
  return (
    <div className="competency-card-row">
      <div className="competency-row-header">
        <h4 className="competency-row-name">{name}</h4>
        <StatusBadge status={status} size="sm" />
      </div>

      <div className="competency-row-body">
        <div className="competency-row-badges">
          <div className="badge-item">
            <span className="badge-label">Current:</span>
            <LevelBadge level={currentLevel} size="sm" />
          </div>
          <div className="badge-item">
            <span className="badge-label">Required:</span>
            <LevelBadge level={requiredLevel} size="sm" />
          </div>
        </div>

        <div className="competency-row-path">
          <LevelPathBar currentLevel={currentLevel} requiredLevel={requiredLevel} compact={true} />
        </div>
      </div>

      {recommendedCourseTitle && (
        <div className="competency-row-course">
          <span className="course-label">Recommended:</span>
          <strong className="course-name">{recommendedCourseTitle}</strong>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   6. EMPTY / MESSAGE STATES
   "No role requirements set", "No course available yet", "All requirements met"
   ========================================================= */
export function LevelEmptyState({
  type,
  message,
}: {
  type: "no-requirements" | "no-course" | "all-met";
  message?: string;
}) {
  if (type === "all-met") {
    return (
      <div className="level-empty-state state-all-met">
        <div className="state-icon green"><Trophy size={28} /></div>
        <h3>All Role Competency Requirements Met</h3>
        <p>{message || "You have achieved or exceeded all required competency levels for your current operational role. You are cleared for duty certification."}</p>
      </div>
    );
  }

  if (type === "no-course") {
    return (
      <div className="level-empty-state state-no-course">
        <div className="state-icon grey"><Info size={28} /></div>
        <h3>No Course Available Yet</h3>
        <p>{message || "The syllabus for this competency level is currently under accreditation by the Central Training Directorate."}</p>
      </div>
    );
  }

  return (
    <div className="level-empty-state state-no-requirements">
      <div className="state-icon blue"><Info size={28} /></div>
      <h3>No Role Requirements Set</h3>
      <p>{message || "Your profile currently does not have required competency benchmarks assigned. Contact your station administrator."}</p>
    </div>
  );
}
