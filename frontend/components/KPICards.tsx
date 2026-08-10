import { useEffect, useState } from "react";
import axios from "axios";
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  Activity,
  Server,
  Bug,
} from "lucide-react";

interface Stats {
  total_threats: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  top_attack: string;
}

export default function KPICards() {
  const [stats, setStats] = useState<Stats>({
    total_threats: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    top_attack: "None",
  });

  const loadStats = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/soc-stats"
      );

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStats();

    const timer = setInterval(loadStats, 5000);

    return () => clearInterval(timer);
  }, []);

  const cards = [
    {
      title: "Total Threats",
      value: stats.total_threats,
      icon: Shield,
      color: "border-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Critical",
      value: stats.critical,
      icon: ShieldAlert,
      color: "border-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "High",
      value: stats.high,
      icon: Bug,
      color: "border-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Medium",
      value: stats.medium,
      icon: AlertTriangle,
      color: "border-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Low",
      value: stats.low,
      icon: Activity,
      color: "border-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Top Attack",
      value: stats.top_attack,
      icon: Server,
      color: "border-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5">

      {cards.map((card, index) => {

        const Icon = card.icon;

        return (
          <div
            key={index}
            className={`rounded-2xl p-6 border ${card.color} ${card.bg}
            hover:scale-105 transition duration-300
            shadow-lg`}
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-400">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-3">

                  {card.value}

                </h2>

              </div>

              <div className="bg-slate-900 rounded-full p-4">

                <Icon
                  size={30}
                  className="text-cyan-400"
                />

              </div>

            </div>

          </div>
        );

      })}

    </div>
  );
}