import { BookOpen, CheckCircle2, ChevronRight, FileText, Globe, HelpCircle, Mail, Phone, Shield, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type ModalType = "about" | "faqs" | "licensing" | "accessibility" | null;

export default function PublicFooter() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <footer className="institutional-footer" style={{ background: "#061325", color: "#E2E8F0", borderTop: "1px solid #1E293B" }}>
        {/* Main 4-Column Grid */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px 36px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "36px" }}>
          {/* Column 1: Institutional Identity */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#0056D2",
                  color: "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  fontSize: "13px",
                  boxShadow: "0 2px 8px rgba(0, 86, 210, 0.4)",
                }}
              >
                CC
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "#FFFFFF", letterSpacing: "0.5px", display: "block" }}>
                  CAPACITY CONNECT
                </strong>
                <span style={{ fontSize: "10.5px", color: "#94A3B8" }}>
                  India Meteorological Department
                </span>
              </div>
            </div>

            <p style={{ fontSize: "12.5px", color: "#94A3B8", lineHeight: "1.6", margin: "0 0 16px" }}>
              The unified national portal for meteorological training, standardized Doppler Weather Radar (DWR) competency progression, and institutional readiness verification under the Ministry of Earth Sciences, Govt. of India.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px", color: "#64748B" }}>
              <span>• Ministry of Earth Sciences (MoES)</span>
              <span>• World Meteorological Organization (WMO) Aligned</span>
              <span>• National Radar Network Command</span>
            </div>
          </div>

          {/* Column 2: Portals & Learning Hub */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>
              Workspaces & Catalog
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
              <li>
                <Link to="/courses" style={{ color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")} onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}>
                  Full Radar Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/?role=trainee" style={{ color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")} onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}>
                  Operational Trainee Workspace
                </Link>
              </li>
              <li>
                <Link to="/?role=trainer" style={{ color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")} onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}>
                  Faculty & Trainer Portal
                </Link>
              </li>
              <li>
                <Link to="/?role=admin" style={{ color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")} onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}>
                  Directorate Admin Command
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: "#60A5FA", textDecoration: "none", fontWeight: 600, transition: "color 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#93C5FD")} onMouseLeave={(e) => (e.currentTarget.style.color = "#60A5FA")}>
                  Request Account Clearance →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional Knowledge & FAQs */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>
              Documentation & Support
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("about")}
                  style={{ background: "none", border: "none", padding: 0, color: "#94A3B8", cursor: "pointer", fontSize: "12.5px", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  About Capacity Connect & IMD
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("faqs")}
                  style={{ background: "none", border: "none", padding: 0, color: "#94A3B8", cursor: "pointer", fontSize: "12.5px", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  Frequently Asked Questions (FAQs)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("about")}
                  style={{ background: "none", border: "none", padding: 0, color: "#94A3B8", cursor: "pointer", fontSize: "12.5px", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  Field & Low-Bandwidth Mode Guide
                </button>
              </li>
              <li>
                <span style={{ color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={13} /> helpdesk.imd@gov.in
                </span>
              </li>
              <li>
                <span style={{ color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Phone size={13} /> +91-11-24611068 (HQ Support)
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & Legal */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>
              Governance & Policies
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("licensing")}
                  style={{ background: "none", border: "none", padding: 0, color: "#94A3B8", cursor: "pointer", fontSize: "12.5px", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  Government Open Data License (GODL)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("licensing")}
                  style={{ background: "none", border: "none", padding: 0, color: "#94A3B8", cursor: "pointer", fontSize: "12.5px", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  Terms of Service & Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("accessibility")}
                  style={{ background: "none", border: "none", padding: 0, color: "#94A3B8", cursor: "pointer", fontSize: "12.5px", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  GIGW Accessibility Compliance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("licensing")}
                  style={{ background: "none", border: "none", padding: 0, color: "#94A3B8", cursor: "pointer", fontSize: "12.5px", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  Data Sovereignty & Audit Logging
                </button>
              </li>
              <li>
                <span style={{ color: "#10B981", fontSize: "11.5px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <ShieldCheck size={14} /> National Security Standard Adherent
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div style={{ borderTop: "1px solid #1E293B", padding: "18px 24px", background: "#040D1A" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", fontSize: "12px", color: "#64748B" }}>
            <div>
              © {new Date().getFullYear()} India Meteorological Department · Ministry of Earth Sciences, Government of India. All Rights Reserved.
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <span>Version 7.0.0</span>
              <span>•</span>
              <span>WMO Class-I Framework</span>
              <span>•</span>
              <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "#94A3B8", textDecoration: "none" }}>
                IMD Official Portal ↗
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================
          INTERACTIVE FOOTER MODALS (ABOUT, FAQS, LICENSING, ETC.)
          ========================================================= */}
      {activeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 25, 47, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              color: "#0F172A",
              padding: "28px 32px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              style={{
                position: "absolute",
                right: "20px",
                top: "20px",
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                color: "#64748B",
              }}
            >
              <X size={18} />
            </button>

            {/* MODAL: ABOUT */}
            {activeModal === "about" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EFF6FF", color: "#0056D2", display: "grid", placeItems: "center" }}>
                    <Globe size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "20px", color: "#0F172A" }}>About Capacity Connect</h3>
                    <small style={{ color: "#64748B" }}>India Meteorological Department · Ministry of Earth Sciences</small>
                  </div>
                </div>

                <p style={{ fontSize: "14px", lineHeight: "1.65", color: "#334155" }}>
                  <strong>Capacity Connect</strong> is the official digital training, capability diagnostics, and competency advancement infrastructure developed for the India Meteorological Department (IMD) nationwide.
                </p>

                <h4 style={{ fontSize: "14px", color: "#0056D2", margin: "18px 0 8px" }}>Key Objectives</h4>
                <ul style={{ fontSize: "13.5px", color: "#475569", lineHeight: "1.6", paddingLeft: "20px" }}>
                  <li><strong>Standardized Radar Competency:</strong> Systematic L1 Awareness through L5 Expert mastery in Doppler Weather Radar operations, signal processing, and nowcasting.</li>
                  <li><strong>Prerequisite-Enforced Learning:</strong> Strict developmental gates preventing premature enrollment in advanced scanning patterns before fundamentals are mastered.</li>
                  <li><strong>Capability Passport & Verification:</strong> Tamper-evident official digital certificates linked to national weather radar duty rosters.</li>
                  <li><strong>Low-Bandwidth Resilience (Field Mode):</strong> Engineered for remote radar stations (e.g., coastal and high-altitude radars) with low visual overhead.</li>
                </ul>
              </div>
            )}

            {/* MODAL: FAQS */}
            {activeModal === "faqs" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EFF6FF", color: "#0056D2", display: "grid", placeItems: "center" }}>
                    <HelpCircle size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "20px", color: "#0F172A" }}>Frequently Asked Questions (FAQs)</h3>
                    <small style={{ color: "#64748B" }}>Common Operational & Training Inquiries</small>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
                  <div style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "10px" }}>
                    <strong style={{ fontSize: "13.5px", color: "#0F172A" }}>Q1: How does competency level advancement work?</strong>
                    <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0 0", lineHeight: "1.5" }}>
                      To advance from L1 to L2 or L2 to L3, you must enroll in the recommended course, complete 100% of its curriculum lessons, and achieve a passing score (≥60%) on the post-course assessment. Your verified level updates automatically upon passing.
                    </p>
                  </div>

                  <div style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "10px" }}>
                    <strong style={{ fontSize: "13.5px", color: "#0F172A" }}>Q2: How do I get account clearance after registering?</strong>
                    <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0 0", lineHeight: "1.5" }}>
                      Registrations undergo administrative clearance by the Directorate Training Division. Once verified, your status changes from "Pending" to "Active" and you can sign in with your registered credentials.
                    </p>
                  </div>

                  <div style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "10px" }}>
                    <strong style={{ fontSize: "13.5px", color: "#0F172A" }}>Q3: Can I retake an assessment if I do not pass?</strong>
                    <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0 0", lineHeight: "1.5" }}>
                      Yes, assessments can be retaken at any time. Your highest verified score is preserved, and level progress will never decrease.
                    </p>
                  </div>

                  <div style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "10px" }}>
                    <strong style={{ fontSize: "13.5px", color: "#0F172A" }}>Q4: What is Field Mode (Low-Bandwidth Mode)?</strong>
                    <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0 0", lineHeight: "1.5" }}>
                      Clicking "Field Mode" in the top header switches off heavy visual components, gradients, and extraneous scripts, reducing data transfer for remote field radar stations with limited satellite bandwidth.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: LICENSING & POLICIES */}
            {activeModal === "licensing" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EFF6FF", color: "#0056D2", display: "grid", placeItems: "center" }}>
                    <Shield size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "20px", color: "#0F172A" }}>Governance, Policies & Licensing</h3>
                    <small style={{ color: "#64748B" }}>Ministry of Earth Sciences · Government of India</small>
                  </div>
                </div>

                <div style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.6" }}>
                  <p>
                    <strong>Government Open Data License (GODL India):</strong> All published educational curricula, radar reference manuals, and standard operating procedures are governed by the National Data Sharing and Accessibility Policy (NDSAP).
                  </p>
                  <p>
                    <strong>Data Sovereignty & Security:</strong> Trainee records, radar diagnostics, and assessment attempts are encrypted and retained within Government of India cloud infrastructure adhering to CERT-In cybersecurity directives.
                  </p>
                  <p>
                    <strong>Privacy Policy:</strong> Personal operational credentials and duty logs are utilized solely for institutional capability tracking, roster qualification, and disaster response forecaster accreditation.
                  </p>
                </div>
              </div>
            )}

            {/* MODAL: ACCESSIBILITY */}
            {activeModal === "accessibility" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EFF6FF", color: "#0056D2", display: "grid", placeItems: "center" }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "20px", color: "#0F172A" }}>Accessibility Compliance (GIGW)</h3>
                    <small style={{ color: "#64748B" }}>Guidelines for Indian Government Websites</small>
                  </div>
                </div>

                <div style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.6" }}>
                  <p>
                    Capacity Connect is committed to ensuring full digital inclusion and accessibility in compliance with the <strong>Guidelines for Indian Government Websites (GIGW 3.0)</strong> and W3C Web Content Accessibility Guidelines (WCAG 2.1 Level AA).
                  </p>
                  <ul style={{ paddingLeft: "20px" }}>
                    <li>Full keyboard accessibility for all navigation drawers, tabs, and assessment forms.</li>
                    <li>Sufficient color contrast ratios (≥4.5:1) for all typography and status indicators.</li>
                    <li>Descriptive ARIA labels and tooltip assistance on all icon-only buttons.</li>
                  </ul>
                </div>
              </div>
            )}

            <div style={{ marginTop: "24px", paddingTop: "14px", borderTop: "1px solid #E2E8F0", textAlign: "right" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={closeModal}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
