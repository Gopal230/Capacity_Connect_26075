import { Archive, ArrowRight, Award, BarChart3, BookOpen, BrainCircuit, CheckCircle2, ChevronRight, Clock, FileCheck2, Gauge, GraduationCap, Menu, Radar, ShieldCheck, Star, Users, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function HomePage(){
  const {db}=useApp();
  const [menu,setMenu]=useState(false);
  const latest=db.courses.filter(c=>c.status==="published").slice(0,3);

  return (
    <div className="public-site">
      <header className="public-nav">
        <Link to="/" className="public-brand">
          <span className="public-brand-mark">CC</span>
          <div>
            <strong>CAPACITY CONNECT</strong>
            <small>India Meteorological Department · MoES</small>
          </div>
        </Link>
        <button className="public-menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">
          {menu?<X/>:<Menu/>}
        </button>
        <nav className={menu?"show":""}>
          <a href="#about">About</a>
          <a href="#workflow">Framework</a>
          <a href="#features">Portals</a>
          <a href="#courses">Courses</a>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Register</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="category-pill">ACADEMIC & OPERATIONAL EXCELLENCE · MOES / IMD</span>
          <h1>Build an IMD workforce ready for <em>operational decisions.</em></h1>
          <p>
            An enterprise-grade operational capacity building and continuous learning platform. 
            Connecting meteorological competencies, accredited trainers, structured curricula, 
            and trainer-verified evidence of frontline readiness.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to="/login">
              Access Portal <ArrowRight size={18}/>
            </Link>
            <a className="btn btn-secondary btn-lg" href="#courses">
              Explore Programs
            </a>
          </div>
          <div className="hero-trust">
            <span><CheckCircle2 size={16}/> Role-governed access</span>
            <span><CheckCircle2 size={16}/> Explainable matching</span>
            <span><CheckCircle2 size={16}/> Evidence-backed verification</span>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-head">
            <div>
              <span>Competency-to-Capability Engine</span>
              <strong>Operational Pathway Preview</strong>
            </div>
            <BrainCircuit size={22}/>
          </div>
          <div className="engine-step active">
            <span>01</span>
            <div>
              <strong>Competency Diagnostic</strong>
              <small>Numerical Weather Prediction · Foundational → Advanced</small>
            </div>
          </div>
          <div className="engine-step">
            <span>02</span>
            <div>
              <strong>Targeted Curriculum</strong>
              <small>Operational NWP Modeling & Diagnostics</small>
            </div>
            <b>96% match</b>
          </div>
          <div className="engine-step">
            <span>03</span>
            <div>
              <strong>Accredited Trainer</strong>
              <small>Dr. Arvind Rao · ★ 4.9 · Senior Meteorologist</small>
            </div>
            <ShieldCheck size={18}/>
          </div>
          <div className="engine-step">
            <span>04</span>
            <div>
              <strong>Operational Evidence</strong>
              <small>Post-test validation + real-time simulation deliverable</small>
            </div>
            <FileCheck2 size={18}/>
          </div>
          <div className="engine-step">
            <span>05</span>
            <div>
              <strong>Certified Readiness</strong>
              <small>Capability Passport + Operational Readiness Index</small>
            </div>
            <Gauge size={18}/>
          </div>
        </div>
      </section>

      <section className="metric-strip">
        <div>
          <strong>{db.trainees.length}+</strong>
          <span>Active Personnel</span>
        </div>
        <div>
          <strong>{db.trainers.length}</strong>
          <span>Accredited Trainers</span>
        </div>
        <div>
          <strong>{db.courses.filter(c=>c.status==="published").length}</strong>
          <span>Published Programs</span>
        </div>
        <div>
          <strong>5-Signal</strong>
          <span>Readiness Index (ORI)</span>
        </div>
      </section>

      <section id="about" className="public-section">
        <div className="section-kicker">ENTERPRISE CAPACITY LIFECYCLE</div>
        <h2>A Unified Architecture for Meteorological Competency</h2>
        <p className="section-lead">
          From diagnostic gap discovery to verified operational capability, every learning milestone is auditable, governed, and tied to frontline readiness.
        </p>
        <div className="benefit-grid">
          {[
            [BookOpen,"Curriculum Management","Modular courses, synoptic charts, recorded briefings, and operational documentation."],
            [BrainCircuit,"Competency Diagnostic","Pre-training evaluations identify specific operational deficits before enrollment."],
            [Users,"Accredited Trainer Matching","Explainable recommendation matching expertise, historical ratings, and capacity."],
            [BarChart3,"Measurable Growth","Pre- and post-evaluations measure tangible capability gains across cohorts."],
            [Award,"Verified Credentials","Credentials issued strictly upon completion, post-tests, and trainer-signed work evidence."],
            [ShieldCheck,"Governance & Approvals","Administrative review workflows for personnel onboarding and course publishing."],
            [Radar,"Operational Scenario Lab","High-stakes decision simulations under realistic weather warning conditions."],
            [Archive,"Knowledge Continuity Vault","Critical institutional memory preserved as expert debriefs and operational playbooks."]
          ].map(([I,t,b]:any)=>(
            <article key={t}>
              <div className="feature-icon"><I size={20}/></div>
              <h3>{t}</h3>
              <p>{b}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="public-section workflow-section">
        <div className="section-kicker">GOVERNED PROGRESSION</div>
        <h2>12-Stage Capability Verification Pipeline</h2>
        <div className="workflow-row">
          {[
            "Profile Setup",
            "Competency Diagnostic",
            "Deficit Analysis",
            "Course Match",
            "Trainer Allocation",
            "Guided Study",
            "Summative Assessment",
            "Operational Deliverable",
            "Scenario Simulation",
            "Trainer Sign-Off",
            "Credential Issuance",
            "Capability Ledger"
          ].map((x,i,arr)=>(
            <div className="workflow-node" key={x}>
              <span>{String(i+1).padStart(2,'0')}</span>
              <strong>{x}</strong>
              {i<arr.length-1 && <ChevronRight size={16}/>}
            </div>
          ))}
        </div>
      </section>

      <section className="public-section differentiation-section">
        <div className="section-kicker">ACADEMIC & OPERATIONAL STANDARDS</div>
        <h2>Built for Operational Capability, Not Mere Attendance</h2>
        <p className="section-lead">
          Traditional learning portals measure course completions. CAPACITY CONNECT demands proof of applied competence in mission-critical environments.
        </p>
        <div className="differentiator-grid">
          <article>
            <Gauge size={24}/>
            <span>01</span>
            <h3>Operational Readiness Index</h3>
            <p>Calculates multi-factor preparedness combining baseline diagnostic, curriculum progress, exams, verified evidence, and scenario scores.</p>
          </article>
          <article>
            <FileCheck2 size={24}/>
            <span>02</span>
            <h3>Trainer-Verified Evidence</h3>
            <p>Credentials require operational sign-off: trainees submit synoptic analyses, radar interpretations, or model validations reviewed by accredited faculty.</p>
          </article>
          <article>
            <BrainCircuit size={24}/>
            <span>03</span>
            <h3>Transparent Matching</h3>
            <p>Explainable scoring breakdowns show exactly why a course or mentor is recommended based on domain fit, verification status, and availability.</p>
          </article>
          <article>
            <Archive size={24}/>
            <span>04</span>
            <h3>Succession Protection</h3>
            <p>Tacit expert knowledge is cataloged into playbooks and debrief archives with mission-criticality and succession-risk governance.</p>
          </article>
        </div>
      </section>

      <section id="features" className="public-section">
        <div className="section-kicker">ROLE-BASED PORTALS</div>
        <h2>Dedicated Environments for Every Stakeholder</h2>
        <div className="role-grid">
          <article>
            <div className="role-icon"><ShieldCheck size={22}/></div>
            <h3>Administration</h3>
            <p>Govern user authorization, accredit faculty, publish curricula, and track organization-wide readiness metrics.</p>
            <ul>
              <li>Personnel governance</li>
              <li>Trainer accreditation</li>
              <li>Readiness Command Center</li>
            </ul>
          </article>
          <article>
            <div className="role-icon"><GraduationCap size={22}/></div>
            <h3>Faculty & Trainers</h3>
            <p>Design learning modules, upload operational media, evaluate evidence deliverables, and mentor cohorts.</p>
            <ul>
              <li>Course authoring & library</li>
              <li>Operational evidence review</li>
              <li>Trainee tracking & grading</li>
            </ul>
          </article>
          <article>
            <div className="role-icon"><Users size={22}/></div>
            <h3>Operational Personnel</h3>
            <p>Assess skills, follow tailored learning pathways, complete decision scenarios, and earn certified credentials.</p>
            <ul>
              <li>Competency gap checks</li>
              <li>Interactive coursework</li>
              <li>Verified Capability Passport</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="courses" className="public-section soft">
        <div className="section-head-row">
          <div>
            <div className="section-kicker">FEATURED PATHWAYS</div>
            <h2>Specialized Operational Programs</h2>
          </div>
          <Link to="/login" className="text-link">
            Explore inside portal <ArrowRight size={16}/>
          </Link>
        </div>
        <div className="course-grid">
          {latest.map(c=>(
            <article className="course-card" key={c.id}>
              <div className="course-top">
                <span className="course-category-pill">{c.department}</span>
                <span className="badge badge-blue">{c.level}</span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <div className="course-meta">
                <span><Clock size={12}/> {c.durationHours} hours</span>
                <span className="course-rating"><Star size={12} fill="#F59E0B" color="#F59E0B"/> {c.rating}</span>
                <span className="course-code">{c.code}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section split-news">
        <div>
          <div className="section-kicker">INSTITUTIONAL BULLETINS</div>
          <h2>Announcements & Schedules</h2>
          {db.notifications.slice(0,3).map(n=>(
            <div className="news-item" key={n.id}>
              <span>{n.type}</span>
              <div>
                <strong>{n.title}</strong>
                <p>{n.body}</p>
              </div>
              <time>{n.publishedAt}</time>
            </div>
          ))}
        </div>
        <aside className="achievement-box">
          <Award size={28}/>
          <span>ACCREDITATION POLICY</span>
          <h3>Credentials Represent Proven Frontline Capability</h3>
          <p>
            Completion certificates are issued exclusively after comprehensive syllabus coverage, 
            successful examination, and independent operational evidence verification by an accredited trainer.
          </p>
        </aside>
      </section>

      <footer className="public-footer">
        <div>
          <strong>CAPACITY CONNECT</strong>
          <p>Digital Capacity Building & Operational Readiness Portal</p>
          <small>© {new Date().getFullYear()} India Meteorological Department · Ministry of Earth Sciences</small>
        </div>
        <div className="footer-links">
          <span>Enterprise Academic Design System</span>
          <span>Coursera-Inspired High-Trust Interface</span>
        </div>
      </footer>
    </div>
  );
}