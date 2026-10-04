import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  UserRound,
  GraduationCap,
  Code2,
  FolderKanban,
  Award,
  BriefcaseBusiness,
  Sparkles,
  Pencil,
  Plus,
  X,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function ResumeExtraction({
  resumeFile,
  careerTarget,
  extractedData,
  onBack,
  onContinue,
}) {
  const [editing, setEditing] = useState(false);

  /*
   * IMPORTANT
   * ---------------------------------------------
   * Use the REAL DATA returned from Flask.
   * Do NOT create temporary/sample resume data here.
   */

  const [resumeData, setResumeData] = useState(() => ({
    name: extractedData?.name || "",
    email: extractedData?.email || "",
    phone: extractedData?.phone || "",
    location: extractedData?.location || "",

    education: Array.isArray(extractedData?.education)
      ? extractedData.education
      : [],

    skills: Array.isArray(extractedData?.skills)
      ? extractedData.skills
      : [],

    projects: Array.isArray(extractedData?.projects)
      ? extractedData.projects
      : [],

    certifications: Array.isArray(extractedData?.certifications)
      ? extractedData.certifications
      : [],

    experience: Array.isArray(extractedData?.experience)
      ? extractedData.experience
      : [],
  }));

  const [newSkill, setNewSkill] = useState("");

  const fileName = useMemo(() => {
    if (!resumeFile) {
      return "Uploaded Resume";
    }

    return resumeFile.name || "Uploaded Resume";
  }, [resumeFile]);

  /*
   * ---------------------------------------------
   * UPDATE BASIC FIELD
   * ---------------------------------------------
   */

  const updateBasicField = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /*
   * ---------------------------------------------
   * REMOVE SKILL
   * ---------------------------------------------
   */

  const handleRemoveSkill = (skill) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (item) => item !== skill
      ),
    }));
  };

  /*
   * ---------------------------------------------
   * ADD SKILL
   * ---------------------------------------------
   */

  const handleAddSkill = () => {
    const skill = newSkill.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = resumeData.skills.some(
      (item) =>
        item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setNewSkill("");
      return;
    }

    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));

    setNewSkill("");
  };

  /*
   * ---------------------------------------------
   * CONTINUE
   * ---------------------------------------------
   */

  const handleContinue = () => {
    console.log(
      "================================="
    );

    console.log(
      "FINAL EXTRACTED RESUME DATA"
    );

    console.log(
      "================================="
    );

    console.log(resumeData);

    onContinue(resumeData);
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#172033]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">

          <button
            onClick={onBack}
            className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-[#102a43]"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#102a43] to-[#087f82] shadow-md">
              <FileText
                size={18}
                className="text-white"
              />
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-bold text-[#102a43]">
                Smart Resume Analyser
              </p>

              <p className="text-[10px] text-slate-400">
                Resume extraction
              </p>

            </div>

          </div>

          <div className="w-[65px]" />

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">

        {/* ===================================================
            SUCCESS HEADER
        =================================================== */}

        <section className="mb-8">

          <div className="mb-5 flex flex-wrap items-center gap-3">

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700">

              <CheckCircle2 size={14} />

              Resume extracted successfully

            </div>

            {careerTarget && (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#13a6a8]/20 bg-[#13a6a8]/5 px-3.5 py-2 text-xs font-semibold text-[#087f82]">

                <Sparkles size={14} />

                Target: {careerTarget}

              </div>
            )}

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">
            Let's understand your resume.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            We extracted the following information from your
            uploaded resume. Review the information before
            continuing to the skill-gap analysis.
          </p>

        </section>


        {/* ===================================================
            FILE BAR
        =================================================== */}

        <section className="mb-7 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef8f8] text-[#087f82]">
                <FileText size={21} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-bold text-[#102a43]">
                  {fileName}
                </p>

                <p className="mt-1 text-xs text-emerald-600">
                  Information successfully extracted from resume
                </p>

              </div>

            </div>

            <button
              onClick={() => setEditing(!editing)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                editing
                  ? "bg-slate-100 text-slate-600"
                  : "bg-[#102a43] text-white hover:bg-[#173c5d]"
              }`}
            >

              <Pencil size={14} />

              {editing
                ? "Done editing"
                : "Review & edit"}

            </button>

          </div>

        </section>


        {/* ===================================================
            PERSONAL INFORMATION
        =================================================== */}

        <section className="mb-6">

          <SectionHeading
            icon={UserRound}
            number="01"
            title="Personal information"
            description="Information extracted from the contact section of your resume."
          />

          <div className="mt-4 grid gap-4 md:grid-cols-2">

            <InfoField
              icon={UserRound}
              label="Full name"
              value={resumeData.name}
              editing={editing}
              placeholder="Name not detected"
              onChange={(value) =>
                updateBasicField(
                  "name",
                  value
                )
              }
            />

            <InfoField
              icon={Mail}
              label="Email address"
              value={resumeData.email}
              editing={editing}
              placeholder="Email not detected"
              onChange={(value) =>
                updateBasicField(
                  "email",
                  value
                )
              }
            />

            <InfoField
              icon={Phone}
              label="Phone number"
              value={resumeData.phone}
              editing={editing}
              placeholder="Phone number not detected"
              onChange={(value) =>
                updateBasicField(
                  "phone",
                  value
                )
              }
            />

            <InfoField
              icon={MapPin}
              label="Location"
              value={resumeData.location}
              editing={editing}
              placeholder="Location not detected"
              onChange={(value) =>
                updateBasicField(
                  "location",
                  value
                )
              }
            />

          </div>

        </section>


        {/* ===================================================
            EDUCATION
        =================================================== */}

        <section className="mb-6">

          <SectionHeading
            icon={GraduationCap}
            number="02"
            title="Education"
            description="Academic qualifications extracted from your resume."
          />

          {resumeData.education.length > 0 ? (

            <div className="mt-4 space-y-4">

              {resumeData.education.map(
                (education, index) => (

                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-start gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef8f8] text-[#087f82]">
                        <GraduationCap size={19} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-sm font-bold text-[#102a43]">
                          {education.degree ||
                            "Degree not detected"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {education.institution ||
                            "Institution not detected"}
                        </p>

                        {education.year && (
                          <p className="mt-2 text-[11px] font-semibold text-[#087f82]">
                            {education.year}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <EmptySection
              icon={GraduationCap}
              title="No education detected"
              description="No education information was extracted from the resume."
            />

          )}

        </section>


        {/* ===================================================
            SKILLS
        =================================================== */}

        <section className="mb-6">

          <SectionHeading
            icon={Code2}
            number="03"
            title="Technical skills"
            description="Technical skills identified from your resume."
          />

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            {resumeData.skills.length > 0 ? (

              <div className="flex flex-wrap gap-2.5">

                {resumeData.skills.map(
                  (skill, index) => (

                    <div
                      key={`${skill}-${index}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-[#13a6a8]/20 bg-[#f0fbfb] px-3.5 py-2 text-xs font-semibold text-[#087f82]"
                    >

                      {skill}

                      {editing && (
                        <button
                          onClick={() =>
                            handleRemoveSkill(
                              skill
                            )
                          }
                          className="rounded-full p-0.5 text-[#087f82] transition hover:bg-[#087f82] hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      )}

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="text-sm text-slate-400">
                No technical skills detected.
              </p>

            )}

            {editing && (
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">

                <input
                  value={newSkill}
                  onChange={(e) =>
                    setNewSkill(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {

                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }

                  }}
                  placeholder="Add another skill..."
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs outline-none transition focus:border-[#13a6a8] focus:bg-white focus:ring-4 focus:ring-[#13a6a8]/10"
                />

                <button
                  onClick={handleAddSkill}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#102a43] px-5 text-xs font-bold text-white transition hover:bg-[#173c5d]"
                >

                  <Plus size={14} />

                  Add skill

                </button>

              </div>
            )}

          </div>

        </section>


        {/* ===================================================
            PROJECTS
        =================================================== */}

        <section className="mb-6">

          <SectionHeading
            icon={FolderKanban}
            number="04"
            title="Projects"
            description="Projects identified from your resume."
          />

          {resumeData.projects.length > 0 ? (

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              {resumeData.projects.map(
                (project, index) => (

                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-start gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-[#102a43]">
                        <FolderKanban size={18} />
                      </div>

                      <div className="min-w-0">

                        <h3 className="text-sm font-bold text-[#102a43]">
                          {project.name ||
                            "Project"}
                        </h3>

                        {project.description && (
                          <p className="mt-2 text-xs leading-6 text-slate-500">
                            {project.description}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <EmptySection
              icon={FolderKanban}
              title="No projects detected"
              description="No project information was extracted from the resume."
            />

          )}

        </section>


        {/* ===================================================
            CERTIFICATIONS
        =================================================== */}

        <section className="mb-6">

          <SectionHeading
            icon={Award}
            number="05"
            title="Certifications"
            description="Certifications identified from your resume."
          />

          {resumeData.certifications.length > 0 ? (

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              {resumeData.certifications.map(
                (certificate, index) => (

                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                        <Award size={18} />
                      </div>

                      <p className="text-sm font-bold text-[#102a43]">
                        {typeof certificate ===
                        "string"
                          ? certificate
                          : certificate.name ||
                            "Certification"}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <EmptySection
              icon={Award}
              title="No certifications detected"
              description="No certification information was extracted from the resume."
            />

          )}

        </section>


        {/* ===================================================
            EXPERIENCE
        =================================================== */}

        <section className="mb-10">

          <SectionHeading
            icon={BriefcaseBusiness}
            number="06"
            title="Experience & internships"
            description="Professional experience identified from your resume."
          />

          {resumeData.experience.length > 0 ? (

            <div className="mt-4 space-y-4">

              {resumeData.experience.map(
                (experience, index) => (

                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-start gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-[#102a43]">
                        <BriefcaseBusiness size={18} />
                      </div>

                      <div>

                        <h3 className="text-sm font-bold text-[#102a43]">
                          {experience.role ||
                            "Experience"}
                        </h3>

                        {experience.company && (
                          <p className="mt-1 text-xs text-slate-500">
                            {experience.company}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <EmptySection
              icon={BriefcaseBusiness}
              title="No professional experience detected"
              description="No internships or professional experience were found in the resume."
            />

          )}

        </section>


        {/* ===================================================
            CONTINUE
        =================================================== */}

        <section className="rounded-[2rem] border border-[#13a6a8]/20 bg-gradient-to-br from-[#eefafa] via-white to-[#f4f8fb] p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#087f82] text-white shadow-lg shadow-[#087f82]/20">

                <CheckCircle2 size={21} />

              </div>

              <div>

                <p className="text-sm font-bold text-[#102a43]">
                  Resume extraction complete
                </p>

                <p className="mt-1 max-w-xl text-xs leading-6 text-slate-500">
                  Your resume information has been extracted
                  successfully. Continue to compare your skills
                  with your selected career target.
                </p>

              </div>

            </div>

            <button
              onClick={handleContinue}
              className="group flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#102a43] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#102a43]/10 transition hover:-translate-y-0.5 hover:bg-[#173c5d]"
            >

              Continue to analysis

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon: Icon,
  number,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#102a43] text-white shadow-sm">
        <Icon size={17} />
      </div>

      <div>

        <div className="flex items-center gap-2">

          <span className="font-mono text-[10px] font-bold text-[#13a6a8]">
            {number}
          </span>

          <h2 className="text-base font-bold text-[#102a43]">
            {title}
          </h2>

        </div>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   INFO FIELD
========================================================= */

function InfoField({
  icon: Icon,
  label,
  value,
  editing,
  placeholder,
  onChange,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#087f82]">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>

          {editing ? (

            <input
              value={value || ""}
              onChange={(e) =>
                onChange(e.target.value)
              }
              placeholder={placeholder}
              className="mt-1 w-full border-b border-slate-200 bg-transparent py-1 text-sm font-semibold text-[#102a43] outline-none transition focus:border-[#13a6a8]"
            />

          ) : (

            <p
              className={`mt-1 truncate text-sm font-semibold ${
                value
                  ? "text-[#102a43]"
                  : "text-slate-300"
              }`}
            >
              {value || placeholder}
            </p>

          )}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   EMPTY SECTION
========================================================= */

function EmptySection({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-9 text-center">

      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

        <Icon size={18} />

      </div>

      <p className="mt-4 text-sm font-bold text-[#102a43]">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
}


export default ResumeExtraction;