import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  UploadCloud,
  X,
} from "lucide-react";

function ResumeUpload({ onResumeSelected }) {
  const fileInputRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     FILE VALIDATION
  ===================================================== */

  const validateFile = (file) => {
    if (!file) return false;

    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setError("Please upload your resume in PDF format.");
      return false;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Resume size must be less than 10 MB.");
      return false;
    }

    return true;
  };

  /* =====================================================
     SELECT FILE
  ===================================================== */

  const handleFile = (file) => {
    setError("");

    if (!validateFile(file)) {
      return;
    }

    setResumeFile(file);

    console.log("Resume selected:", file.name);
  };

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  /* =====================================================
     DRAG EVENTS
  ===================================================== */

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  /* =====================================================
     REMOVE FILE
  ===================================================== */

  const removeFile = () => {
    setResumeFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================
     CONTINUE
  ===================================================== */

  const handleContinue = () => {
    if (!resumeFile) {
      setError("Please upload your resume first.");
      return;
    }

    /*
      IMPORTANT:
      Career has already been selected on the previous page.

      We only send the resume file forward.
    */

    if (onResumeSelected) {
      onResumeSelected(resumeFile, true);
    }
  };

  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {
    window.history.back();
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafc] via-white to-[#eef8f8] text-[#172033]">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">

          <button
            onClick={handleBack}
            className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-[#102a43]"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102a43]">
              <FileText
                size={18}
                className="text-[#55d4d0]"
              />
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-bold text-[#102a43]">
                Smart Resume Analyser
              </p>

              <p className="text-[10px] text-slate-400">
                Resume analysis
              </p>

            </div>

          </div>

          <div className="w-[55px]" />

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="text-center">

          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-[#13a6a8]/20 bg-[#13a6a8]/5 px-4 py-2 text-[11px] font-semibold text-[#087f82]">

            <UploadCloud size={14} />

            RESUME ANALYSIS

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">
            Upload your resume
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Upload your latest resume. We will extract your
            education, skills, projects, certifications and
            experience before performing the skill-gap analysis.
          </p>

        </section>

        {/* =================================================
            UPLOAD BOX
        ================================================= */}

        <section className="mt-10">

          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-3xl border-2 border-dashed bg-white p-6 transition sm:p-10 ${
              dragActive
                ? "border-[#087f82] bg-[#f3ffff] shadow-lg shadow-[#087f82]/10"
                : "border-[#13a6a8]/40"
            }`}
          >

            {!resumeFile ? (

              <div className="flex flex-col items-center justify-center py-12 text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eef8f8]">

                  <UploadCloud
                    size={34}
                    className="text-[#087f82]"
                  />

                </div>

                <h2 className="mt-6 text-lg font-bold text-[#102a43]">
                  Drop your resume here
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  or choose a PDF file from your computer
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#102a43] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#102a43]/10 transition hover:-translate-y-0.5 hover:bg-[#173c5d]"
                >

                  <UploadCloud size={17} />

                  Choose Resume

                </button>

                <p className="mt-4 text-[11px] text-slate-400">
                  PDF only • Maximum 10 MB
                </p>

              </div>

            ) : (

              <div className="flex flex-col items-center justify-center py-10 text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50">

                  <CheckCircle2
                    size={38}
                    className="text-emerald-500"
                  />

                </div>

                <h2 className="mt-6 max-w-lg break-all text-base font-bold text-[#102a43] sm:text-lg">
                  {resumeFile.name}
                </h2>

                <p className="mt-2 text-sm text-emerald-600">
                  Resume selected successfully
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#13a6a8]/40 hover:text-[#087f82]"
                  >
                    Choose another file
                  </button>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
                  >
                    <X size={14} />
                    Remove
                  </button>

                </div>

              </div>

            )}

          </div>

          {/* Hidden file input */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Error */}

          {error && (

            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
              {error}
            </div>

          )}

        </section>

        {/* =================================================
            WHAT WILL BE EXTRACTED
        ================================================= */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef8f8]">
              <FileText
                size={18}
                className="text-[#087f82]"
              />
            </div>

            <div>

              <h3 className="text-sm font-bold text-[#102a43]">
                What will be analyzed?
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                {[
                  "Education",
                  "Technical skills",
                  "Projects",
                  "Certifications",
                  "Experience",
                  "Resume evidence",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >

                    <CheckCircle2
                      size={14}
                      className="text-[#13a6a8]"
                    />

                    {item}

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            CONTINUE
        ================================================= */}

        <section className="mt-8">

          <button
            onClick={handleContinue}
            disabled={!resumeFile}
            className={`group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold transition ${
              resumeFile
                ? "bg-[#102a43] text-white shadow-lg shadow-[#102a43]/15 hover:-translate-y-0.5 hover:bg-[#173c5d]"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >

            Continue to resume analysis

            <ArrowRight
              size={18}
              className={
                resumeFile
                  ? "transition-transform group-hover:translate-x-1"
                  : ""
              }
            />

          </button>

        </section>

      </main>

    </div>
  );
}

export default ResumeUpload;