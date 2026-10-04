import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
} from "lucide-react";

function Auth({ onBack, onContinue }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary frontend authentication.
    // Later this will call the Flask authentication API.
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#172033]">

      {/* ================= HEADER ================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#102a43]">
              <ShieldCheck size={16} className="text-white" />
            </div>

            <div>

              <p className="text-[15px] font-semibold tracking-tight text-[#102a43]">
                evidence<span className="text-[#13a6a8]">.</span>
              </p>

              <p className="hidden text-[9px] uppercase tracking-[0.14em] text-slate-400 sm:block">
                Career readiness
              </p>

            </div>

          </div>

          <div className="w-8" />

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center px-6 py-10">

        <div className="mx-auto grid w-full max-w-5xl overflow-hidden border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">


          {/* ================= LEFT PANEL ================= */}

          <section className="hidden bg-[#102a43] p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#55d4d0]">
                EVIDENCE WORKSPACE
              </p>

              <h1 className="mt-5 max-w-sm text-3xl font-semibold leading-tight tracking-tight">
                Understand what your skills can actually support.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
                Build a structured career profile using your education,
                projects, certifications and resume evidence.
              </p>

            </div>


            {/* JOURNEY */}

            <div className="mt-12">

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                WORKSPACE FLOW
              </p>


              <div className="mt-5 space-y-4">

                <JourneyItem
                  number="01"
                  text="Create your profile"
                  active
                />

                <JourneyItem
                  number="02"
                  text="Choose a career target"
                />

                <JourneyItem
                  number="03"
                  text="Upload your resume"
                />

                <JourneyItem
                  number="04"
                  text="Understand your skill gaps"
                />

              </div>

            </div>


            {/* SMALL FOOTER */}

            <div className="mt-10 border-t border-white/10 pt-5">

              <p className="text-[11px] leading-5 text-slate-400">
                Your career information is organized inside your personal
                workspace.
              </p>

            </div>

          </section>


          {/* ================= RIGHT PANEL ================= */}

          <section className="flex items-center justify-center px-6 py-10 sm:px-10">

            <div className="w-full max-w-md">


              {/* HEADING */}

              <div className="mb-7">

                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#13a6a8]">
                  {isSignup ? "NEW WORKSPACE" : "WELCOME BACK"}
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#102a43]">
                  {isSignup
                    ? "Create your account"
                    : "Sign in to your workspace"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {isSignup
                    ? "Create your workspace to begin building your career profile."
                    : "Continue building your career readiness profile."}
                </p>

              </div>


              {/* ================= TABS ================= */}

              <div className="mb-7 grid grid-cols-2 border-b border-slate-200">

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`relative py-3 text-xs font-semibold transition ${
                    !isSignup
                      ? "text-[#102a43]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Log in

                  {!isSignup && (
                    <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-[#13a6a8]" />
                  )}

                </button>


                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`relative py-3 text-xs font-semibold transition ${
                    isSignup
                      ? "text-[#102a43]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Create account

                  {isSignup && (
                    <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-[#13a6a8]" />
                  )}

                </button>

              </div>


              {/* ================= FORM ================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* NAME */}

                {isSignup && (
                  <div>

                    <label className="mb-2 block text-xs font-semibold text-slate-700">
                      Full name
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      className="w-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
                    />

                  </div>
                )}


                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Email address
                  </label>

                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
                  />

                </div>


                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-xs font-semibold text-slate-700">
                      Password
                    </label>

                    {!isSignup && (
                      <button
                        type="button"
                        className="text-[11px] font-medium text-[#087f82] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}

                  </div>


                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      className="w-full border border-slate-200 bg-white px-4 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#13a6a8] focus:ring-2 focus:ring-[#13a6a8]/10"
                    />


                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#102a43]"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>


                {/* AGREEMENT */}

                {isSignup && (
                  <label className="flex gap-3 text-[11px] leading-5 text-slate-500">

                    <input
                      type="checkbox"
                      required
                      className="mt-1 accent-[#13a6a8]"
                    />

                    <span>
                      I understand that my resume and career information
                      will be used to generate my career-readiness profile.
                    </span>

                  </label>
                )}


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 bg-[#102a43] py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#173c5d]"
                >

                  {isSignup
                    ? "Create account"
                    : "Continue to workspace"}

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </button>

              </form>


              {/* TRUST TEXT */}

              <div className="mt-7 border-t border-slate-100 pt-5">

                <div className="flex items-start gap-3">

                  <Check
                    size={15}
                    className="mt-0.5 shrink-0 text-[#13a6a8]"
                  />

                  <p className="text-[11px] leading-5 text-slate-400">
                    Your workspace keeps your profile, resume and career
                    analysis organized in one place.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   JOURNEY ITEM
========================================================= */

function JourneyItem({ number, text, active }) {
  return (
    <div className="flex items-center gap-4">

      <div
        className={`flex h-7 w-7 items-center justify-center text-[9px] font-mono ${
          active
            ? "bg-[#13a6a8] text-white"
            : "border border-white/10 text-slate-400"
        }`}
      >
        {number}
      </div>

      <span
        className={`text-xs ${
          active
            ? "font-medium text-white"
            : "text-slate-400"
        }`}
      >
        {text}
      </span>

    </div>
  );
}


export default Auth;