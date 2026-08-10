import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Trend {
  time: number;
  count: number;
}

export default function ThreatTrend() {
  const [trend, setTrend] = useState<Trend[]>([]);

  const loadTrend = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/threat-trend"
      );

      setTrend(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTrend();

    const timer = setInterval(loadTrend, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111827] rounded-2xl p-6 shadow-lg border border-slate-800">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-xl font-bold text-white">
            Threat Trend
          </h2>

          <p className="text-slate-400 text-sm">
            Live threat activity
          </p>
        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <LineChart data={trend}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="time"
            stroke="#94A3B8"
          />

          <YAxis
            stroke="#94A3B8"
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#06B6D4"
            strokeWidth={4}
            dot={{
              r: 5,
              fill: "#06B6D4",
            }}
            activeDot={{
              r: 8,
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}