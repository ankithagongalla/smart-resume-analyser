import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Plus,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

function Profile({ onBack, onContinue }) {
  const [activeSection, setActiveSection] = useState("personal");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
    cgpa: "",
  });

  const [skills, setSkills] = useState([
    "Python",
    "Java",
    "SQL",
  ]);

  const [skillInput, setSkillInput] = useState("");

  const [projects, setProjects] = useState([
    {
      title: "",
      description: "",
      technologies: "",
    },
  ]);

  const [certifications, setCertifications] = useState([
    {
      name: "",
      issuer: "",
      year: "",
    },
  ]);

  const sections = [
    {
      id: "personal",
      label: "Personal",
      icon: UserRound,
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
    },
    {
      id: "skills",
      label: "Skills",
      icon: Sparkles,
    },
    {
      id: "projects",
      label: "Projects",
      icon: BriefcaseBusiness,
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
    },
  ];

  /* =========================
     PROFILE COMPLETION
  ========================= */

  const completion = useMemo(() => {
    let total = 0;
    let completed = 0;

    const fields = Object.values(formData);

    total += fields.length;
    completed += fields.filter(
      (value) => value.trim() !== ""
    ).length;

    total += 1;
    if (skills.length > 0) completed += 1;

    total += 3;

    projects.forEach((project) => {
      if (project.title.trim() !== "") completed += 1;
      if (project.description.trim() !== "") completed += 1;
      if (project.technologies.trim() !== "") completed += 1;
    });

    total += certifications.length * 3;

    certifications.forEach((cert) => {
      if (cert.name.trim() !== "") completed += 1;
      if (cert.issuer.trim() !== "") completed += 1;
      if (cert.year.trim() !== "") completed += 1;
    });

    return Math.min(100, Math.round((completed / total) * 100));
  }, [formData, skills, projects, certifications]);

  /* =========================
     INPUT CHANGE
  ========================= */

  function updateField(field, value) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  /* =========================
     SKILLS
  ========================= */

  function addSkill() {
    const skill = skillInput.trim();

    if (!skill) return;

    if (!skills.includes(skill)) {
      setSkills((previous) => [...previous, skill]);
    }

    setSkillInput("");
  }

  function removeSkill(skill) {
    setSkills((previous) =>
      previous.filter((item) => item !== skill)
    );
  }

  function handleSkillKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  }

  /* =========================
     PROJECTS
  ========================= */

  function addProject() {
    setProjects((previous) => [
      ...previous,
      {
        title: "",
        description: "",
        technologies: "",
      },
    ]);
  }

  function removeProject(index) {
    if (projects.length === 1) return;

    setProjects((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function updateProject(index, field, value) {
    setProjects((previous) =>
      previous.map((project, itemIndex) =>
        itemIndex === index
          ? {
              ...project,
              [field]: value,
            }
          : project
      )
    );
  }

  /* =========================
     CERTIFICATIONS
  ========================= */

  function addCertification() {
    setCertifications((previous) => [
      ...previous,
      {
        name: "",
        issuer: "",
        year: "",
      },
    ]);
  }

  function removeCertification(index) {
    if (certifications.length === 1) return;

    setCertifications((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function updateCertification(index, field, value) {
    setCertifications((previous) =>
      previous.map((certificate, itemIndex) =>
        itemIndex === index
          ? {
              ...certificate,
              [field]: value,
            }
          : certificate
      )
    );
  }

  /* =========================
     CONTINUE
  ========================= */

  function handleContinue() {
    const profile = {
      ...formData,
      skills,
      projects,
      certifications,
    };

    onContinue(profile);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f8fb] via-white to-[#edfafa]">

      {/* =========================
          TOP BAR
      ========================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">

        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-6">

          <button
            onClick={onBack}
            className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-[#102a43]"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back
          </button>


          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#102a43] to-[#087f82] text-white shadow-md">
              <UserRound size={17} />
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-bold text-[#102a43]">
                Student Profile
              </p>

              <p className="text-[10px] text-slate-400">
                Career readiness workspace
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2">

            <span className="hidden text-xs font-medium text-slate-400 sm:block">
              Profile completion
            </span>

            <span className="rounded-full bg-[#13a6a8]/10 px-3 py-1.5 text-xs font-bold text-[#087f82]">
              {completion}%
            </span>

          </div>

        </div>

      </header>


      {/* =========================
          PAGE
      ========================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* =========================
            INTRO
        ========================= */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#13a6a8]/20 bg-[#13a6a8]/5 px-3.5 py-2 text-[11px] font-semibold text-[#087f82]">

                <Sparkles size={13} />

                Build your evidence profile

              </div>


              <h1 className="text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">
                Tell us about yourself.
              </h1>


              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Your profile gives the system the academic and practical
                context it needs to understand your skills and career goals.
              </p>

            </div>


            {/* COMPLETION */}

            <div className="min-w-[230px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <span className="text-xs font-semibold text-slate-500">
                  Profile strength
                </span>

                <span className="text-sm font-bold text-[#087f82]">
                  {completion}%
                </span>

              </div>


              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#13a6a8] to-[#55d4d0] transition-all duration-500"
                  style={{
                    width: `${completion}%`,
                  }}
                />

              </div>

              <p className="mt-2 text-[10px] text-slate-400">
                Complete more sections for better analysis.
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            SECTION NAVIGATION
        ========================= */}

        <div className="mb-6 overflow-x-auto">

          <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

            {sections.map((section) => {

              const Icon = section.icon;
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#102a43] text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
                  }`}
                >

                  <Icon size={15} />

                  {section.label}

                </button>
              );
            })}

          </div>

        </div>


        {/* =========================
            CONTENT
        ========================= */}

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">


          {/* MAIN FORM */}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">


            {/* PERSONAL */}

            {activeSection === "personal" && (
              <SectionWrapper
                icon={UserRound}
                label="PERSONAL INFORMATION"
                title="Let's start with the basics."
                description="These details help create your personal career profile."
              >

                <div className="grid gap-5 md:grid-cols-2">

                  <InputField
                    label="Full name"
                    placeholder="e.g. Ankitha Gongalla"
                    value={formData.name}
                    onChange={(value) =>
                      updateField("name", value)
                    }
                  />

                  <InputField
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(value) =>
                      updateField("email", value)
                    }
                  />

                  <InputField
                    label="Phone number"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(value) =>
                      updateField("phone", value)
                    }
                  />

                  <InputField
                    label="Location"
                    placeholder="e.g. Hyderabad, Telangana"
                    value={formData.location}
                    onChange={(value) =>
                      updateField("location", value)
                    }
                  />

                </div>

              </SectionWrapper>
            )}


            {/* EDUCATION */}

            {activeSection === "education" && (
              <SectionWrapper
                icon={GraduationCap}
                label="EDUCATION"
                title="Tell us about your education."
                description="Academic information provides important context for career-readiness analysis."
              >

                <div className="grid gap-5 md:grid-cols-2">

                  <InputField
                    label="College / University"
                    placeholder="e.g. Vardhaman College of Engineering"
                    value={formData.college}
                    onChange={(value) =>
                      updateField("college", value)
                    }
                  />

                  <InputField
                    label="Degree"
                    placeholder="e.g. B.Tech"
                    value={formData.degree}
                    onChange={(value) =>
                      updateField("degree", value)
                    }
                  />

                  <InputField
                    label="Branch / Specialization"
                    placeholder="e.g. Computer Science & Engineering"
                    value={formData.branch}
                    onChange={(value) =>
                      updateField("branch", value)
                    }
                  />

                  <InputField
                    label="Graduation year"
                    placeholder="e.g. 2027"
                    value={formData.graduationYear}
                    onChange={(value) =>
                      updateField("graduationYear", value)
                    }
                  />

                  <InputField
                    label="CGPA / Percentage"
                    placeholder="e.g. 8.5"
                    value={formData.cgpa}
                    onChange={(value) =>
                      updateField("cgpa", value)
                    }
                  />

                </div>

              </SectionWrapper>
            )}


            {/* SKILLS */}

            {activeSection === "skills" && (
              <SectionWrapper
                icon={Sparkles}
                label="SKILLS"
                title="What can you do?"
                description="Add the technical and professional skills you currently have."
              >

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                  <label className="text-xs font-bold text-[#102a43]">
                    Add a skill
                  </label>


                  <div className="mt-3 flex gap-2">

                    <input
                      value={skillInput}
                      onChange={(event) =>
                        setSkillInput(event.target.value)
                      }
                      onKeyDown={handleSkillKeyDown}
                      placeholder="e.g. React, Git, Machine Learning..."
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13a6a8] focus:ring-4 focus:ring-[#13a6a8]/10"
                    />

                    <button
                      onClick={addSkill}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#102a43] text-white transition hover:bg-[#087f82]"
                    >
                      <Plus size={18} />
                    </button>

                  </div>


                  <div className="mt-5 flex flex-wrap gap-2">

                    {skills.map((skill) => (

                      <div
                        key={skill}
                        className="group flex items-center gap-2 rounded-full border border-[#13a6a8]/20 bg-[#13a6a8]/5 px-3.5 py-2 text-xs font-semibold text-[#087f82]"
                      >

                        {skill}

                        <button
                          onClick={() => removeSkill(skill)}
                          className="opacity-50 transition hover:opacity-100"
                        >
                          <X size={13} />
                        </button>

                      </div>

                    ))}

                  </div>

                </div>


                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-5">

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Sparkles size={16} />
                    </div>

                    <div>

                      <p className="text-xs font-bold text-[#102a43]">
                        Research note
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Later, the system will compare these claimed skills
                        with evidence extracted from your resume and projects.
                      </p>

                    </div>

                  </div>

                </div>

              </SectionWrapper>
            )}


            {/* PROJECTS */}

            {activeSection === "projects" && (
              <SectionWrapper
                icon={BriefcaseBusiness}
                label="PROJECTS"
                title="Show what you've built."
                description="Projects provide practical evidence for the skills you claim."
              >

                <div className="space-y-5">

                  {projects.map((project, index) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102a43] text-xs font-bold text-white">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <p className="text-sm font-bold text-[#102a43]">
                            Project {index + 1}
                          </p>

                        </div>


                        {projects.length > 1 && (
                          <button
                            onClick={() => removeProject(index)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}

                      </div>


                      <div className="mt-5 space-y-4">

                        <InputField
                          label="Project title"
                          placeholder="e.g. Smart Resume Analyser"
                          value={project.title}
                          onChange={(value) =>
                            updateProject(
                              index,
                              "title",
                              value
                            )
                          }
                        />


                        <TextAreaField
                          label="Project description"
                          placeholder="Briefly explain what you built and what problem it solves..."
                          value={project.description}
                          onChange={(value) =>
                            updateProject(
                              index,
                              "description",
                              value
                            )
                          }
                        />


                        <InputField
                          label="Technologies used"
                          placeholder="e.g. React, Flask, Python, MySQL"
                          value={project.technologies}
                          onChange={(value) =>
                            updateProject(
                              index,
                              "technologies",
                              value
                            )
                          }
                        />

                      </div>

                    </div>

                  ))}


                  <button
                    onClick={addProject}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#13a6a8]/40 bg-[#13a6a8]/5 py-4 text-xs font-bold text-[#087f82] transition hover:bg-[#13a6a8]/10"
                  >

                    <Plus size={16} />

                    Add another project

                  </button>

                </div>

              </SectionWrapper>
            )}


            {/* CERTIFICATIONS */}

            {activeSection === "certifications" && (
              <SectionWrapper
                icon={Award}
                label="CERTIFICATIONS"
                title="Add your certifications."
                description="Certifications can provide additional evidence of structured learning."
              >

                <div className="space-y-5">

                  {certifications.map((certificate, index) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                            <Award size={16} />
                          </div>

                          <p className="text-sm font-bold text-[#102a43]">
                            Certification {index + 1}
                          </p>

                        </div>


                        {certifications.length > 1 && (
                          <button
                            onClick={() =>
                              removeCertification(index)
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}

                      </div>


                      <div className="mt-5 grid gap-4 md:grid-cols-2">

                        <InputField
                          label="Certification name"
                          placeholder="e.g. NPTEL Java"
                          value={certificate.name}
                          onChange={(value) =>
                            updateCertification(
                              index,
                              "name",
                              value
                            )
                          }
                        />


                        <InputField
                          label="Issuing organization"
                          placeholder="e.g. NPTEL"
                          value={certificate.issuer}
                          onChange={(value) =>
                            updateCertification(
                              index,
                              "issuer",
                              value
                            )
                          }
                        />


                        <InputField
                          label="Year"
                          placeholder="e.g. 2026"
                          value={certificate.year}
                          onChange={(value) =>
                            updateCertification(
                              index,
                              "year",
                              value
                            )
                          }
                        />

                      </div>

                    </div>

                  ))}


                  <button
                    onClick={addCertification}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 py-4 text-xs font-bold text-amber-700 transition hover:bg-amber-50"
                  >

                    <Plus size={16} />

                    Add another certification

                  </button>

                </div>

              </SectionWrapper>
            )}


            {/* BOTTOM NAVIGATION */}

            <div className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">

              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(
                    (item) => item.id === activeSection
                  );

                  if (currentIndex > 0) {
                    setActiveSection(
                      sections[currentIndex - 1].id
                    );
                  } else {
                    onBack();
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
              >

                <ArrowLeft size={15} />

                Previous

              </button>


              {activeSection === "certifications" ? (

                <button
                  onClick={handleContinue}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#102a43] to-[#087f82] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#102a43]/15 transition hover:-translate-y-0.5"
                >

                  Save profile & continue

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </button>

              ) : (

                <button
                  onClick={() => {

                    const currentIndex =
                      sections.findIndex(
                        (item) =>
                          item.id === activeSection
                      );

                    setActiveSection(
                      sections[currentIndex + 1].id
                    );

                  }}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#102a43] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#102a43]/10 transition hover:-translate-y-0.5 hover:bg-[#173c5d]"
                >

                  Continue

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </button>

              )}

            </div>

          </div>


          {/* =========================
              RIGHT SIDE SUMMARY
          ========================= */}

          <aside className="hidden lg:block">

            <div className="sticky top-24 space-y-4">


              {/* PROFILE CARD */}

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="bg-gradient-to-br from-[#102a43] to-[#087f82] p-6 text-white">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                    <UserRound size={24} />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#b9ffff]">
                    Profile preview
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    {formData.name || "Your name"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-300">
                    {formData.branch || "Your specialization"}
                  </p>

                </div>


                <div className="p-5">

                  <SummaryItem
                    icon={GraduationCap}
                    label="Education"
                    value={
                      formData.college ||
                      "Not added yet"
                    }
                  />

                  <SummaryItem
                    icon={Sparkles}
                    label="Skills"
                    value={`${skills.length} skills added`}
                  />

                  <SummaryItem
                    icon={BriefcaseBusiness}
                    label="Projects"
                    value={`${projects.filter(
                      (project) =>
                        project.title.trim() !== ""
                    ).length} projects`}
                  />

                  <SummaryItem
                    icon={Award}
                    label="Certifications"
                    value={`${certifications.filter(
                      (certificate) =>
                        certificate.name.trim() !== ""
                    ).length} certifications`}
                  />

                </div>

              </div>


              {/* WHY */}

              <div className="rounded-3xl border border-[#13a6a8]/20 bg-[#13a6a8]/5 p-5">

                <div className="flex gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#087f82] shadow-sm">
                    <BookOpen size={16} />
                  </div>

                  <div>

                    <p className="text-xs font-bold text-[#102a43]">
                      Why this matters
                    </p>

                    <p className="mt-2 text-[11px] leading-5 text-slate-500">

                      This information will later become part of the
                      evidence used by the skill-gap and readiness models.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   SECTION WRAPPER
========================================================= */

function SectionWrapper({
  icon: Icon,
  label,
  title,
  description,
  children,
}) {

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">

      <div className="mb-8 flex gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#087f82] text-white shadow-lg shadow-[#087f82]/10">

          <Icon size={20} />

        </div>


        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#13a6a8]">
            {label}
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#102a43]">
            {title}
          </h2>

          <p className="mt-2 text-xs leading-6 text-slate-400">
            {description}
          </p>

        </div>

      </div>


      {children}

    </div>
  );
}


/* =========================================================
   INPUT
========================================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {

  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-[#102a43]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#102a43] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#13a6a8] focus:ring-4 focus:ring-[#13a6a8]/10"
      />

    </div>
  );
}


/* =========================================================
   TEXT AREA
========================================================= */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}) {

  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-[#102a43]">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#102a43] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#13a6a8] focus:ring-4 focus:ring-[#13a6a8]/10"
      />

    </div>
  );
}


/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  icon: Icon,
  label,
  value,
}) {

  return (
    <div className="flex gap-3 border-b border-slate-100 py-3 last:border-0">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#087f82]">
        <Icon size={14} />
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-semibold text-[#102a43]">
          {value}
        </p>

      </div>

    </div>
  );
}

export default Profile;