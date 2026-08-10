import { Search, Bell, RefreshCcw, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setTime(
        now.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "medium",
        })
      );
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 bg-[#111827] border-b border-slate-800 flex items-center justify-between px-8">

      {/* Left */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          Security Operations Center
        </h1>

        <p className="text-slate-400 text-sm">
          GuardianPulse Cyber AI Dashboard
        </p>

      </div>

      {/* Center */}

      <div className="w-[450px] relative">

        <Search
          size={18}
          className="absolute left-4 top-4 text-slate-400"
        />

        <input
          placeholder="Search threats, IP address, reports..."
          className="w-full bg-[#1E293B] rounded-xl py-3 pl-12 pr-4 outline-none text-white border border-slate-700 focus:border-cyan-500"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Live */}

        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500 rounded-full px-4 py-2">

          <Wifi
            size={16}
            className="text-green-400"
          />

          <span className="text-green-400 text-sm font-semibold">
            LIVE
          </span>

        </div>

        {/* Refresh */}

        <button className="bg-[#1E293B] p-3 rounded-xl hover:bg-cyan-600 transition">

          <RefreshCcw size={18} />

        </button>

        {/* Notification */}

        <button className="bg-[#1E293B] p-3 rounded-xl hover:bg-cyan-600 transition relative">

          <Bell size={18} />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        {/* Time */}

        <div className="text-right">

          <p className="text-white text-sm font-semibold">
            {time}
          </p>

          <p className="text-slate-400 text-xs">
            System Online
          </p>

        </div>

        {/* User */}

        <div className="flex items-center gap-3">

          <img
            src="https://ui-avatars.com/api/?name=Admin&background=06B6D4&color=fff"
            alt="User"
            className="w-11 h-11 rounded-full"
          />

          <div>

            <p className="font-semibold">
              Administrator
            </p>

            <p className="text-xs text-slate-400">
              Security Analyst
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}