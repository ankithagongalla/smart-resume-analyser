import {
  LayoutDashboard,
  UserRound,
  Target,
  FileText,
  Brain,
  Gauge,
  Map,
  TrendingUp,
  LogOut,
} from "lucide-react";

function Sidebar({ currentPage, setPage }) {
  const menuItems = [
    {
      id: "home",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "profile",
      label: "Student Profile",
      icon: UserRound,
    },
    {
      id: "career",
      label: "Career Target",
      icon: Target,
    },
    {
      id: "resume",
      label: "Resume Analysis",
      icon: FileText,
    },
    {
      id: "skillgap",
      label: "Skill Gap",
      icon: Brain,
    },
    {
      id: "readiness",
      label: "Career Readiness",
      icon: Gauge,
    },
    {
      id: "roadmap",
      label: "Career Roadmap",
      icon: Map,
    },
    {
      id: "progress",
      label: "Progress",
      icon: TrendingUp,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[255px] flex-col border-r border-slate-200/70 bg-white/95 backdrop-blur-xl">

      {/* ================= LOGO ================= */}

      <div className="px-6 pb-5 pt-7">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#087f82] shadow-lg shadow-[#087f82]/20">

            <FileText
              size={20}
              strokeWidth={2.2}
              className="text-white"
            />

          </div>

          <div>

            <h1 className="text-[15px] font-bold tracking-tight text-[#102a43]">
              Smart Resume
            </h1>

            <p className="mt-0.5 text-[11px] font-semibold text-[#13a6a8]">
              Analyser
            </p>

          </div>

        </div>

      </div>


      {/* ================= NAVIGATION ================= */}

      <div className="flex-1 overflow-y-auto px-4 py-5">

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1.5">

          {menuItems.map((item) => {

            const Icon = item.icon;
            const active = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-[#102a43] to-[#173c5d] text-white shadow-md shadow-[#102a43]/15"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
                }`}
              >

                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    active
                      ? "bg-white/10"
                      : "bg-slate-100 group-hover:bg-[#13a6a8]/10"
                  }`}
                >

                  <Icon
                    size={16}
                    className={
                      active
                        ? "text-[#55d4d0]"
                        : "text-slate-400 group-hover:text-[#087f82]"
                    }
                  />

                </div>

                <span>
                  {item.label}
                </span>

                {active && (
                  <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#55d4d0] shadow-sm shadow-[#55d4d0]" />
                )}

              </button>
            );
          })}

        </nav>

      </div>


      {/* ================= USER AREA ================= */}

      <div className="border-t border-slate-200/70 p-4">

        <div className="mb-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 p-3">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#102a43] to-[#13a6a8] text-xs font-bold text-white shadow-sm">
              A
            </div>

            <div className="min-w-0">

              <p className="truncate text-[13px] font-semibold text-[#102a43]">
                Student
              </p>

              <p className="truncate text-[10px] text-slate-400">
                Career workspace
              </p>

            </div>

          </div>

        </div>


        <button
          onClick={() => setPage("auth")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-500"
        >

          <LogOut size={16} />

          Sign out

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;