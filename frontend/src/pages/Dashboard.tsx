import { useEffect, useState } from "react";
import axios from "axios";
import {
  Shield,
  AlertTriangle,
  Activity,
  Bug,
  TrendingUp,
  Zap,
  Clock,
  BarChart2,
  List,
  Radio,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface Stats {
  total_threats: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  top_attack: string;
}

interface Threat {
  id: number;
  attack_type: string;
  confidence: number;
  severity: string;
  risk_score: number;
  recommendation: string;
  created_at: string | null;
}

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#ef4444",
  High:     "#f97316",
  Medium:   "#eab308",
  Low:      "#22c55e",
};

const CHART_COLORS = ["#6366f1", "#06b6d4", "#f97316", "#ef4444", "#22c55e", "#8b5cf6", "#f59e0b", "#14b8a6", "#ec4899", "#64748b"];

const severityBadge = (s: string) => {
  switch (s) {
    case "Critical": return "bg-red-100 text-red-700 border border-red-200";
    case "High":     return "bg-orange-100 text-orange-700 border border-orange-200";
    case "Medium":   return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    default:         return "bg-green-100 text-green-700 border border-green-200";
  }
};

const severityDot = (s: string) => {
  switch (s) {
    case "Critical": return "bg-red-500";
    case "High":     return "bg-orange-500";
    case "Medium":   return "bg-yellow-400";
    default:         return "bg-green-500";
  }
};

function formatTime(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const links = [
    { id: "overview",  label: "Overview",     icon: BarChart2 },
    { id: "feed",      label: "Live Feed",     icon: Radio },
    { id: "history",   label: "Threat History",icon: List },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col min-h-screen shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">GuardianPulse</p>
            <p className="text-xs text-slate-400">Cyber AI</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</p>
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === id
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Icon size={16} />
            {label}
            {active === id && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
          </button>
        ))}
      </nav>

      {/* Status */}
      <div className="px-5 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot"></span>
          <span className="text-xs text-slate-500">System Online</span>
        </div>
      </div>
    </aside>
  );
}

// ── KPI Card ───────────────────────────────────────────────────────────────────
function KPICard({
  label, value, icon: Icon, color, bg, border,
}: {
  label: string; value: string | number;
  icon: React.ElementType; color: string; bg: string; border: string;
}) {
  return (
    <div className={`card-lift bg-white rounded-2xl p-5 border ${border} shadow-sm flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Section title ──────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
        <Icon size={16} className="text-indigo-600" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Overview Tab ───────────────────────────────────────────────────────────────
function OverviewTab({ stats, distribution, trend, history }: {
  stats: Stats; distribution: Record<string, number>; trend: any[]; history: Threat[];
}) {
  const attackData = Object.keys(distribution).map((k) => ({ name: k, value: distribution[k] }));
  const severityData = [
    { name: "Low",      value: stats.low,      fill: "#22c55e" },
    { name: "Medium",   value: stats.medium,   fill: "#eab308" },
    { name: "High",     value: stats.high,     fill: "#f97316" },
    { name: "Critical", value: stats.critical, fill: "#ef4444" },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard label="Total Threats" value={stats.total_threats} icon={Shield}        color="text-indigo-600" bg="bg-indigo-50"  border="border-indigo-100" />
        <KPICard label="Critical"      value={stats.critical}      icon={AlertTriangle} color="text-red-600"    bg="bg-red-50"     border="border-red-100" />
        <KPICard label="High"          value={stats.high}          icon={Bug}           color="text-orange-600" bg="bg-orange-50"  border="border-orange-100" />
        <KPICard label="Medium"        value={stats.medium}        icon={Activity}      color="text-yellow-600" bg="bg-yellow-50"  border="border-yellow-100" />
        <KPICard label="Low"           value={stats.low}           icon={Zap}           color="text-green-600"  bg="bg-green-50"   border="border-green-100" />
        <KPICard label="Top Attack"    value={stats.top_attack}    icon={TrendingUp}    color="text-purple-600" bg="bg-purple-50"  border="border-purple-100" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attack Distribution Pie */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <SectionTitle icon={BarChart2} title="Attack Distribution" subtitle="By attack category" />
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={attackData} dataKey="value" outerRadius={100} innerRadius={45} paddingAngle={3}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {attackData.map((_: any, i: number) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 13 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <SectionTitle icon={Activity} title="Severity Breakdown" subtitle="Threats by severity level" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={severityData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 13 }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {severityData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Threat Trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <SectionTitle icon={TrendingUp} title="Threat Trend" subtitle="Detection activity over time" />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 13 }}
              />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Threats */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <SectionTitle icon={Clock} title="Recent Threats" subtitle="Last 5 detections" />
          <div className="space-y-3">
            {history.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${severityDot(t.severity)}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{t.attack_type}</p>
                    <p className="text-xs text-slate-400">{t.confidence.toFixed(1)}% confidence</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${severityBadge(t.severity)}`}>
                    {t.severity}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{formatTime(t.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Live Feed Tab ──────────────────────────────────────────────────────────────
function FeedTab({ history }: { history: Threat[] }) {
  return (
    <div className="fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Radio size={16} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Live Threat Feed</h2>
              <p className="text-xs text-slate-400">Auto-refreshes every 5 seconds</p>
            </div>
          </div>
          <span className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
            LIVE
          </span>
        </div>

        {/* Feed Items */}
        <div className="divide-y divide-slate-100">
          {history.slice(0, 15).map((t) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                {/* Severity indicator */}
                <div
                  className="w-1 h-12 rounded-full flex-shrink-0"
                  style={{ background: SEVERITY_COLORS[t.severity] ?? "#94a3b8" }}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.attack_type}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.recommendation}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    <Clock size={10} className="inline mr-1" />
                    {formatTime(t.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${severityBadge(t.severity)}`}>
                  {t.severity}
                </span>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Confidence</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${t.confidence}%`,
                          background: SEVERITY_COLORS[t.severity] ?? "#6366f1",
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{t.confidence.toFixed(1)}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Risk: <span className="font-semibold text-slate-600">{t.risk_score}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── History Tab ────────────────────────────────────────────────────────────────
function HistoryTab({ history }: { history: Threat[] }) {
  return (
    <div className="fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <List size={16} className="text-slate-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Threat History</h2>
              <p className="text-xs text-slate-400">Last {history.length} detections</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Attack Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Confidence</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Severity</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Risk Score</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-slate-400 font-mono text-xs">#{t.id}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${severityDot(t.severity)}`} />
                      <span className="font-medium text-slate-700">{t.attack_type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${t.confidence}%`, background: SEVERITY_COLORS[t.severity] ?? "#6366f1" }}
                        />
                      </div>
                      <span className="text-slate-600 text-xs font-medium">{t.confidence.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${severityBadge(t.severity)}`}>
                      {t.severity}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600 font-medium">{t.risk_score}</td>
                  <td className="px-6 py-3 text-slate-400 text-xs">{formatTime(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total_threats: 0, critical: 0, high: 0, medium: 0, low: 0, top_attack: "None",
  });
  const [history, setHistory]           = useState<Threat[]>([]);
  const [distribution, setDistribution] = useState<Record<string, number>>({});
  const [trend, setTrend]               = useState<any[]>([]);
  const [active, setActive]             = useState("overview");
  const [lastUpdated, setLastUpdated]   = useState<Date>(new Date());

  const loadData = async () => {
    try {
      const [s, h, d, t] = await Promise.all([
        axios.get("http://127.0.0.1:8000/soc-stats"),
        axios.get("http://127.0.0.1:8000/threat-history"),
        axios.get("http://127.0.0.1:8000/attack-distribution"),
        axios.get("http://127.0.0.1:8000/threat-trend"),
      ]);
      setStats(s.data);
      setHistory(h.data);
      setDistribution(d.data);
      setTrend(t.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const i = setInterval(loadData, 5000);
    return () => clearInterval(i);
  }, []);

  const tabTitle: Record<string, string> = {
    overview: "Overview",
    feed:     "Live Feed",
    history:  "Threat History",
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar active={active} setActive={setActive} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{tabTitle[active]}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
              Live Monitoring Active
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Shield size={16} className="text-indigo-600" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          {active === "overview" && (
            <OverviewTab
              stats={stats}
              distribution={distribution}
              trend={trend}
              history={history}
            />
          )}
          {active === "feed" && <FeedTab history={history} />}
          {active === "history" && <HistoryTab history={history} />}
        </main>
      </div>
    </div>
  );
}
