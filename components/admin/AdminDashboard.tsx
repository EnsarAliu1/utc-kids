"use client";

import React from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Award, Calendar } from "lucide-react";

export default function AdminDashboardClient() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  // Mock statistics for the Admin Dashboard
  const stats = [
    { title: "Gjithsej Studentë", value: "148", icon: Users, color: "text-blue-400 bg-blue-500/10" },
    { title: "Kurse Aktive", value: "6", icon: BookOpen, color: "text-[#00F59B] bg-[#00F59B]/10" },
    { title: "Sfidat e Zgjidhura", value: "1,240", icon: Award, color: "text-purple-400 bg-purple-500/10" },
    { title: "Klasa të Regjistruara", value: "12", icon: Calendar, color: "text-amber-400 bg-amber-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#060b08] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#00F59B]/10 bg-[#0a0f0c] p-6 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-lg font-bold text-[#00F59B] tracking-tight">
              UTC Kids
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-[10px] font-bold tracking-widest uppercase">
              Admin
            </span>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00F59B]/10 text-[#00F59B] text-sm font-semibold transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Paneli
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900/50 text-zinc-400 hover:text-white text-sm font-semibold transition-all">
              <Users className="w-4 h-4" />
              Menaxho Ligjëruesit
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900/50 text-zinc-400 hover:text-white text-sm font-semibold transition-all">
              <BookOpen className="w-4 h-4" />
              Kurset & Modulet
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900/50 text-zinc-400 hover:text-white text-sm font-semibold transition-all">
              <Settings className="w-4 h-4" />
              Cilësimet
            </button>
          </nav>
        </div>

        {/* User Footer */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 text-sm font-semibold transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          Çkyqu (Sign Out)
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mirëseerdhe në UTC Panel!</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Këtu mund të menaxhoni kurset, ligjëruesit dhe të shikoni progresin e shkollës.
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-[#0e1410] border border-[#00F59B]/10 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                {/* Visual Glow */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#00F59B]/5 rounded-full blur-xl pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Admin Panels Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Board */}
          <div className="lg:col-span-2 bg-[#0e1410] border border-[#00F59B]/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Aktivitetet e Fundit</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#060b08] border border-zinc-800/40">
                <div>
                  <p className="text-sm font-semibold">Arta Berisha ka zgjidhur sfidën &quot;Loop-at e Para&quot;</p>
                  <p className="text-xs text-zinc-500 mt-1">Para 5 minutave</p>
                </div>
                <span className="text-xs font-bold text-[#00F59B]">+50 XP</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#060b08] border border-zinc-800/40">
                <div>
                  <p className="text-sm font-semibold">Krijuar një klasë e re: &quot;Vushtrri Blockly Kids 1&quot;</p>
                  <p className="text-xs text-zinc-500 mt-1">Para 2 orëve</p>
                </div>
                <span className="text-xs font-bold text-zinc-400">Klasa</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#060b08] border border-zinc-800/40">
                <div>
                  <p className="text-sm font-semibold">Ligjëruesi Ensar Aliu përditësoi kursin Blockly Level 1</p>
                  <p className="text-xs text-zinc-500 mt-1">Dje</p>
                </div>
                <span className="text-xs font-bold text-zinc-400">Kurs</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0e1410] border border-[#00F59B]/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Aksione të Shpejta</h2>
            <div className="flex flex-col gap-3">
              <button className="w-full py-3 rounded-xl bg-[#00F59B] text-zinc-950 text-sm font-bold hover:bg-[#00d888] transition-all">
                Shto Ligjërues të Ri
              </button>
              <button className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold hover:bg-zinc-800 transition-all text-white">
                Krijo Kurs të Ri
              </button>
              <button className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold hover:bg-zinc-800 transition-all text-white">
                Shiko Raportet e Progresit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
