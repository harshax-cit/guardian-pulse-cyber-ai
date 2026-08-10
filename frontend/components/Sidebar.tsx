import {
  LayoutDashboard,
  BarChart3,
  ShieldAlert,
  Map,
  BrainCircuit,
  Globe,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BarChart3, label: "Analytics" },
  { icon: ShieldAlert, label: "Threat Feed" },
  { icon: Globe, label: "Threat Intelligence" },
  { icon: BrainCircuit, label: "AI Copilot" },
  { icon: Map, label: "Attack Map" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between">

      {/* Logo */}

      <div>

        <div className="p-6 border-b border-slate-800">

          <h1 className="text-2xl font-bold text-cyan-400">
            GuardianPulse
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Cyber AI SOC
          </p>

        </div>

        <nav className="mt-6 px-4">

          {menuItems.map((item, index) => {

            const Icon = item.icon;

            return (
              <button
                key={index}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-3 transition-all duration-300
                ${
                  index === 0
                    ? "bg-cyan-500 text-black font-semibold"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <Icon size={20} />

                <span>{item.label}</span>

              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}

      <div className="p-5 border-t border-slate-800">

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}