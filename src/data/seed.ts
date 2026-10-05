import { DB } from "../types";
import { deriveDifficulty } from "./constants";

const modules = (prefix: string) => [
  {
    id: `${prefix}-m1`,
    title: "Core Foundations & Operational Principles",
    lessons: [
      { id: `${prefix}-l1`, title: "Theoretical Foundations", type: "video" as const, durationMin: 20, resource: "Operational lecture series" },
      { id: `${prefix}-l2`, title: "IMD Standard Operating Manual", type: "pdf" as const, durationMin: 25, resource: "IMD-SOP-Guidelines.pdf" }
    ]
  },
  {
    id: `${prefix}-m2`,
    title: "Applied Field Practice & Radar Case Scenarios",
    lessons: [
      { id: `${prefix}-l3`, title: "Operational Case Diagnostics", type: "presentation" as const, durationMin: 25, resource: "CaseStudy-Analysis.pptx" },
      { id: `${prefix}-l4`, title: "Duty Forecaster Briefing Notes", type: "note" as const, durationMin: 15, resource: "Duty-Briefing-Notes" }
    ]
  }
];

export const PRACTICAL_LAB_SCENARIO: DB["scenarios"][number] = {
  id: "scenario-thunderstorm-nowcasting",
  title: "Thunderstorm Nowcasting Simulation",
  subject: "Doppler Radar Meteorology",
  role: "Radar Operator",
  context:
    "A convective thunderstorm cell is developing rapidly near a high-density urban sector. Review the radar trends and choose the appropriate operational response at each stage.",
  difficulty: "Advanced",
  passingPercentage: 70,
  durationMin: 10,
  observations: [
    { time: "14:00 IST", reflectivity: "32 dBZ", movement: "North-East (24 km/h)", echoTop: "7.2 km" },
    { time: "14:10 IST", reflectivity: "41 dBZ", movement: "North-East (28 km/h)", echoTop: "9.8 km" },
    { time: "14:20 IST", reflectivity: "48 dBZ", movement: "North-East (32 km/h)", echoTop: "12.4 km" },
  ],
  steps: [
    {
      id: "thunderstorm-reflectivity",
      title: "Analyze Doppler Radar Reflectivity",
      prompt:
        "Reflectivity rises from 32 dBZ to 48 dBZ over 20 minutes while echo tops surge. What should you do first?",
      options: [
        "Disregard the increase as anomalous propagation clutter",
        "Monitor storm intensification, VIL trends, and projected track",
        "Declare the storm harmless and archive the radar sweep",
      ],
      answer: 1,
      competency: "Radar Data Interpretation",
      explanation:
        "Rapidly rising reflectivity and echo tops can indicate a strengthening convective updraft. Track the trends and projected path before deciding on a warning.",
    },
    {
      id: "thunderstorm-movement",
      title: "Assess Movement and Exposure",
      prompt:
        "The storm is tracking toward a populated metropolitan zone. Which information should you review before issuing an alert?",
      options: [
        "Only the current surface temperature",
        "Radar velocity, storm vectors, lightning density, and surface gust observations",
        "Only yesterday's synoptic summary",
      ],
      answer: 1,
      competency: "Severe Weather Detection",
      explanation:
        "Cross-check radar velocity and storm motion with lightning and surface observations to assess the hazard and potential impacts.",
    },
    {
      id: "thunderstorm-warning",
      title: "Choose the Operational Alert",
      prompt:
        "The cell continues to intensify and is within 15 minutes of urban landfall. What is the appropriate next action?",
      options: [
        "Stop the radar scan and wait for post-event rain gauge data",
        "Follow the severe-weather nowcast bulletin procedure and notify the relevant authorities",
        "Wait until the convective core has passed before logging observations",
      ],
      answer: 1,
      competency: "Warning Communication",
      explanation:
        "Follow the applicable nowcast warning procedure promptly and communicate through the designated operational channels.",
    },
  ],
};

export const seedDB: DB = {
  users: [
    { id: "u-admin", name: "Dr. Meera Nair", email: "admin@capacityconnect.in", password: "Demo@123", role: "admin", status: "active", department: "Capacity Building Cell", designation: "Programme Administrator", createdAt: "2026-08-01", profileComplete: true },
    { id: "u-admin-test", name: "Admin User", email: "admin@test.com", password: "123456", role: "admin", status: "active", department: "Capacity Building Cell", designation: "System Administrator", createdAt: "2026-08-01", profileComplete: true },
    { id: "u-tr1", name: "Dr. Arvind Rao", email: "trainer@capacityconnect.in", password: "Demo@123", role: "trainer", status: "active", department: "Radar Meteorology Division", designation: "Senior Scientist / Chief Radar Instructor", createdAt: "2026-08-03", profileComplete: true },
    { id: "u-tr-test", name: "Trainer Test", email: "trainer@test.com", password: "123456", role: "trainer", status: "active", department: "Radar Meteorology Division", designation: "Senior Scientist", createdAt: "2026-08-03", profileComplete: true },
    {
      id: "u-tra1",
      name: "Rahul Verma",
      email: "trainee@test.com",
      password: "123456",
      role: "trainee",
      status: "active",
      jobRole: "Radar Operator",
      department: "Radar Operations Center",
      designation: "Radar Operator",
      createdAt: "2026-08-10",
      profileComplete: true
    },
    {
      id: "u-tra1-alias",
      name: "Rahul Verma (Alias)",
      email: "trainee@capacityconnect.in",
      password: "Demo@123",
      role: "trainee",
      status: "active",
      jobRole: "Radar Operator",
      department: "Radar Operations Center",
      designation: "Radar Operator",
      createdAt: "2026-08-10",
      profileComplete: true
    },
    {
      id: "u-tra2",
      name: "Amit Kumar",
      email: "trainee2@test.com",
      password: "123456",
      role: "trainee",
      status: "active",
      jobRole: "Radar Operator",
      department: "Regional Radar Station",
      designation: "Radar Operator",
      createdAt: "2026-08-10",
      profileComplete: true
    },
    {
      id: "u-tra3",
      name: "Pooja Verma",
      email: "trainee3@test.com",
      password: "123456",
      role: "trainee",
      status: "active",
      jobRole: "Radar Operator",
      department: "Cyclone Warning Radar Center",
      designation: "Radar Operator",
      createdAt: "2026-08-11",
      profileComplete: true
    }
  ],
  trainers: [
    {
      id: "tr1",
      userId: "u-tr1",
      name: "Dr. Arvind Rao",
      department: "Radar Meteorology Division",
      qualification: "PhD Atmospheric Physics (Radar Meteorology)",
      experienceYears: 18,
      subjects: [
        "Basic Meteorology",
        "Doppler Radar Operations",
        "Radar Data Interpretation",
        "Severe Weather Detection",
        "Warning Communication",
        "Radar Quality Control and Maintenance"
      ],
      skills: ["Doppler Weather Radar (DWR)", "Nowcasting", "Severe Convective Diagnostics", "Quality Control"],
      level: "Advanced",
      rating: 4.9,
      availability: "Available",
      verified: true,
      certifications: ["WMO Certified Radar Specialist", "IMD Senior Radar Trainer"],
      bio: "Chief instructor for IMD Doppler Weather Radar network with 18+ years of operational and training leadership."
    },
    {
      id: "tr2",
      userId: "u-tr-test",
      name: "Trainer Test",
      department: "Radar Meteorology Division",
      qualification: "MSc Atmospheric Science",
      experienceYears: 8,
      subjects: [
        "Basic Meteorology",
        "Doppler Radar Operations",
        "Radar Data Interpretation"
      ],
      skills: ["Doppler Weather Radar (DWR)", "Nowcasting", "Quality Control"],
      level: "Intermediate",
      rating: 4.5,
      availability: "Available",
      verified: true,
      certifications: ["IMD Radar Trainer"],
      bio: "Test trainer account for demo and evaluation purposes."
    }
  ],
  trainees: [
    {
      id: "ta1",
      userId: "u-tra1",
      name: "Rahul Verma",
      role: "Radar Operator",
      jobRole: "Radar Operator",
      centre: "Bhopal Doppler Radar Station",
      department: "Radar Operations Center",
      designation: "Radar Operator",
      qualification: "BSc Physics & Electronics",
      experienceYears: 1,
      interests: ["Doppler Radar", "Severe Storm Detection", "Operational Meteorology"],
      skills: { "Basic Meteorology": "Beginner", "Doppler Radar Operations": "Beginner" },
      competencies: [
        { name: "Basic Meteorology", currentLevel: "L1", targetLevel: "L2", lastAssessmentScore: 40 },
        { name: "Doppler Radar Operations", currentLevel: "L1", targetLevel: "L3", lastAssessmentScore: 42 },
        { name: "Radar Data Interpretation", currentLevel: "L1", targetLevel: "L3", lastAssessmentScore: 38 },
        { name: "Severe Weather Detection", currentLevel: "L1", targetLevel: "L3", lastAssessmentScore: 35 },
        { name: "Warning Communication", currentLevel: "L1", targetLevel: "L2", lastAssessmentScore: 45 },
        { name: "Radar Quality Control and Maintenance", currentLevel: "L1", targetLevel: "L2", lastAssessmentScore: 40 }
      ],
      goals: "Complete IMD Radar Operator qualification roadmap from L1 to L3."
    },
    {
      id: "ta2",
      userId: "u-tra2",
      name: "Amit Kumar",
      role: "Radar Operator",
      jobRole: "Radar Operator",
      centre: "Patna Doppler Radar Station",
      department: "Regional Radar Station",
      designation: "Radar Operator",
      qualification: "MSc Meteorology",
      experienceYears: 3,
      interests: ["NWP Guidance", "Radar Velocity Interpretation"],
      skills: { "Basic Meteorology": "Intermediate", "Doppler Radar Operations": "Intermediate" },
      competencies: [
        { name: "Basic Meteorology", currentLevel: "L2", targetLevel: "L2", lastAssessmentScore: 78 },
        { name: "Doppler Radar Operations", currentLevel: "L2", targetLevel: "L3", lastAssessmentScore: 72 },
        { name: "Radar Data Interpretation", currentLevel: "L1", targetLevel: "L3", lastAssessmentScore: 50 },
        { name: "Severe Weather Detection", currentLevel: "L1", targetLevel: "L3", lastAssessmentScore: 48 },
        { name: "Warning Communication", currentLevel: "L1", targetLevel: "L2", lastAssessmentScore: 52 },
        { name: "Radar Quality Control and Maintenance", currentLevel: "L1", targetLevel: "L2", lastAssessmentScore: 50 }
      ],
      goals: "Achieve L3 in Doppler Radar Operations and Radar Data Interpretation."
    },
    {
      id: "ta3",
      userId: "u-tra3",
      name: "Pooja Verma",
      role: "Radar Operator",
      jobRole: "Radar Operator",
      centre: "Visakhapatnam Cyclone Radar Station",
      department: "Cyclone Warning Radar Center",
      designation: "Radar Operator",
      qualification: "MTech Atmospheric Science",
      experienceYears: 4,
      interests: ["Severe Weather Nowcasting", "Cyclone Tracking", "Dual-Pol Diagnostics"],
      skills: { "Doppler Radar Operations": "Advanced", "Severe Weather Detection": "Advanced" },
      competencies: [
        { name: "Basic Meteorology", currentLevel: "L2", targetLevel: "L2", lastAssessmentScore: 84 },
        { name: "Doppler Radar Operations", currentLevel: "L3", targetLevel: "L3", lastAssessmentScore: 88 },
        { name: "Radar Data Interpretation", currentLevel: "L3", targetLevel: "L3", lastAssessmentScore: 85 },
        { name: "Severe Weather Detection", currentLevel: "L3", targetLevel: "L3", lastAssessmentScore: 90 },
        { name: "Warning Communication", currentLevel: "L1", targetLevel: "L2", lastAssessmentScore: 55 },
        { name: "Radar Quality Control and Maintenance", currentLevel: "L2", targetLevel: "L2", lastAssessmentScore: 80 }
      ],
      goals: "Fulfill final Warning Communication requirement to achieve full operational role certification."
    }
  ],
  courses: [
    {
      id: "c-atm-fund",
      title: "Atmospheric Fundamentals",
      code: "IMD-MET-101",
      competency: "Basic Meteorology",
      subject: "Basic Meteorology",
      department: "Meteorology",
      entryLevel: "L1",
      targetLevel: "L2",
      level: deriveDifficulty("L1", "L2"),
      duration: "4 Hours",
      durationHours: 4,
      trainerId: "tr1",
      prerequisiteCourseId: null,
      description: "Foundations of atmospheric dynamics, lapse rates, air masses, frontal systems, and thermodynamic profile analysis.",
      objectives: ["Understand atmospheric stability and lapse rates", "Analyze hydrostatic balance and pressure gradients", "Interpret moisture variables and relative humidity"],
      startDate: "2026-09-20",
      endDate: "2026-10-15",
      enrollmentLimit: 40,
      status: "published",
      modules: modules("c-atm-fund"),
      rating: 4.9
    },
    {
      id: "c-dop-rad-basics",
      title: "Doppler Radar Basics",
      code: "IMD-RAD-101",
      competency: "Doppler Radar Operations",
      subject: "Doppler Radar Operations",
      department: "Radar Operations",
      entryLevel: "L1",
      targetLevel: "L2",
      level: deriveDifficulty("L1", "L2"),
      duration: "5 Hours",
      durationHours: 5,
      trainerId: "tr1",
      prerequisiteCourseId: null,
      description: "Principles of electromagnetic pulses, antenna alignment, beam geometry, pulse repetition frequency, and hardware controls.",
      objectives: ["Understand radar pulse transmission and receiving", "Grasp Doppler phase shifts and radial motion measurement", "Operate radar console controls and scan monitors"],
      startDate: "2026-09-22",
      endDate: "2026-10-18",
      enrollmentLimit: 35,
      status: "published",
      modules: modules("c-dop-rad-basics"),
      rating: 4.8
    },
    {
      id: "c-adv-scan-strat",
      title: "Advanced Radar Scanning Strategies",
      code: "IMD-RAD-201",
      competency: "Doppler Radar Operations",
      subject: "Doppler Radar Operations",
      department: "Radar Operations",
      entryLevel: "L2",
      targetLevel: "L3",
      level: deriveDifficulty("L2", "L3"),
      duration: "6 Hours",
      durationHours: 6,
      trainerId: "tr1",
      prerequisiteCourseId: "c-dop-rad-basics",
      description: "Configuring Volume Coverage Patterns (VCP), dual-PRF velocity unfolding, elevation angles, and severe storm scanning protocols.",
      objectives: ["Select optimal VCP based on weather regime", "Mitigate Doppler Dilemma via dual-PRF strategies", "Optimize vertical resolution in cone-of-silence scenarios"],
      startDate: "2026-10-01",
      endDate: "2026-10-25",
      enrollmentLimit: 30,
      status: "published",
      modules: modules("c-adv-scan-strat"),
      rating: 4.9
    },
    {
      id: "c-read-refl-vel",
      title: "Reading Reflectivity and Velocity Products",
      code: "IMD-INT-101",
      competency: "Radar Data Interpretation",
      subject: "Radar Data Interpretation",
      department: "Radar Operations",
      entryLevel: "L1",
      targetLevel: "L2",
      level: deriveDifficulty("L1", "L2"),
      duration: "5 Hours",
      durationHours: 5,
      trainerId: "tr1",
      prerequisiteCourseId: null,
      description: "Interpreting base reflectivity (dBZ), radial velocity maps, Doppler zero-isodop lines, and precipitation intensity categories.",
      objectives: ["Interpret PPI and RHI displays accurately", "Identify inbound vs outbound velocity fields", "Analyze zero-isodop orientations to deduce environmental winds"],
      startDate: "2026-09-25",
      endDate: "2026-10-20",
      enrollmentLimit: 40,
      status: "published",
      modules: modules("c-read-refl-vel"),
      rating: 4.8
    },
    {
      id: "c-int-complex-sig",
      title: "Interpreting Complex Radar Signatures",
      code: "IMD-INT-201",
      competency: "Radar Data Interpretation",
      subject: "Radar Data Interpretation",
      department: "Radar Operations",
      entryLevel: "L2",
      targetLevel: "L3",
      level: deriveDifficulty("L2", "L3"),
      duration: "7 Hours",
      durationHours: 7,
      trainerId: "tr1",
      prerequisiteCourseId: "c-read-refl-vel",
      description: "Detecting mesocyclone couplets, velocity dealiasing artifacts, bounded weak echo regions (BWER), and dual-pol hydrometeor classification.",
      objectives: ["Recognize rotational azimuthal shear couplets", "Diagnose folded velocities and dealiasing errors", "Correlate ZDR and CC values for hail discrimination"],
      startDate: "2026-10-05",
      endDate: "2026-10-30",
      enrollmentLimit: 25,
      status: "published",
      modules: modules("c-int-complex-sig"),
      rating: 4.9
    },
    {
      id: "c-ts-cyc-basics",
      title: "Thunderstorm and Cyclone Basics",
      code: "IMD-SEV-101",
      competency: "Severe Weather Detection",
      subject: "Severe Weather Detection",
      department: "Severe Weather Section",
      entryLevel: "L1",
      targetLevel: "L2",
      level: deriveDifficulty("L1", "L2"),
      duration: "5 Hours",
      durationHours: 5,
      trainerId: "tr1",
      prerequisiteCourseId: null,
      description: "Stages of convective cell evolution, multicell clusters, tropical cyclone spiral bands, and eye-wall organization.",
      objectives: ["Track lifecycle of isolated and multicell thunderstorms", "Identify tropical cyclone eye and spiral rainband structures", "Recognize outflow boundaries and gust fronts"],
      startDate: "2026-09-24",
      endDate: "2026-10-18",
      enrollmentLimit: 35,
      status: "published",
      modules: modules("c-ts-cyc-basics"),
      rating: 4.7
    },
    {
      id: "c-nowcast-sev-wx",
      title: "Nowcasting Severe Weather with Radar",
      code: "IMD-SEV-201",
      competency: "Severe Weather Detection",
      subject: "Severe Weather Detection",
      department: "Severe Weather Section",
      entryLevel: "L2",
      targetLevel: "L3",
      level: deriveDifficulty("L2", "L3"),
      duration: "6 Hours",
      durationHours: 6,
      trainerId: "tr1",
      prerequisiteCourseId: "c-ts-cyc-basics",
      description: "Downburst detection, bow echo recognition, hail core signatures, flash flood precipitation rates, and 0–3 hour nowcast alerts.",
      objectives: ["Detect descending reflectivity cores preceding microbursts", "Identify bow echo signatures and damaging straight-line winds", "Generate short-range 0-3 hr quantitative precipitation nowcasts"],
      startDate: "2026-10-08",
      endDate: "2026-11-02",
      enrollmentLimit: 30,
      status: "published",
      modules: modules("c-nowcast-sev-wx"),
      rating: 4.9
    },
    {
      id: "c-issue-wx-alerts",
      title: "Issuing Weather Alerts",
      code: "IMD-WRN-101",
      competency: "Warning Communication",
      subject: "Warning Communication",
      department: "Forecasting Services",
      entryLevel: "L1",
      targetLevel: "L2",
      level: deriveDifficulty("L1", "L2"),
      duration: "4 Hours",
      durationHours: 4,
      trainerId: "tr1",
      prerequisiteCourseId: null,
      description: "Standardized IMD color-coded warning bulletins, clear impact-based messaging, lead-time protocols, and disaster management briefings.",
      objectives: ["Apply IMD Red-Orange-Yellow-Green alert standards", "Draft actionable nowcast warning bulletins", "Communicate urgent alerts to state and district authorities"],
      startDate: "2026-09-21",
      endDate: "2026-10-15",
      enrollmentLimit: 40,
      status: "published",
      modules: modules("c-issue-wx-alerts"),
      rating: 4.8
    },
    {
      id: "c-rad-qc-basics",
      title: "Radar Data Quality Basics",
      code: "IMD-QC-101",
      competency: "Radar Quality Control and Maintenance",
      subject: "Radar Quality Control and Maintenance",
      department: "Radar Operations",
      entryLevel: "L1",
      targetLevel: "L2",
      level: deriveDifficulty("L1", "L2"),
      duration: "4 Hours",
      durationHours: 4,
      trainerId: "tr1",
      prerequisiteCourseId: null,
      description: "Identifying ground clutter, anomalous propagation (AP), beam blockage, sun spikes, transmitter power checks, and routine calibration.",
      objectives: ["Distinguish meteorological echoes from anomalous propagation", "Identify beam blockage sectors on terrain maps", "Execute daily radar transmitter check and calibration checklists"],
      startDate: "2026-09-23",
      endDate: "2026-10-16",
      enrollmentLimit: 35,
      status: "published",
      modules: modules("c-rad-qc-basics"),
      rating: 4.7
    }
  ],
  enrollments: [
    { id: "e-met-1", traineeId: "ta1", courseId: "c-atm-fund", status: "approved", progress: 50, completedLessonIds: ["c-atm-fund-l1", "c-atm-fund-l2"], requestedAt: "2026-09-18" },
    { id: "e-rad-1", traineeId: "ta1", courseId: "c-dop-rad-basics", status: "approved", progress: 0, completedLessonIds: [], requestedAt: "2026-09-19" },
    { id: "e-ta2-1", traineeId: "ta2", courseId: "c-adv-scan-strat", status: "approved", progress: 25, completedLessonIds: ["c-adv-scan-strat-l1"], requestedAt: "2026-09-15" },
    { id: "e-ta3-1", traineeId: "ta3", courseId: "c-issue-wx-alerts", status: "approved", progress: 25, completedLessonIds: ["c-issue-wx-alerts-l1"], requestedAt: "2026-09-16" }
  ],
  assessments: [
    {
      id: "a-c-atm-fund",
      courseId: "c-atm-fund",
      type: "post",
      title: "Atmospheric Fundamentals Assessment (L1 → L2)",
      subject: "Basic Meteorology",
      passingPercentage: 60,
      durationMin: 15,
      questions: [
        { id: "q-af-1", text: "What is the standard dry adiabatic lapse rate (DALR) in the lower atmosphere?", options: ["Approximately 9.8°C per kilometer", "Approximately 6.5°C per kilometer", "Approximately 1.5°C per kilometer", "Zero (isothermal state)"], answer: 0, competency: "Basic Meteorology" },
        { id: "q-af-2", text: "Under hydrostatic balance, what two primary forces cancel each other in the vertical axis?", options: ["Vertical pressure gradient force and gravity", "Coriolis force and centripetal force", "Surface friction and buoyancy", "Horizontal pressure gradient and solar radiation"], answer: 0, competency: "Basic Meteorology" },
        { id: "q-af-3", text: "Which atmospheric layer contains virtually all operational weather phenomena and water vapor?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], answer: 0, competency: "Basic Meteorology" },
        { id: "q-af-4", text: "A daytime coastal sea-breeze circulation develops primarily because:", options: ["Land surfaces heat up much faster than adjacent sea water", "Ocean water absorbs zero solar radiation", "Coriolis force reverses direction near coastlines", "Atmospheric pressure is always higher over warm land"], answer: 0, competency: "Basic Meteorology" },
        { id: "q-af-5", text: "Relative humidity reaches 100% when:", options: ["Ambient air temperature cools to the dew point temperature", "Surface barometric pressure equals 1013.25 hPa", "Horizontal wind speed drops to zero knots", "The dry-bulb temperature exceeds 40°C"], answer: 0, competency: "Basic Meteorology" }
      ]
    },
    {
      id: "a-c-dop-rad-basics",
      courseId: "c-dop-rad-basics",
      type: "post",
      title: "Doppler Radar Basics Assessment (L1 → L2)",
      subject: "Doppler Radar Operations",
      passingPercentage: 60,
      durationMin: 15,
      questions: [
        { id: "q-dr-1", text: "What does pulsed Doppler radar measure to infer the radial motion of precipitation targets?", options: ["Phase shift between transmitted and received microwave pulses", "Target visual spectral wavelength shifts", "Ambient air temperature fluctuations", "Barometric pressure drop across the pulse packet"], answer: 0, competency: "Doppler Radar Operations" },
        { id: "q-dr-2", text: "The maximum unambiguous range (Rmax) and maximum unambiguous velocity (Vmax) are constrained by:", options: ["The Doppler Dilemma (Rmax × Vmax = c × λ / 8)", "Antenna weight and pedestal motor current", "Operating workstation screen resolution", "Ambient surface air humidity"], answer: 0, competency: "Doppler Radar Operations" },
        { id: "q-dr-3", text: "What is the primary function of the radar radome structure?", options: ["To protect the parabolic antenna from wind load, rain, and mechanical damage", "To amplify the transmitted microwave signal gain", "To convert S-band frequencies into X-band frequencies", "To store high-voltage capacitor charges"], answer: 0, competency: "Doppler Radar Operations" },
        { id: "q-dr-4", text: "In an operational Doppler weather radar, Pulse Repetition Frequency (PRF) refers to:", options: ["The number of microwave pulses transmitted per second", "The rotational speed of the antenna in RPM", "The frequency of emergency generator tests", "The display refresh rate of the workstation"], answer: 0, competency: "Doppler Radar Operations" }
      ]
    },
    {
      id: "a-c-adv-scan-strat",
      courseId: "c-adv-scan-strat",
      type: "post",
      title: "Advanced Radar Scanning Strategies Assessment (L2 → L3)",
      subject: "Doppler Radar Operations",
      passingPercentage: 60,
      durationMin: 20,
      questions: [
        { id: "q-as-1", text: "Why do Volume Coverage Patterns (VCP) deploy higher elevation angles close to the radar site?", options: ["To sample storm cloud tops and upper divergence without cone-of-silence gaps", "To communicate with weather satellites directly", "To minimize electrical power consumption", "To calibrate the solar flux sensor"], answer: 0, competency: "Doppler Radar Operations" },
        { id: "q-as-2", text: "Dual-PRF technique in modern Doppler radar is primarily utilized to:", options: ["Mitigate velocity aliasing while maintaining adequate unambiguous range", "Double the transmitter microwave output power", "Eliminate all atmospheric attenuation automatically", "Scan in both clockwise and counter-clockwise directions simultaneously"], answer: 0, competency: "Doppler Radar Operations" },
        { id: "q-as-3", text: "When operating in clear-air surveillance mode vs severe storm mode, the antenna rotation rate is typically:", options: ["Slower, allowing longer dwell times to detect weak return signals", "Three times faster to prevent motor overheating", "Kept fixed at zenith without rotation", "Varied randomly by the servo controller"], answer: 0, competency: "Doppler Radar Operations" },
        { id: "q-as-4", text: "What radar scanning artifact creates a region directly above the radar where precipitation cannot be sampled?", options: ["Cone of silence", "Bright band zone", "Blind velocity valley", "Second-trip corridor"], answer: 0, competency: "Doppler Radar Operations" }
      ]
    },
    {
      id: "a-c-read-refl-vel",
      courseId: "c-read-refl-vel",
      type: "post",
      title: "Reading Reflectivity and Velocity Products Assessment (L1 → L2)",
      subject: "Radar Data Interpretation",
      passingPercentage: 60,
      durationMin: 15,
      questions: [
        { id: "q-rv-1", text: "What logarithmic unit is universally used on weather radar to express equivalent reflectivity factor?", options: ["dBZ (decibels of Z)", "m/s (meters per second)", "hPa (hectopascals)", "knots (nautical miles per hour)"], answer: 0, competency: "Radar Data Interpretation" },
        { id: "q-rv-2", text: "On standard Doppler radial velocity displays, cool colors (green/blue) and warm colors (red/yellow) indicate:", options: ["Inbound velocity towards radar (cool) and outbound velocity away from radar (warm)", "Outbound velocity (cool) and inbound velocity (warm)", "High air temperature (cool) and low air temperature (warm)", "Heavy hail (cool) and light rain (warm)"], answer: 0, competency: "Radar Data Interpretation" },
        { id: "q-rv-3", text: "The zero-isodop line on a radial velocity display represents locations where:", options: ["Target motion is perpendicular to the radar beam (radial component is zero)", "Winds are completely calm in every direction", "Precipitation particles have stopped falling", "Radar beam has suffered 100% attenuation"], answer: 0, competency: "Radar Data Interpretation" },
        { id: "q-rv-4", text: "A reflectivity core exceeding 55 dBZ in a tropical thunderstorm indicates:", options: ["Extremely heavy precipitation, often accompanied by hail or high rain rates", "Light intermittent drizzle", "Uniform stratiform fog", "Clear-air refractive dust"], answer: 0, competency: "Radar Data Interpretation" }
      ]
    },
    {
      id: "a-c-int-complex-sig",
      courseId: "c-int-complex-sig",
      type: "post",
      title: "Interpreting Complex Radar Signatures Assessment (L2 → L3)",
      subject: "Radar Data Interpretation",
      passingPercentage: 60,
      durationMin: 20,
      questions: [
        { id: "q-cs-1", text: "A persistent cyclonic azimuthal shear couplet on velocity displays indicates:", options: ["A mesocyclone (rotating updraft) with severe storm / tornado potential", "A uniform straight-line ocean breeze", "Ground clutter reflection from trees", "An antenna servo synchronization failure"], answer: 0, competency: "Radar Data Interpretation" },
        { id: "q-cs-2", text: "In dual-polarization radar, high reflectivity (> 50 dBZ) paired with near-zero or negative Differential Reflectivity (ZDR) strongly suggests:", options: ["Hail stones tumbling with spherical/random orientation", "Oblate, horizontally flattened raindrops", "Airborne insect swarms", "Stratiform ice crystals at high altitude"], answer: 0, competency: "Radar Data Interpretation" },
        { id: "q-cs-3", text: "What signature on base reflectivity is formed when precipitation is swept around a powerful rotating storm updraft?", options: ["Hook echo", "Linear stratiform shield", "Circular bright band ring", "Anomalous propagation plume"], answer: 0, competency: "Radar Data Interpretation" },
        { id: "q-cs-4", text: "Velocity aliasing (Nyquist folding) occurs when:", options: ["The true radial velocity exceeds the maximum unambiguous velocity (Vmax)", "Wind speed is less than 5 km/h", "The radar antenna rotates faster than 30 RPM", "The transmitter pulse length is set too narrow"], answer: 0, competency: "Radar Data Interpretation" },
        { id: "q-cs-5", text: "A Bounded Weak Echo Region (BWER) observed in a vertical cross-section signifies:", options: ["An intense, powerful updraft preventing precipitation from falling into the core", "A decaying rain cell with no moisture left", "Severe radar beam attenuation behind heavy rain", "Ground clutter blockage from nearby terrain"], answer: 0, competency: "Radar Data Interpretation" }
      ]
    },
    {
      id: "a-c-ts-cyc-basics",
      courseId: "c-ts-cyc-basics",
      type: "post",
      title: "Thunderstorm and Cyclone Basics Assessment (L1 → L2)",
      subject: "Severe Weather Detection",
      passingPercentage: 60,
      durationMin: 15,
      questions: [
        { id: "q-tc-1", text: "What are the three recognized stages of an ordinary single-cell thunderstorm life cycle?", options: ["Cumulus stage, Mature stage, Dissipating stage", "Initiation stage, Boundary stage, Evaporation stage", "Frontal stage, Occluded stage, Stable stage", "Vortex stage, Trough stage, Clear stage"], answer: 0, competency: "Severe Weather Detection" },
        { id: "q-tc-2", text: "What radar feature defines the center of a mature tropical cyclone on Plan Position Indicator (PPI)?", options: ["A calm, relatively echo-free cyclone Eye surrounded by the intense Eyewall", "A continuous solid sheet of 70 dBZ echoes everywhere", "A hook echo pointing towards the northeast quadrant", "A straight zero-isodop line bisecting the ocean basin"], answer: 0, competency: "Severe Weather Detection" },
        { id: "q-tc-3", text: "The gust front or outflow boundary produced by a collapsing convective storm is characterized by:", options: ["A thin line of low reflectivity (< 20 dBZ) advancing ahead of the main storm", "A massive 60 dBZ circular patch with zero velocity", "A complete disappearance of all radar echoes", "A vertical tower of ice clouds reaching the stratosphere"], answer: 0, competency: "Severe Weather Detection" },
        { id: "q-tc-4", text: "Tropical cyclone spiral rainbands typically rotate around the storm center:", options: ["Cyclonically (counter-clockwise in the Northern Hemisphere)", "Anticyclonically (clockwise in the Northern Hemisphere)", "Radially outward in all directions simultaneously", "Stationary with no rotational component"], answer: 0, competency: "Severe Weather Detection" }
      ]
    },
    {
      id: "a-c-nowcast-sev-wx",
      courseId: "c-nowcast-sev-wx",
      type: "post",
      title: "Nowcasting Severe Weather with Radar Assessment (L2 → L3)",
      subject: "Severe Weather Detection",
      passingPercentage: 60,
      durationMin: 20,
      questions: [
        { id: "q-ns-1", text: "A prominent 'Bow Echo' on radar reflectivity is primarily associated with:", options: ["Damaging straight-line convective winds and downbursts (derechos)", "Gentle stratiform winter drizzle", "High-altitude non-precipitating cirrus clouds", "Stationary sea fog banks"], answer: 0, competency: "Severe Weather Detection" },
        { id: "q-ns-2", text: "Operational nowcasting of severe convective events typically covers a forecast validity window of:", options: ["0 to 3 hours (up to 6 hours max)", "3 to 5 days ahead", "10 to 14 days medium-range", "Seasonal monsoon outlook (3 months)"], answer: 0, competency: "Severe Weather Detection" },
        { id: "q-ns-3", text: "Rapid descent of a high-reflectivity core (> 55 dBZ) to the surface within 5–10 minutes typically signals:", options: ["An imminent microburst / macroburst touchdown with sudden severe wind gusts", "The storm has dissipated completely without surface impact", "Rain has turned into light fog", "Pressure is rising rapidly to clear sky conditions"], answer: 0, competency: "Severe Weather Detection" },
        { id: "q-ns-4", text: "Correlation Coefficient (CC) dropping sharply (< 0.80) coincident with a reflectivity debris ball indicates:", options: ["Non-meteorological tornadic debris lofted into the radar beam", "Pure uniform liquid raindrops of uniform diameter", "Uniform dry snow at high altitudes", "Clear air temperature inversion"], answer: 0, competency: "Severe Weather Detection" }
      ]
    },
    {
      id: "a-c-issue-wx-alerts",
      courseId: "c-issue-wx-alerts",
      type: "post",
      title: "Issuing Weather Alerts Assessment (L1 → L2)",
      subject: "Warning Communication",
      passingPercentage: 60,
      durationMin: 15,
      questions: [
        { id: "q-wa-1", text: "Under the standardized IMD color-coded weather alert system, the RED alert signifies:", options: ["Take Action: Extremely severe weather expected with high threat to life and property", "No Warning: Normal conditions", "Be Updated: Low to moderate probability weather", "Be Prepared: Keep watch for deteriorating weather"], answer: 0, competency: "Warning Communication" },
        { id: "q-wa-2", text: "An effective operational nowcast warning message must clearly include:", options: ["Affected district/taluk names, expected hazard intensity, time validity window, and safety actions", "Only the mathematical equations of the numerical forecast model", "Radar engineer maintenance schedules and transmitter serial numbers", "Raw radar polar coordinate binary dumps"], answer: 0, competency: "Warning Communication" },
        { id: "q-wa-3", text: "In IMD nowcasting protocols, an 'Orange Alert' instructs district disaster management authorities to:", options: ["Be Prepared: High likelihood of severe weather with potential disruption", "Ignore the weather and continue normal operations", "Evacuate the entire state immediately", "Close the radar station for routine repairs"], answer: 0, competency: "Warning Communication" },
        { id: "q-wa-4", text: "Lead time in early warning dissemination refers to:", options: ["The time interval between issuing the warning and the actual onset of the severe hazard", "The time required to write the computer software code", "The duration of the radar technician's shift", "The age of the radar transmitter tube"], answer: 0, competency: "Warning Communication" }
      ]
    },
    {
      id: "a-c-rad-qc-basics",
      courseId: "c-rad-qc-basics",
      type: "post",
      title: "Radar Data Quality Basics Assessment (L1 → L2)",
      subject: "Radar Quality Control and Maintenance",
      passingPercentage: 60,
      durationMin: 15,
      questions: [
        { id: "q-qc-1", text: "Anomalous Propagation (AP) ground clutter occurs most frequently when:", options: ["Strong atmospheric temperature inversions or moisture gradients bend the radar beam downward toward the earth", "Solar radiation causes the antenna motor to stop turning", "Raindrops reflect 100% of the transmitted energy back into space", "Lightning strikes the radome during clear skies"], answer: 0, competency: "Radar Quality Control and Maintenance" },
        { id: "q-qc-2", text: "Ground clutter targets (such as buildings, towers, and mountains) are typically characterized on radial velocity displays by:", options: ["Near-zero radial velocity (0 m/s) and high reflectivity", "Extremely high velocities exceeding 60 m/s", "Rapidly shifting cyclonic rotation", "Negative reflectivity values below -30 dBZ"], answer: 0, competency: "Radar Quality Control and Maintenance" },
        { id: "q-qc-3", text: "Sun spikes observed on radar displays during sunrise and sunset are caused by:", options: ["The radar antenna directly intercepting broad-spectrum electromagnetic microwave noise emitted by the sun", "Physical overheating of the parabolic antenna surface", "Solar wind deflecting the radar magnetic fields", "A faulty display monitor cable"], answer: 0, competency: "Radar Quality Control and Maintenance" },
        { id: "q-qc-4", text: "Beam blockage by a mountain ridge or tall structure manifests on radar reflectivity products as:", options: ["A persistent radial wedge or pie-slice of attenuated or missing echoes behind the obstruction", "A bright circular halo centered on the radar", "Uniform 65 dBZ false rainfall readings across the entire quadrant", "Random flickering pixel noise throughout the display"], answer: 0, competency: "Radar Quality Control and Maintenance" }
      ]
    }
  ],
  attempts: [
    { id: "att-ta1-1", assessmentId: "a-c-atm-fund", traineeId: "ta1", score: 40, passed: false, attemptedAt: "2026-09-18" },
    { id: "att-ta2-1", assessmentId: "a-c-atm-fund", traineeId: "ta2", score: 80, passed: true, attemptedAt: "2026-09-12" },
    { id: "att-ta2-2", assessmentId: "a-c-dop-rad-basics", traineeId: "ta2", score: 85, passed: true, attemptedAt: "2026-09-14" },
    { id: "att-ta3-1", assessmentId: "a-c-adv-scan-strat", traineeId: "ta3", score: 90, passed: true, attemptedAt: "2026-09-15" }
  ],
  competencyRequirements: [
    { role: "Radar Operator", subject: "Basic Meteorology", requiredLevel: "Intermediate", competencies: ["Basic Meteorology"] },
    { role: "Radar Operator", subject: "Doppler Radar Operations", requiredLevel: "Advanced", competencies: ["Doppler Radar Operations"] },
    { role: "Radar Operator", subject: "Radar Data Interpretation", requiredLevel: "Advanced", competencies: ["Radar Data Interpretation"] },
    { role: "Radar Operator", subject: "Severe Weather Detection", requiredLevel: "Advanced", competencies: ["Severe Weather Detection"] },
    { role: "Radar Operator", subject: "Warning Communication", requiredLevel: "Intermediate", competencies: ["Warning Communication"] },
    { role: "Radar Operator", subject: "Radar Quality Control and Maintenance", requiredLevel: "Intermediate", competencies: ["Radar Quality Control and Maintenance"] }
  ],
  competencyResults: [],
  certificates: [],
  notifications: [
    { id: "n1", title: "Radar Operator Level-Based Curriculum Active", body: "Nine competency courses covering Basic Meteorology to Quality Control are now published.", type: "course", audience: "all", publishedAt: "2026-09-20" },
    { id: "n2", title: "Doppler Radar Calibration Scheduled", body: "Station operators must record ground clutter verification before the upcoming convective season.", type: "deadline", audience: "all", publishedAt: "2026-09-18" }
  ],
  resources: [
    { id: "r1", trainerId: "tr1", title: "Doppler Reflectivity & Velocity Heuristics", subject: "Radar Data Interpretation", type: "Recorded Lecture", level: "Beginner", addedAt: "2026-09-18" },
    { id: "r2", trainerId: "tr1", title: "IMD Standard Warning Code Tables", subject: "Warning Communication", type: "PDF", level: "Beginner", addedAt: "2026-09-15" }
  ],
  evidence: [],
  scenarios: [PRACTICAL_LAB_SCENARIO],
  scenarioAttempts: [],
  knowledgeAssets: [],
  feedback: [],
  activities: [
    { id: "ac1", text: "Rahul Verma enrolled in Atmospheric Fundamentals.", at: "2026-09-18 10:15" },
    { id: "ac2", text: "New IMD Radar Operator curriculum published by Training Cell.", at: "2026-09-20 09:00" }
  ]
};