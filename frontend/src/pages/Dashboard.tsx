import { useEffect, useState } from "react";
import axios from "axios";
import {
  Shield,
  AlertTriangle,
  Activity,
  Bug,
  Server,
  TrendingUp,
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
} from "recharts";

interface Stats {
  total_threats:number;
  critical:number;
  high:number;
  medium:number;
  low:number;
  top_attack:string;
}

export default function Dashboard() {
  const [stats,setStats] = useState<Stats>({
    total_threats:0,critical:0,high:0,medium:0,low:0,top_attack:"None"
  });
  const [history,setHistory] = useState<any[]>([]);
  const [distribution,setDistribution] = useState<any>({});
  const [trend,setTrend] = useState<any[]>([]);

  const loadData = async () => {
    try{
      const [s,h,d,t] = await Promise.all([
        axios.get("http://127.0.0.1:8000/soc-stats"),
        axios.get("http://127.0.0.1:8000/threat-history"),
        axios.get("http://127.0.0.1:8000/attack-distribution"),
        axios.get("http://127.0.0.1:8000/threat-trend"),
      ]);

      setStats({...s.data});
      setHistory([...h.data]);
      setDistribution(d.data);
      setTrend(t.data);
    }catch(err){console.error(err);}
  };

  useEffect(()=>{
    loadData();
    const i=setInterval(loadData,5000);
    return ()=>clearInterval(i);
  },[]);

  const attackData = Object.keys(distribution).map((k)=>({
    name:k,value:distribution[k]
  }));

  const severityData = [
    {name:"Low",value:stats.low},
    {name:"Medium",value:stats.medium},
    {name:"High",value:stats.high},
    {name:"Critical",value:stats.critical},
  ];

  const colors=["#06b6d4","#8b5cf6","#f59e0b","#ef4444","#22c55e"];

  const badge=(s:string)=>{
    if(s==="Critical") return "bg-red-600";
    if(s==="High") return "bg-orange-500";
    if(s==="Medium") return "bg-yellow-500 text-black";
    return "bg-green-600";
  };

  const card="bg-slate-900 rounded-2xl p-5 hover:bg-slate-800 transition-all duration-300 hover:scale-105 shadow-lg";

  return (
  <div className="min-h-screen bg-slate-950 text-white">
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-cyan-400">GuardianPulse Cyber AI</h1>
        <p className="text-slate-400 mt-2">Real-Time Threat Detection & SOC Monitoring Dashboard</p>
        <p className="text-green-400 mt-2">● Live Monitoring Active • Refreshes Every 5 Seconds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className={card}><Shield className="text-cyan-400"/><p>Total Threats</p><h2 className="text-3xl font-bold">{stats.total_threats}</h2></div>
        <div className={card}><AlertTriangle className="text-red-500"/><p>Critical</p><h2 className="text-3xl font-bold">{stats.critical}</h2></div>
        <div className={card}><Bug className="text-orange-400"/><p>High</p><h2 className="text-3xl font-bold">{stats.high}</h2></div>
        <div className={card}><Activity className="text-yellow-400"/><p>Medium</p><h2 className="text-3xl font-bold">{stats.medium}</h2></div>
        <div className={card}><Server className="text-green-400"/><p>Low</p><h2 className="text-3xl font-bold">{stats.low}</h2></div>
        <div className={card}><TrendingUp className="text-purple-400"/><p>Top Attack</p><h2 className="text-xl font-bold">{stats.top_attack}</h2></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Attack Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={attackData} dataKey="value" outerRadius={100} label>
                {attackData.map((_:any,i:number)=><Cell key={i} fill={colors[i%colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Severity Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="value"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Threat Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="time"/>
              <YAxis/>
              <Tooltip/>
              <Line type="monotone" dataKey="count"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Top 5 Recent Threats</h2>
          <div className="space-y-3">
            {history.slice(0,5).map((t:any)=>(
              <div key={t.id} className="bg-slate-800 p-3 rounded-xl flex justify-between">
                <div>
                  <p>{t.attack_type}</p>
                  <p className="text-sm text-slate-400">{t.confidence}%</p>
                </div>
                <span className={`px-3 py-1 rounded-full ${badge(t.severity)}`}>{t.severity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Live Threat Feed</h2>
        <div className="space-y-3">
          {history.slice(0,10).map((t:any)=>(
            <div key={t.id} className="bg-slate-800 p-4 rounded-xl flex justify-between">
              <div>
                <p className="font-semibold">{t.attack_type}</p>
                <p className="text-sm text-slate-400">Confidence: {t.confidence}%</p>
              </div>
              <span className={`px-3 py-1 rounded-full ${badge(t.severity)}`}>{t.severity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Threat History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Attack</th>
                <th className="p-3 text-left">Confidence</th>
                <th className="p-3 text-left">Severity</th>
                <th className="p-3 text-left">Risk</th>
              </tr>
            </thead>
            <tbody>
            {history.map((t:any)=>(
              <tr key={t.id} className="border-b border-slate-800">
                <td className="p-3">{t.id}</td>
                <td className="p-3">{t.attack_type}</td>
                <td className="p-3">{t.confidence}%</td>
                <td className="p-3"><span className={`px-3 py-1 rounded-full ${badge(t.severity)}`}>{t.severity}</span></td>
                <td className="p-3">{t.risk_score}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
}
