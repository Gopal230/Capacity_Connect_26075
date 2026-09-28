import { DB } from "../types";

const modules = (prefix: string) => [
  {
    id: `${prefix}-m1`,
    title: "Foundation",
    lessons: [
      { id: `${prefix}-l1`, title: "Concept Overview", type: "video" as const, durationMin: 18, resource: "Demo video resource" },
      { id: `${prefix}-l2`, title: "Operational Guidelines", type: "pdf" as const, durationMin: 25, resource: "Guidelines.pdf" }
    ]
  },
  {
    id: `${prefix}-m2`,
    title: "Applied Practice",
    lessons: [
      { id: `${prefix}-l3`, title: "Case Study", type: "presentation" as const, durationMin: 20, resource: "CaseStudy.pptx" },
      { id: `${prefix}-l4`, title: "Field Notes", type: "note" as const, durationMin: 15, resource: "Field-notes" }
    ]
  }
];

export const seedDB: DB = {
  users: [
    { id: "u-admin", name: "Dr. Meera Nair", email: "admin@capacityconnect.in", password: "Demo@123", role: "admin", status: "active", department: "Capacity Building Cell", designation: "Programme Administrator", createdAt: "2026-08-01", profileComplete: true },
    { id: "u-tr1", name: "Dr. Arvind Rao", email: "trainer@capacityconnect.in", password: "Demo@123", role: "trainer", status: "active", department: "Meteorology", designation: "Senior Scientist", createdAt: "2026-08-03", profileComplete: true },
    { id: "u-tr2", name: "Dr. Kavita Menon", email: "kavita.menon@capacityconnect.in", password: "Demo@123", role: "trainer", status: "active", department: "Ocean Services", designation: "Scientist E", createdAt: "2026-08-04", profileComplete: true },
    { id: "u-tr3", name: "Rahul Deshmukh", email: "rahul.d@capacityconnect.in", password: "Demo@123", role: "trainer", status: "active", department: "Satellite Meteorology", designation: "Scientist D", createdAt: "2026-08-05", profileComplete: true },
    { id: "u-tr4", name: "Dr. Sana Khan", email: "sana.k@capacityconnect.in", password: "Demo@123", role: "trainer", status: "active", department: "Hydrometeorology", designation: "Scientist D", createdAt: "2026-08-06", profileComplete: true },
    { id: "u-tr5", name: "Vivek Iyer", email: "vivek.i@capacityconnect.in", password: "Demo@123", role: "trainer", status: "active", department: "Climate Services", designation: "Scientist C", createdAt: "2026-08-07", profileComplete: true },
    { id: "u-tra1", name: "Rahul Verma", email: "trainee@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Meteorological Centre Bhopal", designation: "Weather Forecaster", createdAt: "2026-08-10", profileComplete: true },
    { id: "u-tra2", name: "Amit Kumar", email: "amit.k@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Regional Meteorological Centre", designation: "Meteorologist A", createdAt: "2026-08-10", profileComplete: true },
    { id: "u-tra3", name: "Pooja Verma", email: "pooja.v@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Climate Research", designation: "Project Scientist", createdAt: "2026-08-11", profileComplete: true },
    { id: "u-tra4", name: "Nitin Bose", email: "nitin.b@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Ocean Information", designation: "Technical Officer", createdAt: "2026-08-11", profileComplete: true },
    { id: "u-tra5", name: "Ritu Shah", email: "ritu.s@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Agrometeorology", designation: "Scientific Assistant", createdAt: "2026-08-12", profileComplete: true },
    { id: "u-tra6", name: "S. K. Das", email: "sk.das@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Forecasting", designation: "Meteorologist B", createdAt: "2026-08-12", profileComplete: true },
    { id: "u-tra7", name: "Farah Ali", email: "farah.a@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Training Division", designation: "Research Associate", createdAt: "2026-08-13", profileComplete: true },
    { id: "u-tra8", name: "Manish Tiwari", email: "manish.t@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Radar Operations", designation: "Technical Assistant", createdAt: "2026-08-13", profileComplete: true },
    { id: "u-tra9", name: "Leena Joseph", email: "leena.j@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Hydrology", designation: "Scientist B", createdAt: "2026-08-14", profileComplete: true },
    { id: "u-tra10", name: "Harsh Gupta", email: "harsh.g@capacityconnect.in", password: "Demo@123", role: "trainee", status: "active", department: "Data Services", designation: "Scientific Assistant", createdAt: "2026-08-14", profileComplete: true },
    { id: "u-pending1", name: "Ananya Roy", email: "ananya.roy@example.in", password: "Demo@123", role: "trainer", status: "pending", department: "Climate Services", designation: "Scientist C", createdAt: "2026-09-15", profileComplete: false },
    { id: "u-pending2", name: "Karan Patel", email: "karan.patel@example.in", password: "Demo@123", role: "trainee", status: "pending", department: "Forecasting", designation: "Scientific Assistant", createdAt: "2026-09-16", profileComplete: false }
  ],
  trainers: [
    { id: "tr1", userId: "u-tr1", name: "Dr. Arvind Rao", department: "Meteorology", qualification: "PhD Atmospheric Sciences", experienceYears: 16, subjects: ["Radar Interpretation", "Synoptic Forecasting", "Numerical Weather Prediction"], skills: ["Doppler Radar", "Nowcasting", "NWP Guidance"], level: "Advanced", rating: 4.9, availability: "Available", verified: true, certifications: ["Advanced NWP Faculty", "WMO Training Facilitator"], bio: "Specialist in operational forecasting, Doppler radar analysis, and numerical prediction." },
    { id: "tr2", userId: "u-tr2", name: "Dr. Kavita Menon", department: "Ocean Services", qualification: "PhD Oceanography", experienceYears: 14, subjects: ["Ocean Forecasting", "Marine Services"], skills: ["Wave Modelling", "Ocean Analysis", "Advisory Services"], level: "Advanced", rating: 4.8, availability: "Available", verified: true, certifications: ["Ocean Modelling Expert"], bio: "Ocean information and marine forecasting specialist." },
    { id: "tr3", userId: "u-tr3", name: "Rahul Deshmukh", department: "Satellite Meteorology", qualification: "MTech Remote Sensing", experienceYears: 11, subjects: ["Satellite Meteorology", "Remote Sensing"], skills: ["Satellite Products", "Image Interpretation", "Nowcasting"], level: "Advanced", rating: 4.7, availability: "Limited", verified: true, certifications: ["Remote Sensing Trainer"], bio: "Operational satellite interpretation and nowcasting trainer." },
    { id: "tr4", userId: "u-tr4", name: "Dr. Sana Khan", department: "Hydrometeorology", qualification: "PhD Hydrology", experienceYears: 12, subjects: ["Hydrometeorology", "Flood Forecasting"], skills: ["Rainfall Analysis", "Flood Guidance", "Hydrological Models"], level: "Advanced", rating: 4.6, availability: "Available", verified: true, certifications: ["Hydrology Capacity Building"], bio: "Focuses on hydrometeorological hazards and warning services." },
    { id: "tr5", userId: "u-tr5", name: "Vivek Iyer", department: "Climate Services", qualification: "MSc Meteorology", experienceYears: 9, subjects: ["Climate Data", "Seasonal Outlooks"], skills: ["Climate Data QC", "Trend Analysis", "Climate Products"], level: "Intermediate", rating: 4.5, availability: "Available", verified: true, certifications: ["Climate Services Trainer"], bio: "Trainer for operational climate data and services." }
  ],
  trainees: [
    {
      id: "ta1",
      userId: "u-tra1",
      name: "Rahul Verma",
      role: "Weather Forecaster",
      centre: "Bhopal",
      department: "Meteorological Centre Bhopal",
      designation: "Weather Forecaster",
      qualification: "MSc Atmospheric Sciences",
      experienceYears: 3,
      interests: ["Radar", "Forecasting", "Nowcasting"],
      skills: { "Radar Interpretation": "Beginner", "Synoptic Forecasting": "Intermediate", "Satellite Meteorology": "Intermediate" },
      competencies: [
        {
          name: "Radar Interpretation",
          currentLevel: "L1",
          targetLevel: "L3",
          lastAssessmentScore: 45,
          updatedAt: "2026-09-10"
        },
        {
          name: "Synoptic Forecasting",
          currentLevel: "L2",
          targetLevel: "L3",
          lastAssessmentScore: 68,
          updatedAt: "2026-09-12"
        },
        {
          name: "Satellite Meteorology",
          currentLevel: "L2",
          targetLevel: "L2",
          lastAssessmentScore: 75,
          updatedAt: "2026-09-14"
        }
      ],
      goals: "Achieve required Level 3 competency for Weather Forecaster role at Bhopal MC."
    },
    { id: "ta2", userId: "u-tra2", name: "Amit Kumar", department: "Regional Meteorological Centre", designation: "Meteorologist A", qualification: "MSc Meteorology", experienceYears: 4, interests: ["NWP"], skills: { "Numerical Weather Prediction": "Intermediate" }, goals: "Become proficient in model interpretation." },
    { id: "ta3", userId: "u-tra3", name: "Pooja Verma", department: "Climate Research", designation: "Project Scientist", qualification: "MTech Data Science", experienceYears: 2, interests: ["Climate Analytics"], skills: { "Climate Data": "Intermediate" }, goals: "Build advanced climate analytics capability." },
    { id: "ta4", userId: "u-tra4", name: "Nitin Bose", department: "Ocean Information", designation: "Technical Officer", qualification: "MSc Oceanography", experienceYears: 5, interests: ["Ocean Forecasting"], skills: { "Ocean Forecasting": "Intermediate" }, goals: "Improve marine advisory generation." },
    { id: "ta5", userId: "u-tra5", name: "Ritu Shah", department: "Agrometeorology", designation: "Scientific Assistant", qualification: "MSc Agriculture", experienceYears: 4, interests: ["Agromet"], skills: { "Climate Data": "Beginner" }, goals: "Improve data interpretation." },
    { id: "ta6", userId: "u-tra6", name: "S. K. Das", department: "Forecasting", designation: "Meteorologist B", qualification: "MSc Meteorology", experienceYears: 7, interests: ["Synoptic Meteorology"], skills: { "Numerical Weather Prediction": "Intermediate" }, goals: "Advance NWP verification competency." },
    { id: "ta7", userId: "u-tra7", name: "Farah Ali", department: "Training Division", designation: "Research Associate", qualification: "MSc Atmospheric Science", experienceYears: 2, interests: ["Satellite"], skills: { "Satellite Meteorology": "Beginner" }, goals: "Develop satellite analysis skills." },
    { id: "ta8", userId: "u-tra8", name: "Manish Tiwari", department: "Radar Operations", designation: "Technical Assistant", qualification: "Diploma Electronics", experienceYears: 6, interests: ["Radar", "Nowcasting"], skills: { "Satellite Meteorology": "Beginner" }, goals: "Strengthen nowcasting support." },
    { id: "ta9", userId: "u-tra9", name: "Leena Joseph", department: "Hydrology", designation: "Scientist B", qualification: "MTech Hydrology", experienceYears: 5, interests: ["Flood Forecasting"], skills: { "Hydrometeorology": "Intermediate" }, goals: "Improve flood guidance competency." },
    { id: "ta10", userId: "u-tra10", name: "Harsh Gupta", department: "Data Services", designation: "Scientific Assistant", qualification: "BTech IT", experienceYears: 3, interests: ["Climate Data"], skills: { "Climate Data": "Beginner" }, goals: "Become competent in climate data quality control." }
  ],
  courses: [
    {
      id: "C001",
      title: "Radar Meteorology Basics",
      code: "IMD-RAD-101",
      competency: "Radar Interpretation",
      subject: "Radar Interpretation",
      department: "Radar Operations",
      entryLevel: "L1",
      targetLevel: "L2",
      duration: "4 Hours",
      durationHours: 4,
      trainerId: "tr1",
      prerequisiteCourseId: null,
      level: "Beginner",
      description: "Fundamental radar principles, pulse reflectivity, scanning strategies and precipitation echo detection.",
      objectives: ["Understand radar pulse reflectivity", "Read PPI and RHI displays", "Distinguish weather echoes from clutter"],
      startDate: "2026-09-20",
      endDate: "2026-10-15",
      enrollmentLimit: 40,
      status: "published",
      modules: modules("C001"),
      rating: 4.9
    },
    {
      id: "C002",
      title: "Doppler Radar Practice",
      code: "IMD-RAD-201",
      competency: "Radar Interpretation",
      subject: "Radar Interpretation",
      department: "Radar Operations",
      entryLevel: "L2",
      targetLevel: "L3",
      duration: "6 Hours",
      durationHours: 6,
      trainerId: "tr1",
      prerequisiteCourseId: "C001",
      level: "Intermediate",
      description: "Radial velocity interpretation, dealiasing, convective storm identification and mesocyclone signatures.",
      objectives: ["Interpret radial velocity fields", "Handle velocity dealiasing", "Identify mesocyclone signatures and hook echoes"],
      startDate: "2026-10-01",
      endDate: "2026-10-25",
      enrollmentLimit: 30,
      status: "published",
      modules: modules("C002"),
      rating: 4.8
    },
    {
      id: "C003",
      title: "Advanced Radar Case Analysis",
      code: "IMD-RAD-301",
      competency: "Radar Interpretation",
      subject: "Radar Interpretation",
      department: "Radar Operations",
      entryLevel: "L3",
      targetLevel: "L4",
      duration: "8 Hours",
      durationHours: 8,
      trainerId: "tr1",
      prerequisiteCourseId: "C002",
      level: "Advanced",
      description: "Dual-polarization metrics (ZDR, CC, KDP), hydrometeor classification and operational severe nowcasting.",
      objectives: ["Analyze dual-pol variables", "Classify hail and heavy rain", "Issue high-impact radar nowcast warnings"],
      startDate: "2026-11-01",
      endDate: "2026-11-20",
      enrollmentLimit: 25,
      status: "published",
      modules: modules("C003"),
      rating: 4.9
    },
    {
      id: "C004",
      title: "Synoptic Analysis & Surface Charting",
      code: "IMD-SYN-101",
      competency: "Synoptic Forecasting",
      subject: "Synoptic Forecasting",
      department: "Meteorology",
      entryLevel: "L1",
      targetLevel: "L2",
      duration: "5 Hours",
      durationHours: 5,
      trainerId: "tr1",
      prerequisiteCourseId: null,
      level: "Beginner",
      description: "Surface pressure systems, isobaric analysis, monsoon trough positioning, and frontal boundaries.",
      objectives: ["Plot and analyze surface charts", "Locate monsoon troughs and depressions", "Identify low-pressure systems"],
      startDate: "2026-09-18",
      endDate: "2026-10-10",
      enrollmentLimit: 40,
      status: "published",
      modules: modules("C004"),
      rating: 4.7
    },
    {
      id: "C005",
      title: "Advanced Synoptic Forecasting & NWP",
      code: "IMD-SYN-201",
      competency: "Synoptic Forecasting",
      subject: "Synoptic Forecasting",
      department: "Meteorology",
      entryLevel: "L2",
      targetLevel: "L3",
      duration: "7 Hours",
      durationHours: 7,
      trainerId: "tr1",
      prerequisiteCourseId: "C004",
      level: "Intermediate",
      description: "Upper-air dynamics, jet streaks, vorticity advection, and integrating numerical weather prediction products.",
      objectives: ["Integrate NWP ensemble guidance with synoptic observations", "Evaluate upper-air troughs and divergence", "Formulate operational district forecasts"],
      startDate: "2026-10-05",
      endDate: "2026-10-28",
      enrollmentLimit: 35,
      status: "published",
      modules: modules("C005"),
      rating: 4.8
    },
    {
      id: "C006",
      title: "Mesoscale Severe Weather Forecasting",
      code: "IMD-SYN-301",
      competency: "Synoptic Forecasting",
      subject: "Synoptic Forecasting",
      department: "Meteorology",
      entryLevel: "L3",
      targetLevel: "L4",
      duration: "8 Hours",
      durationHours: 8,
      trainerId: "tr1",
      prerequisiteCourseId: "C005",
      level: "Advanced",
      description: "Severe thunderstorm dynamics, squall lines, cyclone landfall intensity estimation, and heavy rainfall events.",
      objectives: ["Predict severe convection outbreaks", "Assess cyclone landfall track & surge", "Lead district warning briefings"],
      startDate: "2026-11-10",
      endDate: "2026-11-30",
      enrollmentLimit: 25,
      status: "published",
      modules: modules("C006"),
      rating: 4.9
    },
    {
      id: "C007",
      title: "Satellite Imagery & Convective Nowcasting",
      code: "IMD-SAT-101",
      competency: "Satellite Meteorology",
      subject: "Satellite Meteorology",
      department: "Satellite Meteorology",
      entryLevel: "L1",
      targetLevel: "L2",
      duration: "5 Hours",
      durationHours: 5,
      trainerId: "tr3",
      prerequisiteCourseId: null,
      level: "Beginner",
      description: "INSAT-3D/3DR visible, infrared, and water vapor channel interpretation for rapid convective cloud analysis.",
      objectives: ["Interpret multi-spectral satellite channels", "Identify cloud-top cooling trends", "Support airport and district nowcasts"],
      startDate: "2026-09-22",
      endDate: "2026-10-14",
      enrollmentLimit: 35,
      status: "published",
      modules: modules("C007"),
      rating: 4.7
    },
    {
      id: "c1",
      title: "Operational Numerical Weather Prediction",
      code: "CC-NWP-201",
      competency: "Synoptic Forecasting",
      department: "Meteorology",
      subject: "Numerical Weather Prediction",
      entryLevel: "L2",
      targetLevel: "L3",
      level: "Intermediate",
      trainerId: "tr1",
      description: "Interpret NWP guidance for operational forecasting.",
      objectives: ["Understand model products", "Compare guidance", "Apply verification basics"],
      durationHours: 18,
      startDate: "2026-09-20",
      endDate: "2026-10-08",
      enrollmentLimit: 40,
      status: "published",
      modules: modules("c1"),
      rating: 4.9
    },
    {
      id: "c2",
      title: "Satellite Meteorology for Nowcasting",
      code: "CC-SAT-202",
      competency: "Satellite Meteorology",
      department: "Satellite Meteorology",
      subject: "Satellite Meteorology",
      entryLevel: "L1",
      targetLevel: "L2",
      level: "Intermediate",
      trainerId: "tr3",
      description: "Use satellite products for cloud and convective analysis.",
      objectives: ["Interpret imagery", "Identify convection", "Support nowcasting"],
      durationHours: 14,
      startDate: "2026-09-25",
      endDate: "2026-10-12",
      enrollmentLimit: 35,
      status: "published",
      modules: modules("c2"),
      rating: 4.7
    },
    {
      id: "c3",
      title: "Ocean Forecasting and Marine Advisory",
      code: "CC-OCN-301",
      competency: "Ocean Forecasting",
      department: "Ocean Services",
      subject: "Ocean Forecasting",
      entryLevel: "L2",
      targetLevel: "L3",
      level: "Advanced",
      trainerId: "tr2",
      description: "Advanced marine forecasting and advisory workflows.",
      objectives: ["Interpret wave models", "Assess uncertainty", "Prepare advisories"],
      durationHours: 22,
      startDate: "2026-10-01",
      endDate: "2026-10-25",
      enrollmentLimit: 30,
      status: "published",
      modules: modules("c3"),
      rating: 4.8
    },
    {
      id: "c4",
      title: "Hydrometeorology and Flood Guidance",
      code: "CC-HYD-210",
      competency: "Hydrometeorology",
      department: "Hydrometeorology",
      subject: "Hydrometeorology",
      entryLevel: "L1",
      targetLevel: "L2",
      level: "Intermediate",
      trainerId: "tr4",
      description: "Rainfall analysis and hydrological guidance for warning support.",
      objectives: ["Analyze rainfall", "Read hydrological outputs", "Communicate flood guidance"],
      durationHours: 16,
      startDate: "2026-10-05",
      endDate: "2026-10-20",
      enrollmentLimit: 30,
      status: "published",
      modules: modules("c4"),
      rating: 4.6
    },
    {
      id: "c5",
      title: "Climate Data Quality and Services",
      code: "CC-CLM-110",
      competency: "Climate Data",
      department: "Climate Services",
      subject: "Climate Data",
      entryLevel: "L1",
      targetLevel: "L2",
      level: "Beginner",
      trainerId: "tr5",
      description: "Foundations of climate data quality control and service products.",
      objectives: ["Apply QC checks", "Summarize climate data", "Prepare basic products"],
      durationHours: 12,
      startDate: "2026-09-22",
      endDate: "2026-10-06",
      enrollmentLimit: 50,
      status: "published",
      modules: modules("c5"),
      rating: 4.5
    },
    {
      id: "c6",
      title: "Advanced NWP Verification",
      code: "CC-NWP-302",
      competency: "Synoptic Forecasting",
      department: "Meteorology",
      subject: "Numerical Weather Prediction",
      entryLevel: "L3",
      targetLevel: "L4",
      level: "Advanced",
      trainerId: "tr1",
      description: "Advanced verification concepts for forecast model evaluation.",
      objectives: ["Use verification metrics", "Diagnose model bias"],
      durationHours: 20,
      startDate: "2026-11-01",
      endDate: "2026-11-20",
      enrollmentLimit: 25,
      status: "pending",
      modules: modules("c6"),
      rating: 0
    }
  ],
  enrollments: [
    { id: "e-rad1", traineeId: "ta1", courseId: "C001", status: "approved", progress: 75, completedLessonIds: ["C001-l1", "C001-l2", "C001-l3"], requestedAt: "2026-09-18" },
    { id: "e1", traineeId: "ta1", courseId: "c1", status: "approved", progress: 50, completedLessonIds: ["c1-l1", "c1-l2"], requestedAt: "2026-09-10" },
    { id: "e2", traineeId: "ta2", courseId: "c1", status: "completed", progress: 100, completedLessonIds: ["c1-l1", "c1-l2", "c1-l3", "c1-l4"], requestedAt: "2026-08-30" },
    { id: "e3", traineeId: "ta3", courseId: "c5", status: "approved", progress: 25, completedLessonIds: ["c5-l1"], requestedAt: "2026-09-12" },
    { id: "e4", traineeId: "ta7", courseId: "c2", status: "requested", progress: 0, completedLessonIds: [], requestedAt: "2026-09-16" },
    { id: "e5", traineeId: "ta1", courseId: "c5", status: "completed", progress: 100, completedLessonIds: ["c5-l1", "c5-l2", "c5-l3", "c5-l4"], requestedAt: "2026-07-20" }
  ],
  assessments: [
    {
      id: "a-c001",
      courseId: "C001",
      type: "post",
      title: "Radar Meteorology Basics Assessment (L1 → L2)",
      subject: "Radar Interpretation",
      passingPercentage: 60,
      durationMin: 15,
      deadline: "2026-10-25",
      questions: [
        { id: "q-r1", text: "What primary parameter does Doppler Radar measure to detect target wind motion?", options: ["Radial frequency shift (Doppler frequency)", "Air temperature difference", "Barometric pressure gradient", "Dew point depression"], answer: 0, competency: "Radar Interpretation" },
        { id: "q-r2", text: "Which radar display mode shows horizontal precipitation distribution at fixed elevation angles?", options: ["Plan Position Indicator (PPI)", "Range Height Indicator (RHI)", "Vertical Profiler", "Doppler Spectral Width"], answer: 0, competency: "Radar Interpretation" },
        { id: "q-r3", text: "What reflectivity echo signature commonly indicates severe convective downdrafts and microbursts?", options: ["Hook echo / Bow echo", "Uniform stratiform band", "Ground clutter ring", "Anomalous propagation smear"], answer: 0, competency: "Radar Interpretation" }
      ]
    },
    {
      id: "a-c002",
      courseId: "C002",
      type: "post",
      title: "Doppler Radar Practice Assessment (L2 → L3)",
      subject: "Radar Interpretation",
      passingPercentage: 60,
      durationMin: 20,
      deadline: "2026-11-05",
      questions: [
        { id: "q-d1", text: "Velocity dealiasing in pulsed Doppler radar is required due to:", options: ["Nyquist velocity limits", "Beam attenuation", "Antenna rotation speed", "Receiver noise figure"], answer: 0, competency: "Radar Interpretation" },
        { id: "q-d2", text: "Mesocyclone detection on Doppler velocity displays is identified by:", options: ["Cyclonic azimuthal shear couplet", "Uniform outbound velocities", "Echo overhang", "Zero velocity notch"], answer: 0, competency: "Radar Interpretation" },
        { id: "q-d3", text: "Dual-polarization Differential Reflectivity (ZDR) primarily aids in identifying:", options: ["Hydrometeor shape and oblateness (rain vs hail)", "Wind gust velocity", "Echo tops", "Station elevation"], answer: 0, competency: "Radar Interpretation" }
      ]
    },
    {
      id: "a-c004",
      courseId: "C004",
      type: "post",
      title: "Synoptic Analysis & Surface Charting (L1 → L2)",
      subject: "Synoptic Forecasting",
      passingPercentage: 60,
      durationMin: 15,
      deadline: "2026-10-20",
      questions: [
        { id: "q-s1", text: "In the Northern Hemisphere, surface winds around a low-pressure area circulate:", options: ["Counter-clockwise and inward", "Clockwise and outward", "Directly parallel to latitude", "Downwards only"], answer: 0, competency: "Synoptic Forecasting" },
        { id: "q-s2", text: "The primary synoptic feature driving monsoon rainfall across Central India is:", options: ["Monsoon trough line", "Subtropical westerly jet", "Equatorial counter current", "Trade wind inversion"], answer: 0, competency: "Synoptic Forecasting" }
      ]
    },
    {
      id: "a-c005",
      courseId: "C005",
      type: "post",
      title: "Advanced Synoptic Forecasting & NWP (L2 → L3)",
      subject: "Synoptic Forecasting",
      passingPercentage: 60,
      durationMin: 20,
      deadline: "2026-11-10",
      questions: [
        { id: "q-sn1", text: "Positive vorticity advection in upper troposphere (500-300 hPa) typically induces:", options: ["Large-scale ascending motion and precipitation", "Strong subsidence and clear skies", "Surface high pressure intensification", "Trade wind strengthening"], answer: 0, competency: "Synoptic Forecasting" },
        { id: "q-sn2", text: "When evaluating NWP ensemble plumes, wide spread between ensemble members indicates:", options: ["High forecast uncertainty", "Near-perfect deterministic skill", "Sensor failure", "Zero probability of rain"], answer: 0, competency: "Synoptic Forecasting" }
      ]
    },
    {
      id: "a-c007",
      courseId: "C007",
      type: "post",
      title: "Satellite Imagery & Convective Nowcasting (L1 → L2)",
      subject: "Satellite Meteorology",
      passingPercentage: 60,
      durationMin: 15,
      deadline: "2026-10-25",
      questions: [
        { id: "q-sat1", text: "In Thermal Infrared (TIR) satellite imagery, bright white cloud tops indicate:", options: ["Very cold, high-reaching convective cloud tops", "Warm low-level stratus clouds", "Clear desert soil", "Sea surface temperature"], answer: 0, competency: "Satellite Meteorology" },
        { id: "q-sat2", text: "Water Vapor (WV 6.7 µm) channel is especially valuable for monitoring:", options: ["Upper and middle tropospheric moisture and flow patterns", "Ground vegetation health", "Surface ocean currents", "Fog and low stratus at night"], answer: 0, competency: "Satellite Meteorology" }
      ]
    },
    {
      id: "a-comp-nwp", courseId: "c1", type: "competency", title: "NWP Competency Check", subject: "Numerical Weather Prediction", passingPercentage: 60, durationMin: 12, deadline: "2026-10-01",
      questions: [
        { id: "q1", text: "Which output is most useful for comparing forecast model bias over repeated cases?", options: ["Verification statistics", "Station metadata", "Raw imagery", "User directory"], answer: 0, competency: "Model Verification" },
        { id: "q2", text: "Ensemble spread primarily helps indicate:", options: ["User access", "Forecast uncertainty", "Storage quota", "Training attendance"], answer: 1, competency: "Forecast Interpretation" },
        { id: "q3", text: "Before using model guidance operationally, a forecaster should:", options: ["Ignore observations", "Cross-check observations and recent performance", "Use only one model forever", "Skip time validity"], answer: 1, competency: "NWP" }
      ]
    },
    {
      id: "a-pre-c1", courseId: "c1", type: "pre", title: "NWP Pre-Test", subject: "Numerical Weather Prediction", passingPercentage: 50, durationMin: 10, deadline: "2026-09-25",
      questions: [
        { id: "p1", text: "A model run is best interpreted with:", options: ["Observations and context", "No validation", "Only file size", "User role"], answer: 0, competency: "Forecast Interpretation" },
        { id: "p2", text: "Bias is a measure of:", options: ["Systematic error tendency", "Internet speed", "Course duration", "Attendance"], answer: 0, competency: "Model Verification" }
      ]
    },
    {
      id: "a-post-c1", courseId: "c1", type: "post", title: "NWP Post-Test", subject: "Numerical Weather Prediction", passingPercentage: 70, durationMin: 12, deadline: "2026-10-08",
      questions: [
        { id: "po1", text: "Ensemble products are especially useful for:", options: ["Uncertainty assessment", "User creation", "Password reset", "File compression"], answer: 0, competency: "Forecast Interpretation" },
        { id: "po2", text: "A verification score should be interpreted against:", options: ["Suitable benchmark and sample", "Only trainer name", "Screen size", "Course color"], answer: 0, competency: "Model Verification" },
        { id: "po3", text: "Operational guidance should combine:", options: ["Models, observations and forecaster judgment", "Only one chart", "Only historical text", "No current data"], answer: 0, competency: "NWP" }
      ]
    }
  ],
  attempts: [
    { id: "att1", assessmentId: "a-pre-c1", traineeId: "ta2", score: 50, passed: true, attemptedAt: "2026-09-02" },
    { id: "att2", assessmentId: "a-post-c1", traineeId: "ta2", score: 100, passed: true, attemptedAt: "2026-09-14" }
  ],
  competencyRequirements: [
    { role: "Weather Forecaster", subject: "Radar Interpretation", requiredLevel: "Advanced", competencies: ["Radar Interpretation", "Doppler Analysis"] },
    { role: "Weather Forecaster", subject: "Synoptic Forecasting", requiredLevel: "Advanced", competencies: ["Surface Charting", "NWP Interpretation"] },
    { role: "Scientific Assistant", subject: "Numerical Weather Prediction", requiredLevel: "Advanced", competencies: ["NWP", "Forecast Interpretation", "Model Verification"] },
    { role: "Meteorologist A", subject: "Numerical Weather Prediction", requiredLevel: "Advanced", competencies: ["NWP", "Forecast Interpretation", "Model Verification"] },
    { role: "Research Associate", subject: "Satellite Meteorology", requiredLevel: "Intermediate", competencies: ["Satellite Products", "Image Interpretation", "Nowcasting"] },
    { role: "Technical Officer", subject: "Ocean Forecasting", requiredLevel: "Advanced", competencies: ["Wave Modelling", "Ocean Analysis", "Advisory Services"] },
    { role: "Scientist B", subject: "Hydrometeorology", requiredLevel: "Advanced", competencies: ["Rainfall Analysis", "Flood Guidance", "Hydrological Models"] }
  ],
  competencyResults: [
    { id: "cr1", traineeId: "ta1", role: "Weather Forecaster", subject: "Radar Interpretation", currentLevel: "Beginner", requiredLevel: "Advanced", gapText: "L1 → L3 progression required", score: 45, missingCompetencies: ["Doppler Velocity Analysis", "Dual-Pol Interpretation"], updatedAt: "2026-09-10" },
    { id: "cr2", traineeId: "ta1", role: "Weather Forecaster", subject: "Synoptic Forecasting", currentLevel: "Intermediate", requiredLevel: "Advanced", gapText: "L2 → L3 progression required", score: 68, missingCompetencies: ["Upper-air Dynamics", "Ensemble Diagnostics"], updatedAt: "2026-09-12" }
  ],
  certificates: [
    { id: "cert1", traineeId: "ta2", courseId: "c1", trainerId: "tr1", competency: "Numerical Weather Prediction", issuedAt: "2026-09-15", validUntil: "2027-09-15", certificateCode: "CC-2026-NWP-0001" },
    { id: "cert2", traineeId: "ta1", courseId: "c5", trainerId: "tr5", competency: "Climate Data", issuedAt: "2026-08-12", validUntil: "2027-08-12", certificateCode: "CC-2026-CLM-0002" }
  ],
  notifications: [
    { id: "n1", title: "Radar Meteorology Level-Based Curriculum Published", body: "Stage 1 (L1→L2) and Stage 2 (L2→L3) courses are now active for Weather Forecasters.", type: "course", audience: "all", publishedAt: "2026-09-18" },
    { id: "n2", title: "Trainer verification window", body: "Pending trainers should complete profile evidence by 20 September.", type: "deadline", audience: "trainer", publishedAt: "2026-09-14" },
    { id: "n3", title: "Learning achievement", body: "Completion rate crossed 78% in the latest capacity-building cycle.", type: "achievement", audience: "all", publishedAt: "2026-09-12" },
    { id: "n4", title: "Satellite interpretation resource added", body: "New case-based presentation is available in the trainer library.", type: "resource", audience: "all", publishedAt: "2026-09-11" }
  ],
  resources: [
    { id: "r1", trainerId: "tr1", title: "Radar Reflectivity & Velocity Heuristics", subject: "Radar Interpretation", type: "Recorded Lecture", level: "Beginner", addedAt: "2026-09-18" },
    { id: "r2", trainerId: "tr1", title: "NWP Guidance Interpretation", subject: "Numerical Weather Prediction", type: "Recorded Lecture", level: "Intermediate", addedAt: "2026-09-15" },
    { id: "r3", trainerId: "tr3", title: "Convective Cloud Signatures", subject: "Satellite Meteorology", type: "Presentation", level: "Intermediate", addedAt: "2026-09-14" },
    { id: "r4", trainerId: "tr2", title: "Marine Wave Model Primer", subject: "Ocean Forecasting", type: "PDF", level: "Advanced", addedAt: "2026-09-13" },
    { id: "r5", trainerId: "tr4", title: "Rainfall to Flood Guidance", subject: "Hydrometeorology", type: "Video", level: "Intermediate", addedAt: "2026-09-12" },
    { id: "r6", trainerId: "tr5", title: "Climate Data QC Checklist", subject: "Climate Data", type: "Notes", level: "Beginner", addedAt: "2026-09-10" }
  ],
  evidence: [
    { id:"ev1", traineeId:"ta2", courseId:"c1", subject:"Numerical Weather Prediction", title:"Monsoon model-guidance comparison case", type:"Case Report", status:"verified", submittedAt:"2026-09-13", reviewerId:"tr1", score:92, note:"Correctly compared deterministic and ensemble guidance and documented uncertainty." },
    { id:"ev2", traineeId:"ta1", courseId:"c1", subject:"Numerical Weather Prediction", title:"District forecast briefing simulation", type:"Simulation", status:"submitted", submittedAt:"2026-09-16", note:"Awaiting trainer review." },
    { id:"ev3", traineeId:"ta3", courseId:"c5", subject:"Climate Data", title:"Monthly climate dataset QC exercise", type:"Dataset Review", status:"verified", submittedAt:"2026-09-12", reviewerId:"tr5", score:84, note:"Applied range, consistency and missing-value checks correctly." },
    { id:"ev4", traineeId:"ta1", courseId:"c5", subject:"Climate Data", title:"Station climate-series QC and anomaly review", type:"Dataset Review", status:"verified", submittedAt:"2026-08-10", reviewerId:"tr5", score:88, note:"Correctly identified suspect values, documented evidence and preserved the audit trail." }
  ],
  scenarios: [
    { id:"sc1", title:"Severe Thunderstorm Nowcasting Drill", subject:"Numerical Weather Prediction", role:"Weather Forecaster", context:"A pre-monsoon convective line is developing west of a high-population district. Radar echoes are intensifying, satellite cloud-top temperatures are falling and two model runs disagree on movement speed. Choose the safest operational sequence.", difficulty:"Advanced", passingPercentage:70, steps:[
      {id:"sc1-s1",prompt:"What should you do first?",options:["Issue the highest warning immediately without checking observations","Cross-check radar, satellite, surface observations and latest guidance","Wait for the next model cycle only","Use yesterday's forecast wording"],answer:1,competency:"Multi-source Analysis"},
      {id:"sc1-s2",prompt:"Model guidance disagrees on storm speed. What is the best response?",options:["Hide the uncertainty","Use observed motion and communicate forecast uncertainty","Choose the fastest model automatically","Ignore radar trends"],answer:1,competency:"Forecast Interpretation"},
      {id:"sc1-s3",prompt:"Before dissemination, which output is most appropriate?",options:["A clear impact-oriented warning with validity, area and uncertainty","Only raw model screenshots","An internal note without validity time","A generic monthly advisory"],answer:0,competency:"Warning Communication"}
    ]},
    { id:"sc2", title:"Climate Data Quality Control Incident", subject:"Climate Data", role:"Weather Forecaster", context:"A station's daily maximum temperature suddenly drops by 14°C while neighbouring stations and metadata show no weather event or instrument change. Decide how to handle the observation before climate-product generation.", difficulty:"Intermediate", passingPercentage:70, steps:[
      {id:"sc2-s1",prompt:"What is the best first QC action?",options:["Delete the value immediately","Flag the value and compare temporal, spatial and metadata evidence","Publish it unchanged","Replace it with the monthly mean"],answer:1,competency:"Quality Control"},
      {id:"sc2-s2",prompt:"If the instrument log confirms a sensor fault, what next?",options:["Document the flag/correction according to procedure","Remove the station permanently","Ignore the incident","Change nearby station values too"],answer:0,competency:"Data Governance"}
    ]}
  ],
  scenarioAttempts: [
    {id:"sca1",traineeId:"ta2",scenarioId:"sc1",score:100,passed:true,readinessBand:"High Readiness",attemptedAt:"2026-09-14"},
    {id:"sca2",traineeId:"ta3",scenarioId:"sc2",score:100,passed:true,readinessBand:"High Readiness",attemptedAt:"2026-09-13"}
  ],
  knowledgeAssets: [
    {id:"ka1",trainerId:"tr1",title:"Monsoon NWP Biases: Senior Forecaster Debrief",subject:"Numerical Weather Prediction",type:"Expert Debrief",criticality:"Mission Critical",successorRisk:"High",summary:"Operational heuristics for recognizing recurring model biases during active monsoon conditions, with examples and decision checkpoints.",status:"published",capturedAt:"2026-09-12"},
    {id:"ka2",trainerId:"tr3",title:"Rapid Convective Signature Interpretation",subject:"Satellite Meteorology",type:"Recorded Walkthrough",criticality:"Important",successorRisk:"Medium",summary:"Expert walkthrough of satellite signatures used before severe convection and how to cross-check with radar observations.",status:"published",capturedAt:"2026-09-10"},
    {id:"ka3",trainerId:"tr2",title:"Marine Advisory Escalation Playbook",subject:"Ocean Forecasting",type:"Playbook",criticality:"Mission Critical",successorRisk:"Medium",summary:"Decision sequence for translating wave-model uncertainty into operational marine advisories and escalation notes.",status:"published",capturedAt:"2026-09-08"},
    {id:"ka4",trainerId:"tr5",title:"Climate QC Exception Case Archive",subject:"Climate Data",type:"Case Archive",criticality:"Important",successorRisk:"Low",summary:"Curated unusual QC cases with reason codes, evidence and final disposition for training future staff.",status:"published",capturedAt:"2026-09-06"}
  ],
  feedback: [
    {id:"fb1",traineeId:"ta2",courseId:"c1",rating:5,comment:"Case-based NWP examples were directly useful for operational interpretation.",createdAt:"2026-09-15"},
    {id:"fb2",traineeId:"ta1",courseId:"c5",rating:4,comment:"The QC checklist and dataset exercise made the quality-control workflow much clearer.",createdAt:"2026-08-12"}
  ],
  activities: [
    { id: "ac1", text: "Ananya Roy submitted trainer registration.", at: "2026-09-16 09:18" },
    { id: "ac2", text: "Farah Ali requested enrollment in Satellite Meteorology.", at: "2026-09-16 08:42" },
    { id: "ac3", text: "Radar Meteorology Basics (L1→L2) published.", at: "2026-09-18 10:15" },
    { id: "ac4", text: "Amit Kumar earned competency certificate CC-2026-NWP-0001.", at: "2026-09-15 14:05" }
  ]
};