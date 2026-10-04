import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Target,
  Check,
  BriefcaseBusiness,
  Code2,
  Database,
  Brain,
  Shield,
  Cloud,
  Smartphone,
  Palette,
  BarChart3,
  Network,
  Settings,
  Cpu,
  Building2,
  Sparkles,
  X,
} from "lucide-react";

/* =========================================================
   CATEGORY ICONS
========================================================= */

const CATEGORY_ICONS = {
  All: Target,
  "Computer Science & IT": Code2,
  "AI, Machine Learning & Robotics": Brain,
  "Computer Hardware Engineering": Cpu,
  "Electronics & ECE": Cpu,
  "Electrical Engineering": Settings,
  "Civil Engineering": Building2,
  "Mechanical Engineering": Settings,
  "Automotive Engineering": Settings,
  "Aerospace Engineering": Cloud,
  "Chemical Engineering": Database,
  "Biomedical & Bioengineering": Brain,
  "Environmental Engineering": Sparkles,
  "Industrial Engineering": Settings,
  "Architecture & Construction Design": Building2,
  "Science & Research": Brain,
  "Healthcare & Life Sciences": BriefcaseBusiness,
  "Business & Administration": BriefcaseBusiness,
  "Design & Creative Media": Palette,
  "Legal": BriefcaseBusiness,
  "Education": BriefcaseBusiness,
  "Social & Community Services": BriefcaseBusiness,
  "Marine Engineering": Settings,
  "Mining & Geological Engineering": Settings,
  "Materials Engineering": Settings,
  "Petroleum Engineering": Settings,
  "Other Engineering": Settings,
};

/* =========================================================
   EXTRA STUDENT-FRIENDLY CAREER TARGETS
   These are added because some modern roles may not exist
   as exact O*NET titles in the downloaded catalog.
========================================================= */

const EXTRA_CAREERS = [
  {
    career_name: "AI Engineer",
    onet_soc_code: "15-1221.00",
    domain: "AI, Machine Learning & Robotics",
  },
  {
    career_name: "Embedded Systems Engineer",
    onet_soc_code: "17-2061.00",
    domain: "Electronics & ECE",
  },
  {
    career_name: "Aerospace Engineer",
    onet_soc_code: "17-2011.00",
    domain: "Aerospace Engineering",
  },
  {
    career_name: "Full Stack Developer",
    onet_soc_code: "15-1252.00 | 15-1254.00",
    domain: "Computer Science & IT",
  },
  {
    career_name: "Frontend Developer",
    onet_soc_code: "15-1254.00",
    domain: "Computer Science & IT",
  },
  {
    career_name: "Backend Developer",
    onet_soc_code: "15-1252.00",
    domain: "Computer Science & IT",
  },
  {
    career_name: "DevOps Engineer",
    onet_soc_code: "15-1244.00",
    domain: "Computer Science & IT",
  },
  {
    career_name: "Cybersecurity Engineer",
    onet_soc_code: "15-1212.00",
    domain: "Computer Science & IT",
  },
  {
    career_name: "Data Engineer",
    onet_soc_code: "15-2051.00",
    domain: "Computer Science & IT",
  },
  {
    career_name: "Machine Learning Engineer",
    onet_soc_code: "15-1221.00 | 15-2051.00",
    domain: "AI, Machine Learning & Robotics",
  },
];

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      cell += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }

      row.push(cell);
      cell = "";

      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    cell += char;
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell);

    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) =>
    header.trim().replace(/^\uFEFF/, "")
  );

  return rows.slice(1).map((values) => {
    const item = {};

    headers.forEach((header, index) => {
      item[header] = (values[index] || "").trim();
    });

    return item;
  });
}

/* =========================================================
   NORMALIZE CAREER
========================================================= */

function normalizeCareer(item) {
  return {
    id:
      item.onet_soc_code ||
      item.code ||
      item.career_name,

    code:
      item.onet_soc_code ||
      item.code ||
      "",

    name:
      item.career_name ||
      item.title ||
      item.name ||
      "",

    domain:
      item.domain ||
      item.category ||
      "Other Careers",

    description:
      item.onet_occupation ||
      "",
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function CareerTarget({ onBack, onContinue }) {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedCareer, setSelectedCareer] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  /* =======================================================
     LOAD CSV
  ======================================================= */

  useEffect(() => {
    const loadCareers = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          "/student_career_catalog.csv"
        );

        if (!response.ok) {
          throw new Error(
            `Career catalog could not be loaded. HTTP ${response.status}`
          );
        }

        const csvText = await response.text();

        const parsed = parseCSV(csvText);

        const normalized = parsed
          .map(normalizeCareer)
          .filter((career) => career.name);

        /* -----------------------------------------------
           Add modern student-friendly roles
        ------------------------------------------------ */

        const extraNormalized =
          EXTRA_CAREERS.map(normalizeCareer);

        const combined = [
          ...normalized,
          ...extraNormalized,
        ];

        /* -----------------------------------------------
           Remove duplicates
        ------------------------------------------------ */

        const uniqueMap = new Map();

        combined.forEach((career) => {
          const key = career.name
            .trim()
            .toLowerCase();

          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, career);
          }
        });

        const uniqueCareers = Array.from(
          uniqueMap.values()
        ).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCareers(uniqueCareers);

        console.log(
          "Career catalog loaded:",
          uniqueCareers.length
        );
      } catch (error) {
        console.error(
          "Career catalog loading error:",
          error
        );

        setLoadError(
          "Unable to load the career catalog."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCareers();
  }, []);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        careers
          .map((career) => career.domain)
          .filter(Boolean)
      ),
    ];

    return [
      "All",
      ...uniqueCategories.sort((a, b) =>
        a.localeCompare(b)
      ),
    ];
  }, [careers]);

  /* =======================================================
     FILTER CAREERS
  ======================================================= */

  const filteredCareers = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return careers.filter((career) => {
      const matchesCategory =
        category === "All" ||
        career.domain === category;

      const matchesSearch =
        !searchText ||
        career.name
          .toLowerCase()
          .includes(searchText) ||
        career.domain
          .toLowerCase()
          .includes(searchText) ||
        career.code
          .toLowerCase()
          .includes(searchText);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [careers, search, category]);

  /* =======================================================
     POPULAR CAREERS
  ======================================================= */

  const popularNames = [
    "Full Stack Developer",
    "Software Engineer",
    "AI Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Cybersecurity Analyst",
    "Cloud Engineer",
    "DevOps Engineer",
    "Civil Engineer",
    "Mechanical Engineer",
    "Electrical Engineer",
    "UI/UX Designer",
  ];

  const popularCareers = useMemo(() => {
    const lookup = new Map(
      careers.map((career) => [
        career.name.toLowerCase(),
        career,
      ])
    );

    return popularNames
      .map((name) =>
        lookup.get(name.toLowerCase())
      )
      .filter(Boolean);
  }, [careers]);

  /* =======================================================
     SELECT CAREER
  ======================================================= */

  const handleSelect = (career) => {
    setSelectedCareer(career);
  };

  /* =======================================================
     CONTINUE
  ======================================================= */

  const handleContinue = () => {
    if (!selectedCareer) {
      return;
    }

    onContinue({
      id: selectedCareer.id,
      code: selectedCareer.code,
      name: selectedCareer.name,
      title: selectedCareer.name,
      label: selectedCareer.name,
      domain: selectedCareer.domain,
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7fafc] via-white to-[#eef8f8]">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-[#102a43]">
            <Target
              size={24}
              className="text-[#55d4d0]"
            />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#102a43]">
            Loading career options...
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Preparing the career catalog.
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fafc] px-5">

        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-lg">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <X
              size={24}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#102a43]">
            Career catalog unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {loadError}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafc] via-white to-[#eef8f8] text-[#172033]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">

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

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#102a43] to-[#087f82] shadow-md shadow-[#087f82]/15">
              <Target
                size={18}
                className="text-white"
              />
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-bold text-[#102a43]">
                Smart Resume Analyser
              </p>

              <p className="text-[10px] text-slate-400">
                Career target
              </p>

            </div>

          </div>

          <div className="w-[65px]" />

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">

        {/* ===================================================
            INTRO
        =================================================== */}

        <section className="mx-auto max-w-3xl text-center">

          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-[#13a6a8]/20 bg-[#13a6a8]/5 px-4 py-2 text-[11px] font-semibold text-[#087f82]">

            <Sparkles size={13} />

            PERSONALIZED CAREER ANALYSIS

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">
            What career are you preparing for?
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Choose the role you want to target. Your resume,
            skills, projects and learning roadmap will be
            analyzed against the requirements of your selected
            career.
          </p>

        </section>

        {/* ===================================================
            SELECTED CAREER
        =================================================== */}

        <section className="mx-auto mt-8 max-w-4xl">

          <div className="rounded-3xl border border-[#13a6a8]/20 bg-white p-4 shadow-[0_15px_50px_rgba(16,42,67,0.06)]">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#102a43]">
                <Target
                  size={19}
                  className="text-[#55d4d0]"
                />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Selected career target
                </p>

                <p className="mt-1 truncate text-sm font-bold text-[#102a43]">
                  {selectedCareer?.name ||
                    "No career selected yet"}
                </p>

                {selectedCareer?.domain && (
                  <p className="mt-1 truncate text-[11px] text-slate-400">
                    {selectedCareer.domain}
                  </p>
                )}

              </div>

              {selectedCareer && (
                <button
                  onClick={() =>
                    setSelectedCareer(null)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}

            </div>

          </div>

        </section>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <section className="mx-auto mt-7 max-w-4xl">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search any career role..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-[#102a43] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#13a6a8] focus:ring-4 focus:ring-[#13a6a8]/10"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={17} />
              </button>
            )}

          </div>

        </section>

        {/* ===================================================
            POPULAR CAREERS
        =================================================== */}

        {!search &&
          category === "All" &&
          popularCareers.length > 0 && (

            <section className="mx-auto mt-7 max-w-4xl">

              <div className="mb-3 flex items-center justify-between">

                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Popular career targets
                </p>

                <span className="text-[11px] text-slate-400">
                  Quick select
                </span>

              </div>

              <div className="flex flex-wrap gap-2">

                {popularCareers.map((career) => {

                  const selected =
                    selectedCareer?.name ===
                    career.name;

                  return (
                    <button
                      key={career.name}
                      onClick={() =>
                        handleSelect(career)
                      }
                      className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                        selected
                          ? "border-[#087f82] bg-[#087f82] text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#13a6a8]/40 hover:bg-[#13a6a8]/5 hover:text-[#087f82]"
                      }`}
                    >
                      {career.name}
                    </button>
                  );
                })}

              </div>

            </section>
          )}

        {/* ===================================================
            CATEGORY FILTER
        =================================================== */}

        <section className="mx-auto mt-8 max-w-7xl">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Browse careers
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {filteredCareers.length.toLocaleString()} career
                roles available
              </p>

            </div>

          </div>

          <div className="mb-7 flex gap-2 overflow-x-auto pb-2">

            {categories.map((item) => {

              const Icon =
                CATEGORY_ICONS[item] ||
                BriefcaseBusiness;

              const active =
                category === item;

              return (
                <button
                  key={item}
                  onClick={() =>
                    setCategory(item)
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                    active
                      ? "bg-[#102a43] text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-[#13a6a8]/30 hover:text-[#087f82]"
                  }`}
                >

                  <Icon size={14} />

                  {item}

                </button>
              );
            })}

          </div>

          {/* =================================================
              CAREER GRID
          ================================================= */}

          {filteredCareers.length > 0 ? (

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredCareers
                .slice(0, 300)
                .map((career) => {

                  const Icon =
                    CATEGORY_ICONS[
                      career.domain
                    ] ||
                    BriefcaseBusiness;

                  const selected =
                    selectedCareer?.name ===
                    career.name;

                  return (
                    <button
                      key={`${career.name}-${career.code}`}
                      onClick={() =>
                        handleSelect(career)
                      }
                      className={`group relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                        selected
                          ? "border-[#087f82] bg-[#f0fbfb] shadow-lg shadow-[#087f82]/10"
                          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#13a6a8]/40 hover:shadow-lg hover:shadow-slate-200/70"
                      }`}
                    >

                      {selected && (
                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#087f82]">
                          <Check
                            size={13}
                            className="text-white"
                          />
                        </div>
                      )}

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                          selected
                            ? "bg-[#087f82] text-white"
                            : "bg-[#eef8f8] text-[#087f82] group-hover:bg-[#13a6a8]/15"
                        }`}
                      >
                        <Icon size={19} />
                      </div>

                      <h3 className="mt-5 pr-5 text-sm font-bold leading-5 text-[#102a43]">
                        {career.name}
                      </h3>

                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        {career.domain}
                      </p>

                      <div
                        className={`mt-4 text-[11px] font-bold ${
                          selected
                            ? "text-[#087f82]"
                            : "text-slate-400 group-hover:text-[#087f82]"
                        }`}
                      >
                        {selected
                          ? "Selected"
                          : "Select role"}
                      </div>

                    </button>
                  );
                })}

            </div>

          ) : (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Search
                  size={22}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-5 text-base font-bold text-[#102a43]">
                No matching career found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Try another keyword or browse a different
                career category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-5 rounded-xl bg-[#102a43] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#173c5d]"
              >
                Show all careers
              </button>

            </div>

          )}

        </section>

        {/* ===================================================
            CONTINUE
        =================================================== */}

        <section className="sticky bottom-4 z-30 mx-auto mt-10 max-w-4xl">

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_15px_50px_rgba(16,42,67,0.12)] backdrop-blur-xl">

            <div className="hidden min-w-0 px-3 sm:block">

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Career target
              </p>

              <p className="mt-1 truncate text-sm font-bold text-[#102a43]">
                {selectedCareer?.name ||
                  "Select a career role to continue"}
              </p>

            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedCareer}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition sm:w-auto ${
                selectedCareer
                  ? "bg-[#102a43] text-white shadow-lg shadow-[#102a43]/15 hover:-translate-y-0.5 hover:bg-[#173c5d]"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
              }`}
            >

              Continue to resume

              <ArrowRight
                size={17}
                className={
                  selectedCareer
                    ? "transition-transform group-hover:translate-x-1"
                    : ""
                }
              />

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CareerTarget;