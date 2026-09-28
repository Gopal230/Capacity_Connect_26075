import { Archive, ArrowRight, Award, BarChart3, BookOpen, BrainCircuit, CheckCircle2, ChevronRight, FileCheck2, Gauge, GraduationCap, Menu, Radar, ShieldCheck, Users, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function HomePage(){
  const {db}=useApp();
  const [menu,setMenu]=useState(false);
  const latest=db.courses.filter(c=>c.status==="published").slice(0,3);
  return <div className="public-site">
    <header className="public-nav">
      <Link to="/" className="public-brand"><span className="public-imd-mark">IMD</span><div><strong>CAPACITY CONNECT</strong><small>India Meteorological Department · MoES</small></div></Link>
      <button className="public-menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
      <nav className={menu?"show":""}><a href="#about">About</a><a href="#workflow">How it works</a><a href="#features">Features</a><a href="#courses">Courses</a><Link to="/login" className="btn btn-secondary">Login</Link><Link to="/register" className="btn btn-primary">Register</Link></nav>
    </header>

    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">SMART INDIA HACKATHON · DIGITAL CAPACITY BUILDING</span>
        <h1>Build an IMD workforce ready for <em>operational decisions.</em></h1>
        <p>An IMD-focused capacity building, operational-readiness and knowledge-continuity platform connecting people, meteorological competencies, verified trainers, learning media and evidence of capability.</p>
        <div className="hero-actions"><Link className="btn btn-primary btn-lg" to="/judge-demo">SIH Judge Demo <ArrowRight size={18}/></Link><Link className="btn btn-ghost btn-lg" to="/login">Open full portal</Link></div>
        <div className="hero-trust"><span><CheckCircle2/> Role-based access</span><span><CheckCircle2/> Transparent matching</span><span><CheckCircle2/> Verified outcomes</span></div>
      </div>
      <div className="hero-panel">
        <div className="hero-panel-head"><div><span>Competency-to-Capability Engine</span><strong>Live recommendation preview</strong></div><BrainCircuit/></div>
        <div className="engine-step active"><span>01</span><div><strong>Competency Gap</strong><small>NWP · Beginner → Advanced</small></div></div>
        <div className="engine-step"><span>02</span><div><strong>Recommended Course</strong><small>Operational Numerical Weather Prediction</small></div><b>96% match</b></div>
        <div className="engine-step"><span>03</span><div><strong>Verified Trainer</strong><small>Dr. Arvind Rao · ★ 4.9</small></div><ShieldCheck/></div>
        <div className="engine-step"><span>04</span><div><strong>Capability Proof</strong><small>Post-test + operational evidence + scenario</small></div><FileCheck2/></div>
        <div className="engine-step"><span>05</span><div><strong>Readiness Outcome</strong><small>Capability Passport + Operational Readiness Index</small></div><Gauge/></div>
      </div>
    </section>

    <section className="metric-strip">
      <div><strong>{db.trainees.length}+</strong><span>Demo trainees</span></div>
      <div><strong>{db.trainers.length}</strong><span>Verified trainers</span></div>
      <div><strong>{db.courses.filter(c=>c.status==="published").length}</strong><span>Active courses</span></div>
      <div><strong>5-signal</strong><span>Readiness index</span></div>
    </section>

    <section id="about" className="public-section">
      <div className="section-kicker">WHY CAPACITY CONNECT</div><h2>One platform for the complete capacity-building lifecycle</h2>
      <p className="section-lead">Training content, trainer discovery, participation tracking and competency records are connected into a single auditable workflow.</p>
      <div className="benefit-grid">
        {[
          [BookOpen,"Centralized learning","Courses, videos, PDFs and operational learning resources in one place."],
          [BrainCircuit,"Competency intelligence","Role-based competency checks identify the development gap before training."],
          [Users,"Verified trainer matching","Recommendations consider expertise, rating, verification and availability."],
          [BarChart3,"Measurable improvement","Pre- and post-training performance makes improvement visible."],
          [Award,"Verified competency records","Certificates are issued only after completion, post-test and operational evidence verification."],
          [ShieldCheck,"Governed workflow","Admin approval, audit-oriented status changes and role-based access."],
          [Radar,"Operational Scenario Lab","Job-relevant decision simulations test whether knowledge can be applied under realistic conditions."],
          [Archive,"Knowledge Continuity Vault","Critical expert know-how is captured as debriefs, playbooks and case archives before it is lost."]
        ].map(([I,t,b]:any)=><article key={t}><div className="feature-icon"><I/></div><h3>{t}</h3><p>{b}</p></article>)}
      </div>
    </section>

    <section id="workflow" className="public-section workflow-section">
      <div className="section-kicker">COMPETENCY-TO-CAPABILITY ENGINE</div><h2>Transparent, explainable development workflow</h2>
      <div className="workflow-row">
        {["Profile","Competency Check","Gap Identification","Course Recommendation","Trainer Matching","Training","Post-Test","Operational Evidence","Scenario Check","Trainer Verification","Certificate","Capability Update"].map((x,i,arr)=><div className="workflow-node" key={x}><span>{i+1}</span><strong>{x}</strong>{i<arr.length-1&&<ChevronRight/>}</div>)}
      </div>
    </section>


    <section className="public-section differentiation-section">
      <div className="section-kicker">WHY THIS IS NOT ANOTHER LMS</div><h2>Designed around organizational capability, not course consumption</h2>
      <p className="section-lead">Traditional LMS platforms can show who enrolled and completed content. CAPACITY CONNECT adds the missing layer: evidence that the employee can apply the competency in an operational context.</p>
      <div className="differentiator-grid">
        <article><Gauge/><span>01</span><h3>Operational Readiness Index</h3><p>Combines competency baseline, learning progress, assessment performance, verified evidence and scenario decisions into one transparent readiness score.</p></article>
        <article><FileCheck2/><span>02</span><h3>Evidence-backed verification</h3><p>A certificate cannot be issued from attendance alone. A verified trainer signs off an operational task, simulation, case report or dataset review.</p></article>
        <article><BrainCircuit/><span>03</span><h3>Explainable matching</h3><p>Every recommendation shows weighted reasons: competency alignment, trainer expertise, verification trust, rating, availability and current trainer load.</p></article>
        <article><Archive/><span>04</span><h3>Knowledge continuity</h3><p>Mission-critical expert knowledge is preserved with criticality and successor-risk tags so the organization does not lose tacit know-how.</p></article>
      </div>
    </section>

    <section id="features" className="public-section">
      <div className="section-kicker">ROLE-BASED EXPERIENCE</div><h2>Purpose-built workspaces for every role</h2>
      <div className="role-grid">
        <article><div className="role-icon"><ShieldCheck/></div><h3>Admin</h3><p>Approve users, verify trainers, publish courses, manage competencies and monitor organization-wide outcomes.</p><ul><li>User & role governance</li><li>Trainer verification</li><li>Analytics & reports</li></ul></article>
        <article><div className="role-icon"><GraduationCap/></div><h3>Trainer</h3><p>Create structured courses, upload learning resources, manage assessments and monitor trainee development.</p><ul><li>Course proposals</li><li>Trainer library</li><li>Trainee monitoring</li></ul></article>
        <article><div className="role-icon"><Users/></div><h3>Trainee</h3><p>Check competency, receive explainable recommendations, learn, complete assessments and earn verified records.</p><ul><li>Competency check</li><li>Personalized training</li><li>Certificates</li></ul></article>
      </div>
    </section>

    <section id="courses" className="public-section soft">
      <div className="section-head-row"><div><div className="section-kicker">LATEST COURSES</div><h2>Targeted learning pathways</h2></div><Link to="/login">View inside portal <ArrowRight size={16}/></Link></div>
      <div className="course-grid">{latest.map(c=><article className="course-card" key={c.id}><div className="course-top"><span>{c.department}</span><b>{c.level}</b></div><h3>{c.title}</h3><p>{c.description}</p><div className="course-meta"><span>{c.durationHours} hrs</span><span>★ {c.rating}</span><span>{c.code}</span></div></article>)}</div>
    </section>

    <section className="public-section split-news">
      <div><div className="section-kicker">ANNOUNCEMENTS</div><h2>Platform updates</h2>{db.notifications.slice(0,3).map(n=><div className="news-item" key={n.id}><span>{n.type}</span><div><strong>{n.title}</strong><p>{n.body}</p></div><time>{n.publishedAt}</time></div>)}</div>
      <aside className="achievement-box"><Award/><span>Capability achievement</span><h3>Competency records update only after successful training verification.</h3><p>This keeps course completion separate from proven capability—one of the core design principles of CAPACITY CONNECT.</p></aside>
    </section>

    <footer className="public-footer"><div><strong>CAPACITY CONNECT</strong><p>Digital Capacity Building & Learning Management Prototype</p></div><div><span>Smart India Hackathon Prototype</span><span>React · TypeScript · Local Mock Database</span></div></footer>
  </div>
}