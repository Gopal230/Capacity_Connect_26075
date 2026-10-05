import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileAudio,
  FileCode,
  FileImage,
  FileText,
  Film,
  FolderOpen,
  HelpCircle,
  Layers,
  Link2,
  Plus,
  Radio,
  Search,
  Sparkles,
  Tag,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import { Badge, ConfirmButton, EmptyState, PageHeader } from "../../components/UI";
import { LevelBadge } from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";
import { Level, Resource } from "../../types";

const resourceTypes: Resource["type"][] = [
  "Recorded Lecture",
  "Video",
  "PDF",
  "Presentation",
  "Document",
  "Image",
  "Audio",
  "Notes",
  "Dataset",
  "External Link",
];

const acceptFormats =
  "video/*,image/*,audio/*,.pdf,.ppt,.pptx,.doc,.docx,.csv,.xlsx,.txt";

function getMediaTypeIcon(type: Resource["type"]) {
  switch (type) {
    case "Video":
    case "Recorded Lecture":
      return <Film size={22} />;
    case "Image":
      return <FileImage size={22} />;
    case "Audio":
      return <FileAudio size={22} />;
    case "External Link":
      return <Link2 size={22} />;
    case "Presentation":
      return <Layers size={22} />;
    case "Dataset":
      return <FileCode size={22} />;
    default:
      return <FileText size={22} />;
  }
}

function getMediaTypeColor(type: Resource["type"]) {
  switch (type) {
    case "Video":
    case "Recorded Lecture":
      return { bg: "#FEF2F2", text: "var(--brand-primary)", border: "#FECACA", grad: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" };
    case "Image":
      return { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", grad: "linear-gradient(135deg, #064E3B 0%, #022C22 100%)" };
    case "PDF":
    case "Document":
    case "Presentation":
      return { bg: "#FEF2F2", text: "var(--brand-primary)", border: "#FECACA", grad: "linear-gradient(135deg, #081A2E 0%, #0F172A 100%)" };
    case "Audio":
      return { bg: "#FAF5FF", text: "#9333EA", border: "#E9D5FF", grad: "linear-gradient(135deg, #581C87 0%, #1E1B4B 100%)" };
    case "Dataset":
      return { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A", grad: "linear-gradient(135deg, #78350F 0%, #1E293B 100%)" };
    default:
      return { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1", grad: "linear-gradient(135deg, #334155 0%, #0F172A 100%)" };
  }
}

export default function TrainerLibrary() {
  const { db, currentUser, addResource, deleteResource } = useApp();
  const trainer = db.trainers.find((t) => t.userId === currentUser?.id);

  const [q, setQ] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showUpload, setShowUpload] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: trainer?.subjects[0] || "Radar Meteorology",
    type: "Recorded Lecture" as Resource["type"],
    level: "Intermediate" as Level,
    courseId: "",
    moduleId: "",
    lessonId: "",
    competency: "Radar Echo Interpretation",
    description: "",
    tags: "radar, doppler, nowcasting",
    language: "English",
    visibility: "Enrolled Trainees" as NonNullable<Resource["visibility"]>,
    downloadable: true,
    externalUrl: "",
    status: "pending" as NonNullable<Resource["status"]>,
  });

  const course = db.courses.find((c) => c.id === form.courseId);
  const modules = course?.modules || [];
  const module = modules.find((m) => m.id === form.moduleId);

  const resources = useMemo(() => {
    return db.resources.filter((r) => {
      const matchType = selectedType === "all" || r.type === selectedType;
      const matchLevel = selectedLevel === "all" || r.level === selectedLevel;
      const matchStatus = selectedStatus === "all" || (r.status || "published") === selectedStatus;
      const matchQuery = `${r.title} ${r.subject} ${r.competency || ""} ${r.tags?.join(" ") || ""}`
        .toLowerCase()
        .includes(q.toLowerCase());
      return matchType && matchLevel && matchStatus && matchQuery;
    });
  }, [db.resources, q, selectedType, selectedLevel, selectedStatus]);

  // Statistics
  const totalCount = db.resources.length;
  const videoCount = db.resources.filter((r) => r.type === "Video" || r.type === "Recorded Lecture").length;
  const docCount = db.resources.filter((r) => r.type === "PDF" || r.type === "Document" || r.type === "Presentation").length;
  const approvedCount = db.resources.filter((r) => (r.status || "published") === "published").length;

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && f.size > 5 * 1024 * 1024) {
      alert("Prototype local upload limit is 5 MB. Production object storage supports large lecture videos.");
      e.target.value = "";
      return;
    }
    setFile(f);
    if (f && !form.title) {
      setForm((x) => ({
        ...x,
        title: f.name.replace(/\.[^.]+$/, ""),
        type: f.type.startsWith("video")
          ? "Video"
          : f.type.startsWith("image")
          ? "Image"
          : f.type.startsWith("audio")
          ? "Audio"
          : f.type.includes("pdf")
          ? "PDF"
          : x.type,
      }));
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!trainer) return;
    setBusy(true);
    let dataUrl: string | undefined;
    if (file) {
      dataUrl = await new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.readAsDataURL(file);
      });
    }
    addResource({
      ...form,
      trainerId: trainer.id,
      tags: form.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      fileName: file?.name,
      mimeType: file?.type,
      fileSize: file?.size,
      dataUrl,
    });
    setFile(null);
    setForm((x) => ({
      ...x,
      title: "",
      description: "",
      externalUrl: "",
    }));
    setBusy(false);
  };

  return (
    <>
      <PageHeader
        title="IMD Operational Media & Learning Repository"
        subtitle="Author, map and govern standardized training assets including Doppler radar loops, satellite imagery, recorded lectures, and technical references."
      />

      {/* Stats Summary Ribbon */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #CBD5E1",
            borderRadius: "10px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background: "#081A2E",
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <FolderOpen size={22} />
          </div>
          <div>
            <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>
              Total Media Assets
            </span>
            <h3 style={{ margin: 0, fontSize: "20px", color: "#0F172A", fontWeight: 700 }}>
              {totalCount}
            </h3>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #CBD5E1",
            borderRadius: "10px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background: "#FEF2F2",
              color: "var(--brand-primary)",
              border: "1px solid #FECACA",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Video size={22} />
          </div>
          <div>
            <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>
              Video & Lectures
            </span>
            <h3 style={{ margin: 0, fontSize: "20px", color: "var(--brand-primary)", fontWeight: 700 }}>
              {videoCount}
            </h3>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #CBD5E1",
            borderRadius: "10px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background: "#FEF2F2",
              color: "var(--brand-primary)",
              border: "1px solid #FECACA",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>
              Technical Docs & PDFs
            </span>
            <h3 style={{ margin: 0, fontSize: "20px", color: "var(--brand-primary)", fontWeight: 700 }}>
              {docCount}
            </h3>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #CBD5E1",
            borderRadius: "10px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background: "#ECFDF5",
              color: "#16A34A",
              border: "1px solid #BBF7D0",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>
              Verified & Published
            </span>
            <h3 style={{ margin: 0, fontSize: "20px", color: "#16A34A", fontWeight: 700 }}>
              {approvedCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Governed Ingestion Studio Panel */}
      <section
        className="panel"
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          border: "1.5px solid #CBD5E1",
          padding: "24px",
          marginBottom: "28px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1.5px solid #E2E8F0",
            paddingBottom: "16px",
            marginBottom: "22px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--brand-primary)",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                padding: "3px 8px",
                borderRadius: "4px",
                marginBottom: "4px",
              }}
            >
              <UploadCloud size={13} />
              Governed Content Ingestion
            </div>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#0F172A", fontWeight: 700 }}>
              Upload & Map Learning Media
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#16A34A",
                background: "#ECFDF5",
                border: "1px solid #BBF7D0",
                padding: "4px 10px",
                borderRadius: "6px",
                fontWeight: 600,
              }}
            >
              Course → Module → Lesson → Competency
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowUpload(!showUpload)}
            >
              {showUpload ? "Collapse Form" : "Expand Form"}
            </button>
          </div>
        </div>

        {showUpload && (
          <form onSubmit={submit}>
            {/* File Dropzone */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #CBD5E1",
                  borderRadius: "12px",
                  padding: "28px 20px",
                  background: file ? "#FEF2F2" : "#F8FAFC",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: file ? "var(--brand-primary)" : "#081A2E",
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <UploadCloud size={26} />
                </div>
                <strong style={{ fontSize: "15px", color: "#0F172A", marginBottom: "4px" }}>
                  {file ? file.name : "Choose media or learning file to upload"}
                </strong>
                <span style={{ fontSize: "12.5px", color: "#64748B" }}>
                  Supported: Video (MP4/WebM), Image (PNG/JPG), Audio (MP3), PDF, PPT, DOC, CSV/XLSX · Local Prototype max 5 MB
                </span>
                {file && (
                  <span
                    style={{
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "var(--brand-primary)",
                      fontWeight: 700,
                      background: "#FFFFFF",
                      border: "1px solid #FECACA",
                      padding: "2px 10px",
                      borderRadius: "9999px",
                    }}
                  >
                    File Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                )}
                <input type="file" accept={acceptFormats} onChange={pick} style={{ display: "none" }} />
              </label>
            </div>

            {/* Input Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Resource Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Doppler Velocity De-aliasing Operations"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Media Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Resource["type"] })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px", background: "#FFFFFF" }}
                >
                  {resourceTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Operational Subject *
                </label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Radar Meteorology"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Target Competency *
                </label>
                <input
                  required
                  value={form.competency}
                  onChange={(e) => setForm({ ...form, competency: e.target.value })}
                  placeholder="e.g. Severe Weather Nowcasting"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Competency Level
                </label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value as Level })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px", background: "#FFFFFF" }}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Map to Course
                </label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value, moduleId: "", lessonId: "" })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px", background: "#FFFFFF" }}
                >
                  <option value="">Shared library (No course)</option>
                  {db.courses
                    .filter((c) => c.trainerId === trainer?.id || true)
                    .map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.code} — {c.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Map to Module
                </label>
                <select
                  value={form.moduleId}
                  disabled={!course}
                  onChange={(e) => setForm({ ...form, moduleId: e.target.value, lessonId: "" })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px", background: course ? "#FFFFFF" : "#F1F5F9" }}
                >
                  <option value="">Select module</option>
                  {modules.map((m) => (
                    <option value={m.id} key={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Map to Lesson
                </label>
                <select
                  value={form.lessonId}
                  disabled={!module}
                  onChange={(e) => setForm({ ...form, lessonId: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px", background: module ? "#FFFFFF" : "#F1F5F9" }}
                >
                  <option value="">Select lesson</option>
                  {module?.lessons.map((l) => (
                    <option value={l.id} key={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Language & Visibility
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                    style={{ flex: 1, padding: "9px 10px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13px", background: "#FFFFFF" }}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Bilingual</option>
                  </select>
                  <select
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value as any })}
                    style={{ flex: 1.2, padding: "9px 10px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13px", background: "#FFFFFF" }}
                  >
                    <option>Enrolled Trainees</option>
                    <option>All Approved Users</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description & Tags */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
              {form.type === "External Link" && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    External Resource URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={form.externalUrl}
                    onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                    placeholder="https://imd.gov.in/radar/resources/..."
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px" }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Operational Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Explain how this learning media supports IMD operational procedures and competency progression..."
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Keywords & Tags
                  </label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="radar, nowcasting, monsoon, dwr"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #CBD5E1", fontSize: "13.5px" }}
                  />
                </div>

                <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", fontWeight: 600, color: "#1E293B", paddingTop: "20px" }}>
                  <input
                    type="checkbox"
                    checked={form.downloadable}
                    onChange={(e) => setForm({ ...form, downloadable: e.target.checked })}
                    style={{ width: "16px", height: "16px", accentColor: "var(--brand-primary)" }}
                  />
                  Allow offline download by authorized trainees
                </label>
              </div>
            </div>

            {/* Submit Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                borderTop: "1.5px solid #E2E8F0",
                paddingTop: "18px",
              }}
            >
              <button
                type="submit"
                className="btn btn-secondary"
                onClick={() => setForm({ ...form, status: "draft" })}
                style={{ fontWeight: 600 }}
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={busy || (!file && form.type !== "External Link")}
                className="btn btn-primary"
                onClick={() => setForm({ ...form, status: "pending" })}
                style={{ fontWeight: 700, padding: "9px 24px" }}
              >
                {busy ? "Processing..." : "Submit for Admin Approval →"}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Filter & Search Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          background: "#FFFFFF",
          border: "1.5px solid #CBD5E1",
          borderRadius: "10px",
          padding: "14px 18px",
          marginBottom: "22px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "380px" }}>
            <Search
              size={17}
              color="#94A3B8"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search resource, subject, or competency..."
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "8px",
                border: "1.5px solid #CBD5E1",
                fontSize: "13.5px",
                background: "#F8FAFC",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1.5px solid #CBD5E1",
              fontSize: "13px",
              fontWeight: 600,
              background: "#F8FAFC",
              color: "#334155",
            }}
          >
            <option value="all">All Media Types</option>
            {resourceTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1.5px solid #CBD5E1",
              fontSize: "13px",
              fontWeight: 600,
              background: "#F8FAFC",
              color: "#334155",
            }}
          >
            <option value="all">All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1.5px solid #CBD5E1",
              fontSize: "13px",
              fontWeight: 600,
              background: "#F8FAFC",
              color: "#334155",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="pending">Pending Review</option>
            <option value="draft">Draft</option>
          </select>

          <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 600, marginLeft: "4px" }}>
            Showing <strong>{resources.length}</strong> of {totalCount}
          </span>
        </div>
      </div>

      {/* Media Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {resources.map((r) => {
          const typeColor = getMediaTypeColor(r.type);
          const mappedCourse = db.courses.find((c) => c.id === r.courseId);

          return (
            <article
              key={r.id}
              style={{
                background: "#FFFFFF",
                borderRadius: "12px",
                border: "1.5px solid #CBD5E1",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              {/* Media Preview Header */}
              <div
                style={{
                  height: "110px",
                  background: typeColor.grad,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  overflow: "hidden",
                }}
              >
                {r.dataUrl && r.mimeType?.startsWith("image") ? (
                  <img
                    src={r.dataUrl}
                    alt={r.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : r.dataUrl && r.mimeType?.startsWith("video") ? (
                  <video
                    src={r.dataUrl}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(4px)",
                        display: "grid",
                        placeItems: "center",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                      }}
                    >
                      {getMediaTypeIcon(r.type)}
                    </div>
                    <span style={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      {r.type}
                    </span>
                  </div>
                )}

                {/* Status Badge in Top Right */}
                <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                  <Badge
                    tone={
                      r.status === "published"
                        ? "green"
                        : r.status === "pending"
                        ? "amber"
                        : "gray"
                    }
                  >
                    {r.status === "published" ? "Published" : r.status === "pending" ? "Pending Review" : "Draft"}
                  </Badge>
                </div>

                {/* Level Pill in Top Left */}
                <div style={{ position: "absolute", top: "10px", left: "10px" }}>
                  <span
                    style={{
                      background: "rgba(15, 23, 42, 0.8)",
                      backdropFilter: "blur(4px)",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    {r.level}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "var(--brand-primary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                    }}
                  >
                    {r.subject}
                  </span>
                  <h3
                    style={{
                      margin: "4px 0 6px",
                      fontSize: "15.5px",
                      color: "#0F172A",
                      fontWeight: 700,
                      lineHeight: 1.4,
                    }}
                  >
                    {r.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12.5px",
                      color: "#475569",
                      lineHeight: 1.45,
                    }}
                  >
                    {r.description || `Mapped competency: ${r.competency || "Operational Forecasting"}`}
                  </p>
                </div>

                {/* Metadata Row */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "12px",
                    borderTop: "1px solid #F1F5F9",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "12px",
                    color: "#64748B",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <BookOpen size={13} />
                      {mappedCourse ? `${mappedCourse.code} (${mappedCourse.title.slice(0, 18)}...)` : "Shared IMD Library"}
                    </span>
                    <span>{r.language || "English"}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>
                      {r.fileSize
                        ? `${(r.fileSize / (1024 * 1024)).toFixed(2)} MB`
                        : r.mimeType || r.type}
                    </span>
                    {r.downloadable && (
                      <span style={{ color: "#16A34A", fontWeight: 600, fontSize: "11.5px" }}>
                        Offline Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    marginTop: "14px",
                    paddingTop: "12px",
                    borderTop: "1px solid #E2E8F0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", gap: "6px" }}>
                    {r.dataUrl ? (
                      <a
                        href={r.dataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <Eye size={13} /> View
                      </a>
                    ) : r.externalUrl ? (
                      <a
                        href={r.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <ExternalLink size={13} /> Open
                      </a>
                    ) : null}

                    {r.downloadable && r.dataUrl && (
                      <a
                        href={r.dataUrl}
                        download={r.fileName || r.title}
                        className="btn btn-secondary btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <Download size={13} /> Download
                      </a>
                    )}
                  </div>

                  {r.trainerId === trainer?.id && (
                    <ConfirmButton
                      label="Remove"
                      className="btn btn-danger-soft btn-sm"
                      confirmText={`Permanently remove "${r.title}" from library?`}
                      onConfirm={() => deleteResource(r.id)}
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!resources.length && (
        <EmptyState
          title="No learning resources found"
          body="No media files match your search criteria. Try adjusting the search filters or upload new operational media above."
        />
      )}
    </>
  );
}
