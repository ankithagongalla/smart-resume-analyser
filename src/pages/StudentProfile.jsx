import { useState } from "react";
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";

function StudentProfile({ onContinue }) {
  const [profile, setProfile] = useState({
    name: "",
    branch: "",
    year: "",
    college: "",
    skills: "",
    projects: "",
    certifications: "",
    internships: "",
    interests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = () => {
    if (!profile.name || !profile.branch || !profile.year) {
      alert("Please fill your name, branch and year.");
      return;
    }

    console.log("STUDENT PROFILE:", profile);

    onContinue(profile);
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#142033]">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102a43]">
              <User size={20} className="text-white" />
            </div>

            <div>
              <div className="text-lg font-bold text-[#102a43]">
                evidence
                <span className="text-[#13a6a8]">.</span>
              </div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Career readiness
              </p>
            </div>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="mx-auto max-w-4xl px-6 py-12">

        <div className="mx-auto max-w-3xl">

          {/* INTRO */}

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#13a6a8]/10 text-[#087f82]">
              <GraduationCap size={28} />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#13a6a8]">
              Student profile
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">
              Tell us about yourself
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Your profile will be combined with your resume to understand
              your actual skills, experience and career preparation.
            </p>

          </div>


          {/* BASIC INFORMATION */}

          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8f8] text-[#087f82]">
                <User size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#102a43]">
                  Basic information
                </h2>

                <p className="text-xs text-slate-400">
                  Tell us about your academic background.
                </p>
              </div>

            </div>


            <div className="grid gap-5 sm:grid-cols-2">

              <Input
                label="Full name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />

              <Input
                label="College / University"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="Enter your college"
              />

              <Select
                label="Branch / Domain"
                name="branch"
                value={profile.branch}
                onChange={handleChange}
                options={[
                  "Computer Science",
                  "Information Technology",
                  "Electronics & Communication",
                  "Electrical Engineering",
                  "Mechanical Engineering",
                  "Civil Engineering",
                  "Artificial Intelligence",
                  "Data Science",
                  "Other",
                ]}
              />

              <Select
                label="Current year"
                name="year"
                value={profile.year}
                onChange={handleChange}
                options={[
                  "1st Year",
                  "2nd Year",
                  "3rd Year",
                  "4th Year",
                  "Graduate",
                ]}
              />

            </div>

          </section>


          {/* SKILLS */}

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8f8] text-[#087f82]">
                <Code2 size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#102a43]">
                  Current technical skills
                </h2>

                <p className="text-xs text-slate-400">
                  Include programming languages, frameworks and tools.
                </p>
              </div>

            </div>

            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="Example: Python, Java, C, HTML, CSS, JavaScript, SQL, Git, React..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
            />

          </section>


          {/* PROJECTS */}

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8f8] text-[#087f82]">
                <FolderGit2 size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#102a43]">
                  Projects
                </h2>

                <p className="text-xs text-slate-400">
                  Mention projects you have built or are currently building.
                </p>
              </div>

            </div>

            <textarea
              name="projects"
              value={profile.projects}
              onChange={handleChange}
              placeholder="Example: Smart Resume Analyser, HealthGuard-AI, Portfolio..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
            />

          </section>


          {/* CERTIFICATIONS */}

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8f8] text-[#087f82]">
                <Award size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#102a43]">
                  Certifications & learning
                </h2>

                <p className="text-xs text-slate-400">
                  Add certifications, courses or technologies you are learning.
                </p>
              </div>

            </div>

            <textarea
              name="certifications"
              value={profile.certifications}
              onChange={handleChange}
              placeholder="Example: NPTEL Java, Generative AI Foundations, Python certification..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
            />

          </section>


          {/* EXPERIENCE */}

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8f8] text-[#087f82]">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#102a43]">
                  Internships / experience
                </h2>

                <p className="text-xs text-slate-400">
                  Mention internships, training or practical experience.
                </p>
              </div>

            </div>

            <textarea
              name="internships"
              value={profile.internships}
              onChange={handleChange}
              placeholder="Example: Web development internship, virtual internship, training..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
            />

          </section>


          {/* CAREER INTEREST */}

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8f8] text-[#087f82]">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#102a43]">
                  Career interests
                </h2>

                <p className="text-xs text-slate-400">
                  You can mention multiple careers you are considering.
                </p>
              </div>

            </div>

            <textarea
              name="interests"
              value={profile.interests}
              onChange={handleChange}
              placeholder="Example: Full Stack Development, Software Engineering, AI Engineering..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
            />

          </section>


          {/* CONTINUE */}

          <button
            type="button"
            onClick={handleContinue}
            className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#102a43] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#173c5d]"
          >
            Continue to career target

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />

          </button>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   INPUT COMPONENT
========================================================= */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
      />

    </div>
  );
}


/* =========================================================
   SELECT COMPONENT
========================================================= */

function Select({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


export default StudentProfile;