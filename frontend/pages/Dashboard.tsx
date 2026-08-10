import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import KPICards from "../components/KPICards";
import AttackPieChart from "../components/AttackPieChart";
import ThreatTrend from "../components/ThreatTrend";
import LiveThreatFeed from "../components/LiveThreatFeed";
import RecentThreats from "../components/RecentThreats";
import ThreatHistory from "../components/ThreatHistory";
import SystemHealth from "../components/SystemHealth";
import NotificationPanel from "../components/NotificationPanel";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0B1220] text-white">

      {/* Sidebar */}

      <Sidebar />

      {/* Main */}

      <div className="flex-1 flex flex-col overflow-hidden">

        <Header />

        <main className="flex-1 overflow-y-auto p-6">

          {/* KPI */}

          <KPICards />

          {/* Charts */}

          <div className="grid grid-cols-2 gap-6 mt-6">

            <AttackPieChart />

            <ThreatTrend />

          </div>

          {/* Feed */}

          <div className="grid grid-cols-2 gap-6 mt-6">

            <LiveThreatFeed />

            <RecentThreats />

          </div>

          {/* Health */}

          <div className="mt-6">

            <SystemHealth />

          </div>

          {/* Notifications */}

          <div className="mt-6">

            <NotificationPanel />

          </div>

          {/* History */}

          <div className="mt-6">

            <ThreatHistory />

          </div>

        </main>

      </div>

    </div>
  );
}