import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Threat {
  attack_type: string;
  confidence: number;
  severity: string;
  created_at: string;
}

export default function RecentThreats() {
  const [threats, setThreats] = useState<Threat[]>([]);

  const loadThreats = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/recent-threats"
      );

      setThreats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadThreats();

    const timer = setInterval(loadThreats, 5000);

    return () => clearInterval(timer);
  }, []);

  const icon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <XCircle className="text-red-500" size={18} />;

      case "High":
        return (
          <ShieldAlert
            className="text-orange-500"
            size={18}
          />
        );

      case "Medium":
        return (
          <AlertTriangle
            className="text-yellow-400"
            size={18}
          />
        );

      default:
        return (
          <CheckCircle
            className="text-green-500"
            size={18}
          />
        );
    }
  };

  const badge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600";

      case "High":
        return "bg-orange-500";

      case "Medium":
        return "bg-yellow-400 text-black";

      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-lg h-[420px]">

      <div className="flex justify-between items-center mb-5">

        <div>

          <h2 className="text-xl font-bold">
            Recent Threats
          </h2>

          <p className="text-slate-400 text-sm">
            Latest 5 detected attacks
          </p>

        </div>

        <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm">

          {threats.length} Alerts

        </div>

      </div>

      <div className="space-y-4">

        {threats.map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center bg-slate-900 p-4 rounded-xl hover:bg-slate-800 transition"
          >

            <div className="flex items-center gap-4">

              <div>

                {icon(item.severity)}

              </div>

              <div>

                <h3 className="font-semibold">

                  {item.attack_type}

                </h3>

                <p className="text-xs text-slate-400">

                  {item.confidence.toFixed(2)}%
                  Confidence

                </p>

              </div>

            </div>

            <div className="text-right">

              <span
                className={`px-3 py-1 rounded-full text-xs ${badge(
                  item.severity
                )}`}
              >

                {item.severity}

              </span>

              <p className="text-xs text-slate-500 mt-2">

                {item.created_at
                  ? new Date(
                      item.created_at
                    ).toLocaleTimeString()
                  : "--"}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}