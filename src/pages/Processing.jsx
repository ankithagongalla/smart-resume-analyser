import { useEffect, useState } from "react";

import {
  Check,
  FileText,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

function Processing({
  resumeFile,
  onComplete,
  onBack,
}) {

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  const steps = [
    {
      title: "Resume uploaded",
      description: "Your resume has been received.",
    },
    {
      title: "Extracting resume information",
      description:
        "Reading your personal information, education and skills.",
    },
    {
      title: "Identifying projects and certifications",
      description:
        "Finding projects, certifications and experience.",
    },
    {
      title: "Preparing skill-gap analysis",
      description:
        "Preparing your profile for career analysis.",
    },
  ];

  useEffect(() => {

    let cancelled = false;

    const analyzeResume = async () => {

      try {

        setError("");

        console.log("=================================");
        console.log("STARTING RESUME ANALYSIS");
        console.log("=================================");

        console.log("resumeFile:", resumeFile);

        // =====================================================
        // CHECK FILE
        // =====================================================

        if (!resumeFile) {
          throw new Error(
            "No resume file was received."
          );
        }

        console.log("Name:", resumeFile.name);
        console.log("Type:", resumeFile.type);
        console.log("Size:", resumeFile.size);
        console.log(
          "Is real File:",
          resumeFile instanceof File
        );

        if (!(resumeFile instanceof File)) {

          throw new Error(
            "The uploaded resume is not being passed as a real File object."
          );

        }

        setCurrentStep(1);

        // =====================================================
        // FORM DATA
        // =====================================================

        const formData = new FormData();

        formData.append(
          "resume",
          resumeFile,
          resumeFile.name
        );

        console.log("=================================");
        console.log("FORM DATA");
        console.log("=================================");

        console.log(
          "FormData has resume:",
          formData.has("resume")
        );

        // IMPORTANT:
        // Do NOT manually set Content-Type.
        // Browser automatically creates multipart/form-data boundary.

        setCurrentStep(2);

        // =====================================================
        // SEND TO FLASK
        // =====================================================

        console.log("Sending PDF to Flask...");

        const response = await fetch(
          "http://127.0.0.1:5000/api/analyze",
          {
            method: "POST",
            body: formData,
          }
        );

        console.log(
          "Flask response status:",
          response.status
        );

        const responseText = await response.text();

        console.log("Raw Flask response:");
        console.log(responseText);

        let result;

        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error(
            "Flask returned an invalid response."
          );
        }

        console.log("=================================");
        console.log("FLASK RESULT");
        console.log("=================================");

        console.log(result);

        if (!response.ok) {

          throw new Error(
            result.error ||
            `Backend returned status ${response.status}`
          );

        }

        if (!result.success) {

          throw new Error(
            result.error ||
            "Resume extraction failed."
          );

        }

        if (cancelled) {
          return;
        }

        // =====================================================
        // SUCCESS
        // =====================================================

        console.log("=================================");
        console.log("RESUME EXTRACTION SUCCESS");
        console.log("=================================");

        console.log(
          "Extracted resume data:",
          result.data
        );

        setCurrentStep(3);

        setTimeout(() => {

          if (!cancelled) {

            onComplete(result.data);

          }

        }, 700);

      } catch (err) {

        if (cancelled) {
          return;
        }

        console.error(
          "================================="
        );

        console.error(
          "RESUME ANALYSIS ERROR"
        );

        console.error(
          "================================="
        );

        console.error(err);

        setError(
          err.message ||
          "Something went wrong while processing your resume."
        );

      }

    };

    analyzeResume();

    return () => {
      cancelled = true;
    };

  }, [resumeFile, onComplete]);


  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#142033]">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#102a43]">

              <ShieldCheck
                size={20}
                className="text-white"
              />

            </div>

            <div>

              <div className="text-lg font-bold text-[#102a43]">

                evidence
                <span className="text-[#13a6a8]">
                  .
                </span>

              </div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Career readiness
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-5xl items-center px-6 py-16">

        <div className="w-full">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#13a6a8]/10 text-[#087f82]">

              {error ? (

                <FileText size={28} />

              ) : (

                <Sparkles
                  size={28}
                  className="animate-pulse"
                />

              )}

            </div>


            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#13a6a8]">

              Resume analysis

            </p>


            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">

              {error
                ? "Resume analysis failed"
                : "Understanding your career evidence"}

            </h1>


            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">

              {error
                ? error
                : "We are extracting your resume information and preparing it for skill-gap analysis."}

            </p>

          </div>


          {/* FILE */}

          {resumeFile && (

            <div className="mx-auto mt-10 flex max-w-xl items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#102a43] text-white">

                <FileText size={20} />

              </div>


              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-[#102a43]">

                  {resumeFile.name}

                </p>

                <p className="mt-1 text-xs text-slate-400">

                  {resumeFile.type || "PDF"} •{" "}
                  {resumeFile.size
                    ? `${(resumeFile.size / 1024).toFixed(1)} KB`
                    : ""}

                </p>

              </div>


              {!error && (

                <div className="ml-auto">

                  <Check
                    size={20}
                    className="text-[#13a6a8]"
                  />

                </div>

              )}

            </div>

          )}


          {/* STEPS */}

          {!error && (

            <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="space-y-2">

                {steps.map((step, index) => {

                  const completed =
                    index < currentStep;

                  const active =
                    index === currentStep;

                  return (

                    <div
                      key={step.title}
                      className={`relative flex gap-4 rounded-2xl p-4 ${
                        active
                          ? "bg-[#13a6a8]/5"
                          : ""
                      }`}
                    >

                      <div
                        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          completed
                            ? "bg-[#13a6a8] text-white"
                            : active
                            ? "bg-[#102a43] text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >

                        {completed ? (

                          <Check size={16} />

                        ) : active ? (

                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />

                        ) : (

                          <span className="text-xs font-bold">
                            {index + 1}
                          </span>

                        )}

                      </div>


                      <div>

                        <h3
                          className={`text-sm font-bold ${
                            active || completed
                              ? "text-[#102a43]"
                              : "text-slate-400"
                          }`}
                        >

                          {step.title}

                        </h3>


                        <p className="mt-1 text-xs text-slate-400">

                          {step.description}

                        </p>

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-5">

              <p className="text-sm font-semibold text-red-700">

                Resume analysis could not be completed.

              </p>


              <p className="mt-2 text-xs leading-5 text-red-600">

                {error}

              </p>


              <div className="mt-4 flex gap-3">

                <button
                  onClick={onBack}
                  className="flex items-center gap-2 rounded-xl bg-[#102a43] px-5 py-2.5 text-xs font-semibold text-white"
                >

                  <ArrowLeft size={14} />

                  Go back and upload again

                </button>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Processing;