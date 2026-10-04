import { useEffect, useState } from "react";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

function SkillGapAnalysis({
  resumeData,
  careerTarget,
  careerId,
  careerCode,
  onBack,
  onContinue,
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const resumeSkills = Array.isArray(resumeData?.skills)
          ? resumeData.skills
          : [];

        const resumeProjects = Array.isArray(resumeData?.projects)
          ? resumeData.projects
          : [];

        const resumeCertifications = Array.isArray(
          resumeData?.certifications
        )
          ? resumeData.certifications
          : [];

        const resumeExperience = Array.isArray(resumeData?.experience)
          ? resumeData.experience
          : [];

        if (resumeSkills.length === 0) {
          throw new Error(
            "No skills were detected in the submitted resume. Please go back and check the resume extraction."
          );
        }

        if (!careerTarget && !careerId) {
          throw new Error(
            "No target career was selected. Please go back and select a career."
          );
        }

        const response = await fetch(
          "http://127.0.0.1:5000/api/skill-gap",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              career_id: careerId || null,
              career_code: careerCode || null,
              career_name: careerTarget || null,

              skills: resumeSkills,
              projects: resumeProjects,
              certifications: resumeCertifications,
              experience: resumeExperience,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Skill analysis could not be completed."
          );
        }

        setAnalysis(result);
      } catch (err) {
        console.error("SKILL GAP ANALYSIS ERROR:", err);
        setError(
          err.message || "Unable to complete the skill gap analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [careerId, careerCode, careerTarget, resumeData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fc] px-5">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-[#087f82]"
          />
          <p className="mt-4 text-sm font-bold text-[#102a43]">
            Assessing your career readiness...
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Comparing your resume with the selected career.
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9fc] px-5">
        <div className="max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertTriangle size={38} className="mx-auto text-red-500" />

          <h2 className="mt-4 text-lg font-bold text-[#102a43]">
            Skill assessment could not be completed
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "No assessment data was returned."}
          </p>

          <button
            onClick={onBack}
            className="mt-6 rounded-xl bg-[#102a43] px-5 py-3 text-sm font-bold text-white"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const career = analysis.career || {};

  const matchedSkills = Array.isArray(analysis.matched_skills)
    ? analysis.matched_skills
    : [];

  const partialSkills = Array.isArray(analysis.partial_skills)
    ? analysis.partial_skills
    : [];

  const missingSkills = Array.isArray(analysis.missing_skills)
    ? analysis.missing_skills
    : [];

  const additionalSkills = Array.isArray(analysis.additional_skills)
    ? analysis.additional_skills
    : [];

  const readiness = Number(analysis.readiness_score || 0);

  const coreFound = Array.isArray(analysis.core_found)
    ? analysis.core_found
    : [];

  const recommendedFound = Array.isArray(analysis.recommended_found)
    ? analysis.recommended_found
    : [];

  const corePartial = Array.isArray(analysis.core_partial)
    ? analysis.core_partial
    : [];

  const recommendedPartial = Array.isArray(
    analysis.recommended_partial
  )
    ? analysis.recommended_partial
    : [];

  const coreMissing = Array.isArray(analysis.core_missing)
    ? analysis.core_missing
    : [];

  const recommendedMissing = Array.isArray(
    analysis.recommended_missing
  )
    ? analysis.recommended_missing
    : [];

  const developmentSkills = [
    ...coreMissing,
    ...recommendedMissing,
  ];

  const handleRoadmap = () => {
    onContinue(analysis);
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#172033]">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#102a43] to-[#087f82]">
              <Target size={18} className="text-white" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-[#102a43]">
                Smart Resume Analyser
              </p>

              <p className="text-[10px] text-slate-400">
                Career readiness
              </p>
            </div>
          </div>

          <div className="w-[65px]" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <section className="mb-8">
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#13a6a8]/20 bg-[#13a6a8]/5 px-3.5 py-2 text-xs font-bold text-[#087f82]">
              <Sparkles size={14} />
              Career readiness
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-500">
              Target: {career.name || careerTarget || "Not selected"}
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">
            Your career readiness assessment
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            See the skills your resume already supports and the skills you can develop next.
          </p>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={TrendingUp}
            title="Readiness"
            value={`${readiness}%`}
            description="Current career readiness"
          />

          <SummaryCard
            icon={CheckCircle2}
            title="Skills supported"
            value={matchedSkills.length}
            description="Strong resume evidence"
          />

          <SummaryCard
            icon={AlertTriangle}
            title="Skills to develop"
            value={developmentSkills.length}
            description="Main development areas"
          />
        </section>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-[10px] border-[#13a6a8]/10 bg-[#f5fbfb]">
              <p className="text-3xl font-bold text-[#102a43]">
                {readiness}%
              </p>

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Readiness
              </p>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#102a43]">
                Career readiness overview
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Your score reflects the skills currently supported by your resume for this career.
              </p>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#102a43] to-[#13a6a8] transition-all"
                  style={{ width: `${readiness}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Focus on the development areas below to strengthen your profile.
              </p>
            </div>
          </div>
        </section>

        <SkillSection
          title="Skills strongly supported"
          description="Skills with clear evidence in your resume."
          found={coreFound.concat(recommendedFound)}
          partial={[]}
          missing={[]}
          emptyMessage="No strongly supported skills were found yet."
          variant="found"
        />

        <SkillSection
          title="Skills needing stronger evidence"
          description="Skills where your resume shows related evidence but not enough direct evidence."
          found={[]}
          partial={corePartial.concat(recommendedPartial)}
          missing={[]}
          emptyMessage="No skills in this category."
          variant="partial"
        />

        <SkillSection
          title="Skills to develop"
          description="The main skills to focus on in your learning roadmap."
          found={[]}
          partial={[]}
          missing={developmentSkills}
          emptyMessage="No major development gaps were found."
          variant="missing"
        />

        <section className="mb-8">
          <SectionTitle
            icon={Code2}
            title="Additional skills"
            description="Useful skills already present in your resume that can strengthen your profile."
          />

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {additionalSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {additionalSkills.map((skill, index) => (
                  <span
                    key={`${skill.name}-${index}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No additional skills were detected.
              </p>
            )}
          </div>
        </section>

        <section className="mb-8">
          <SectionTitle
            icon={Code2}
            title="Skills detected in your resume"
            description="Skills extracted from the submitted resume."
          />

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {Array.isArray(resumeData?.skills) &&
            resumeData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-[#13a6a8]/20 bg-[#f0fbfb] px-3.5 py-2 text-xs font-semibold text-[#087f82]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No skills were extracted from the resume.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#13a6a8]/20 bg-gradient-to-br from-[#eefafa] via-white to-[#f4f8fb] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#087f82] text-white">
                <BookOpen size={21} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#102a43]">
                  Your personalized roadmap is ready to build
                </p>

                <p className="mt-1 max-w-xl text-xs leading-6 text-slate-500">
                  Next, you will get learning topics, classes, practical tasks, projects and assessments based on your development areas.
                </p>
              </div>
            </div>

            <button
              onClick={handleRoadmap}
              className="group flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#102a43] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#173c5d]"
            >
              Build learning roadmap

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

function SkillSection({
  title,
  description,
  found,
  partial,
  missing,
  emptyMessage,
  variant,
}) {
  const allSkills =
    variant === "found"
      ? found
      : variant === "partial"
      ? partial
      : missing;

  return (
    <section className="mb-8">
      <SectionTitle
        icon={
          variant === "found"
            ? CheckCircle2
            : variant === "partial"
            ? AlertTriangle
            : Target
        }
        title={title}
        description={description}
      />

      <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {allSkills.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {allSkills.map((skill) => (
              <SkillCard
                key={`${skill.name}-${variant}`}
                skill={skill}
                variant={variant}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill, variant }) {
  const iconMap = {
    found: CheckCircle2,
    partial: AlertTriangle,
    missing: AlertTriangle,
  };

  const Icon = iconMap[variant] || Code2;

  const colorMap = {
    found: "text-emerald-600 bg-emerald-50 border-emerald-100",
    partial: "text-amber-600 bg-amber-50 border-amber-100",
    missing: "text-red-500 bg-red-50 border-red-100",
  };

  return (
    <div className={`rounded-2xl border p-4 ${colorMap[variant]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-[#102a43]">
              {skill.name}
            </p>

            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600">
              {Number(skill.score || 0)}%
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {skill.evidence ||
              (variant === "missing"
                ? "No matching resume evidence was found."
                : "")}
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, value, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8f8] text-[#087f82]">
          <Icon size={18} />
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>
      </div>

      <p className="mt-5 text-2xl font-bold text-[#102a43]">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#102a43] text-white">
        <Icon size={17} />
      </div>

      <div>
        <h2 className="text-base font-bold text-[#102a43]">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default SkillGapAnalysis;