import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AttackData {
  name: string;
  value: number;
}

const COLORS = [
  "#06B6D4",
  "#EF4444",
  "#F59E0B",
  "#22C55E",
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
];

export default function AttackPieChart() {
  const [data, setData] = useState<AttackData[]>([]);

  const loadData = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/attack-distribution"
      );

      const chartData = Object.entries(res.data).map(
        ([key, value]) => ({
          name: key,
          value: Number(value),
        })
      );

      setData(chartData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();

    const timer = setInterval(loadData, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111827] rounded-2xl p-6 shadow-lg border border-slate-800">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-xl font-bold text-white">
            Attack Distribution
          </h2>

          <p className="text-slate-400 text-sm">
            Live attack classification
          </p>

        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            innerRadius={70}
            paddingAngle={4}
            label
          >

            {data.map((_, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />

            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}