import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Threat {
  id: number;
  attack_type: string;
  confidence: number;
  severity: string;
  risk_score: number;
  created_at?: string;
}

export default function LiveThreatFeed() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [error, setError] = useState(false);

  const loadThreats = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/threat-history"
      );
      setError(false);
      setThreats(res.data.slice(0, 8));
    } catch (err) {
      console.error("LiveThreatFeed error:", err);
      setError(true);
    }
  };

  useEffect(() => {
    loadThreats();

    const timer = setInterval(loadThreats, 3000);

    return () => clearInterval(timer);
  }, []);

  const badge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500 text-white";
      case "High":
        return "bg-orange-500 text-white";
      case "Medium":
        return "bg-yellow-400 text-black";
      default:
        return "bg-green-500 text-white";
    }
  };

  const icon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <XCircle size={18} className="text-red-500" />;
      case "High":
        return <ShieldAlert size={18} className="text-orange-500" />;
      case "Medium":
        return <AlertTriangle size={18} className="text-yellow-400" />;
      default:
        return <CheckCircle size={18} className="text-green-500" />;
    }
  };

  return (
    <div className="bg-[#111827] rounded-2xl border border-slate-800 p-6 shadow-lg h-[420px] overflow-hidden">

      <div className="flex justify-between items-center mb-5">

        <div>

          <h2 className="text-xl font-bold">
            Live Threat Feed
          </h2>

          <p className="text-slate-400 text-sm">
            Auto Refresh • Every 3 Seconds
          </p>

        </div>

        <span className="flex items-center gap-2 text-green-400 text-sm">

          <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>

          LIVE

        </span>

      </div>

      <div className="space-y-4 overflow-y-auto h-[320px]">

        {error && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <XCircle size={32} className="text-red-500" />
            <p className="text-sm">Cannot reach backend at port 8000.</p>
            <p className="text-xs">Make sure the FastAPI server is running.</p>
          </div>
        )}

        {!error && threats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <ShieldAlert size={32} />
            <p className="text-sm">No threats detected yet.</p>
            <p className="text-xs">
              POST to <span className="text-cyan-400">/simulate-threat</span> to seed data,
              or start the packet monitor.
            </p>
          </div>
        )}

        {!error && threats.map((item) => (

          <div
            key={item.id}
            className="bg-slate-900 rounded-xl p-4 hover:bg-slate-800 transition-all border border-slate-700"
          >

            <div className="flex justify-between">

              <div className="flex gap-3">

                {icon(item.severity)}

                <div>

                  <h3 className="font-semibold">

                    {item.attack_type}

                  </h3>

                  <p className="text-xs text-slate-400">

                    Confidence : {item.confidence.toFixed(2)}%

                  </p>

                </div>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(
                  item.severity
                )}`}
              >

                {item.severity}

              </span>

            </div>

            <div className="flex justify-between mt-4 text-sm">

              <span className="text-cyan-400">

                Risk Score : {item.risk_score}

              </span>

              <span className="text-slate-500">

                {item.created_at
                  ? new Date(
                      item.created_at
                    ).toLocaleTimeString()
                  : "--"}

              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}