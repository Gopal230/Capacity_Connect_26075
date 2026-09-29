import React, { useState } from "react";

const scenario = {
  title: "Thunderstorm Nowcasting Simulation",
  course: "Doppler Radar Meteorology",
  difficulty: "Advanced",
  duration: "10 min",
  description:
    "A convective thunderstorm cell is developing rapidly near a high-density urban sector. Review the Doppler radar reflectivity trends, storm vectors, and decide the appropriate operational protocol.",
  observations: [
    { time: "14:00 IST", reflectivity: "32 dBZ", movement: "North-East (24 km/h)", echoTop: "7.2 km" },
    { time: "14:10 IST", reflectivity: "41 dBZ", movement: "North-East (28 km/h)", echoTop: "9.8 km" },
    { time: "14:20 IST", reflectivity: "48 dBZ", movement: "North-East (32 km/h)", echoTop: "12.4 km" }
  ],
  questions: [
    {
      title: "Analyze Doppler Radar Reflectivity",
      question:
        "The radar reflectivity has increased from 32 dBZ to 48 dBZ over the last 20 minutes with surging echo tops. What should you do first?",
      options: [
        "Disregard the increase as anomalous propagation clutter",
        "Monitor storm cell intensification rate, VIL trends, and projected track trajectory",
        "Immediately declare the storm cell harmless and archive the sweep"
      ],
      answer: 1,
      explanation:
        "Surging reflectivity past 45 dBZ with rising echo tops indicates vigorous convective updraft. Continuous tracking and trend analysis is mandatory."
    },
    {
      title: "Assess Vector Movement & Population Vulnerability",
      question:
        "The convective storm cell is tracking directly toward a populated metropolitan zone. Which multi-source parameters should you evaluate before issuing a severe weather alert?",
      options: [
        "Only the surface ambient temperature",
        "Radar velocity azimuth displays, storm motion vectors, lightning density, and AWS surface gusts",
        "Only yesterday's synoptic climatology summary"
      ],
      answer: 1,
      explanation:
        "Operational nowcasting requires multi-sensor cross-validation including Doppler radial velocity, lightning strikes, and automatic weather station telemetry."
    },
    {
      title: "Operational Alert Decision",
      question:
        "The thunderstorm cell continues to intensify to severe threshold and is within 15 minutes of urban landfall. What is the immediate operational action?",
      options: [
        "Terminate radar scan and await post-event rain gauge data",
        "Trigger the Nowcasting Severe Weather Bulletin and notify State Disaster Management Authority (SDMA)",
        "Wait until the convective core passes completely before logging observations"
      ],
      answer: 1,
      explanation:
        "Prompt dissemination of Nowcast Warning Bulletins to emergency response agencies is critical for life and asset protection."
    }
  ]
};

export default function PracticalAssessmentLab({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const question = scenario.questions[current];
  const score = answers.filter(
    (answer, index) => answer === scenario.questions[index].answer
  ).length;

  const percentage = Math.round((score / scenario.questions.length) * 100);
  const passed = percentage >= 70;

  function submitAnswer() {
    if (selected === null) return;
    const updatedAnswers = [...answers];
    updatedAnswers[current] = selected;
    setAnswers(updatedAnswers);
  }

  function nextQuestion() {
    if (current < scenario.questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setFinished(true);
      if (onComplete) onComplete({ score: percentage, passed });
    }
  }

  function restart() {
    setStarted(false);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  }

  const submitted = answers[current] !== undefined;

  return (
    <div className="practical-lab-container" style={{
      background: "#0E1726",
      border: "1px solid #1B2A44",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
      fontFamily: "inherit",
      color: "#CBD5E1"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1B2A44",
        paddingBottom: "16px",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span style={{
              display: "inline-block",
              background: "#241114",
              color: "#F87171",
              border: "1px solid #4C1D24",
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: "4px",
              letterSpacing: "0.5px",
              marginBottom: "6px"
            }}>
              {scenario.course} · {scenario.difficulty}
            </span>
            <h2 style={{ margin: "4px 0", fontSize: "20px", fontWeight: "700", color: "#F8FAFC" }}>
              {scenario.title}
            </h2>
            <p style={{ margin: 0, color: "#8899B0", fontSize: "14px" }}>
              {scenario.description}
            </p>
          </div>
          <div style={{
            background: "#142034",
            border: "1px solid #1B2A44",
            borderRadius: "8px",
            padding: "8px 14px",
            textAlign: "right"
          }}>
            <span style={{ fontSize: "11px", color: "#8899B0", textTransform: "uppercase", fontWeight: "600" }}>Est. Duration</span>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#F8FAFC" }}>{scenario.duration}</div>
          </div>
        </div>
      </div>

      {!started ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {/* Section 1: Radar Observations (Vertical Block 1) */}
          <div style={{
            background: "#080E18",
            border: "1px solid #1B2A44",
            borderRadius: "8px",
            padding: "16px"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#F8FAFC", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#F87171" }}>●</span> Doppler Radar Observation Series
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#142034", color: "#F8FAFC", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px", borderRadius: "4px 0 0 0" }}>Time</th>
                    <th style={{ padding: "8px 12px" }}>Reflectivity (Z)</th>
                    <th style={{ padding: "8px 12px" }}>Storm Motion</th>
                    <th style={{ padding: "8px 12px", borderRadius: "0 4px 0 0" }}>Echo Top</th>
                  </tr>
                </thead>
                <tbody>
                  {scenario.observations.map((obs, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1B2A44", background: i % 2 === 0 ? "#0E1726" : "#080E18" }}>
                      <td style={{ padding: "8px 12px", fontWeight: "600", color: "#F8FAFC" }}>{obs.time}</td>
                      <td style={{ padding: "8px 12px", color: i === 2 ? "#F87171" : "#CBD5E1", fontWeight: i === 2 ? "700" : "500" }}>
                        {obs.reflectivity}
                      </td>
                      <td style={{ padding: "8px 12px", color: "#8899B0" }}>{obs.movement}</td>
                      <td style={{ padding: "8px 12px", color: "#8899B0" }}>{obs.echoTop}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Instructions & Start (Vertical Block 2) */}
          <div style={{
            background: "#142034",
            border: "1px solid #1B2A44",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#F8FAFC" }}>
              Simulation Briefing & Objectives
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "#8899B0", lineHeight: "1.5" }}>
              Evaluate progressive radar sweeps, recognize rapid storm cell intensification triggers, and execute operational nowcasting decisions under standard IMD operational protocols.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setStarted(true)}
                style={{
                  background: "#991B1B",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 8px rgba(153, 27, 27, 0.45)"
                }}
              >
                Launch Decision Simulation →
              </button>
            </div>
          </div>
        </div>
      ) : finished ? (
        /* Results Section */
        <div style={{
          background: passed ? "#0C2417" : "#241114",
          border: `1px solid ${passed ? "#164E33" : "#4C1D24"}`,
          borderRadius: "8px",
          padding: "24px",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "42px",
            fontWeight: "800",
            color: passed ? "#34D399" : "#F87171",
            marginBottom: "8px"
          }}>
            {percentage}%
          </div>
          <h3 style={{ margin: "0 0 8px 0", color: passed ? "#34D399" : "#F87171", fontSize: "18px", fontWeight: "700" }}>
            {passed ? "Simulation Completed Successfully" : "Simulation Threshold Not Met"}
          </h3>
          <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: passed ? "#A7F3D0" : "#FECACA" }}>
            {passed
              ? `You correctly resolved ${score} out of ${scenario.questions.length} operational nowcasting decisions.`
              : `You resolved ${score} out of ${scenario.questions.length} decisions. Review Doppler meteorological principles and retry.`}
          </p>
          <button
            onClick={restart}
            style={{
              background: "#991B1B",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            Restart Simulation
          </button>
        </div>
      ) : (
        /* Question Form */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Progress Indicator */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#8899B0" }}>
            <span>Decision Step <strong style={{ color: "#F8FAFC" }}>{current + 1}</strong> of {scenario.questions.length}</span>
            <span>Score so far: <strong style={{ color: "#F8FAFC" }}>{score}</strong></span>
          </div>

          <div style={{
            background: "#080E18",
            border: "1px solid #1B2A44",
            borderRadius: "8px",
            padding: "16px"
          }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#F87171", textTransform: "uppercase" }}>
              {question.title}
            </span>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#F8FAFC", margin: "6px 0 16px 0" }}>
              {question.question}
            </h3>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {question.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const isAnswer = submitted && idx === question.answer;
                const isWrong = submitted && answers[current] === idx && idx !== question.answer;

                let optBg = "#0E1726";
                let optBorder = "#1B2A44";
                let optColor = "#CBD5E1";

                if (submitted) {
                  if (isAnswer) {
                    optBg = "#0C2417";
                    optBorder = "#164E33";
                    optColor = "#34D399";
                  } else if (isWrong) {
                    optBg = "#241114";
                    optBorder = "#4C1D24";
                    optColor = "#F87171";
                  }
                } else if (isSelected) {
                  optBg = "#241114";
                  optBorder = "#991B1B";
                  optColor = "#F8FAFC";
                }

                return (
                  <label
                    key={idx}
                    onClick={() => !submitted && setSelected(idx)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "6px",
                      border: `1.5px solid ${optBorder}`,
                      background: optBg,
                      color: optColor,
                      cursor: submitted ? "default" : "pointer",
                      fontSize: "14px",
                      fontWeight: isSelected || isAnswer ? "600" : "400",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${current}`}
                      checked={isSelected || answers[current] === idx}
                      disabled={submitted}
                      onChange={() => setSelected(idx)}
                      style={{ marginTop: "3px" }}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>

            {/* Explanation after submission */}
            {submitted && (
              <div style={{
                marginTop: "16px",
                padding: "12px",
                background: answers[current] === question.answer ? "#0C2417" : "#241114",
                border: `1px solid ${answers[current] === question.answer ? "#164E33" : "#4C1D24"}`,
                borderRadius: "6px",
                fontSize: "13px",
                color: answers[current] === question.answer ? "#34D399" : "#F87171"
              }}>
                <strong>Explanation: </strong>
                {question.explanation}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            {!submitted ? (
              <button
                onClick={submitAnswer}
                disabled={selected === null}
                style={{
                  background: selected === null ? "#1B2A44" : "#991B1B",
                  color: selected === null ? "#8899B0" : "#FFFFFF",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: selected === null ? "not-allowed" : "pointer",
                  boxShadow: selected === null ? "none" : "0 2px 8px rgba(153, 27, 27, 0.45)"
                }}
              >
                Submit Decision
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                style={{
                  background: "#991B1B",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(153, 27, 27, 0.45)"
                }}
              >
                {current < scenario.questions.length - 1 ? "Next Decision →" : "View Final Results →"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
