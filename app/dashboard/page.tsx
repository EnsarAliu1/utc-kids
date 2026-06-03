import React from "react";
import { getStudentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Trophy, Flame, Play, LogOut, Award, Sparkles } from "lucide-react";
import { logoutStudent } from "@/lib/actions/student-auth.actions";
import { resetStudentProgress } from "@/lib/actions/xp.actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const session = await getStudentSession();

  if (!session.studentId) {
    redirect("/studentauth");
  }

  async function handleResetProgress() {
    "use server";
    await resetStudentProgress();
  }

  // Lexo të dhënat reale të studentit dhe arritjet nga databaza
  const student = await prisma.studentProfile.findUnique({
    where: { id: session.studentId },
    include: {
      achievements: true,
    },
  });

  if (!student) {
    redirect("/studentauth");
  }

  const progressStats = [
    {
      title: "Niveli aktual",
      value: `Niveli ${student.level}`,
      icon: Play,
      color: "text-[#00F59B] bg-[#00F59B]/10",
    },
    {
      title: "Pikët (XP)",
      value: `${student.xp} XP`,
      icon: Trophy,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      title: "Ditë Rresht (Streak)",
      value: `${student.streak} ditë`,
      icon: Flame,
      color: "text-orange-500 bg-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070d0a] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-[#00F59B]/10 bg-[#0a0f0c] px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-[#00F59B] tracking-tight">
              UTC Kids
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-[10px] font-bold tracking-widest uppercase">
              Student
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-[#00F59B] hover:text-[#00d888] transition-all"
            >
              Paneli
            </Link>
            <Link
              href="/dashboard/editor"
              className="text-xs font-bold text-zinc-400 hover:text-[#00F59B] transition-all"
            >
              Kodi Blockly
            </Link>
            <Link
              href="/dashboard/leaderboard"
              className="text-xs font-bold text-zinc-400 hover:text-[#00F59B] transition-all flex items-center gap-1"
            >
              Tabela e Nderit <Trophy className="w-3 h-3 text-amber-400" />
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-zinc-300">
            Përshëndetje, <span className="text-[#00F59B]">{student.fullName}</span>
          </span>
          <form action={logoutStudent}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              Dil
            </button>
          </form>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
        {/* Welcome Section */}
        <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              Fillo aventurën tënde të kodimit! <Sparkles className="w-6 h-6 text-[#00F59B]" />
            </h1>
            <p className="text-zinc-400 text-sm mt-2">
              Mëso programimin duke luajtur me blloqe vizuale ose duke parë kodin e gjeneruar live.
            </p>
          </div>

          <div className="flex gap-3 self-start md:self-center">
            <Link
              href="/dashboard/leaderboard"
              className="px-4 py-2 border border-[#00F59B]/20 bg-[#0e1410] hover:bg-[#121c16] text-[#00F59B] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Shiko Renditjen
            </Link>
            <form action={handleResetProgress}>
              <button
                type="submit"
                className="px-4 py-2 border border-red-500/20 bg-red-950/10 hover:bg-red-950/30 text-red-400 text-xs font-bold rounded-xl transition-all shadow-md"
              >
                Reset Progresin 🔄
              </button>
            </form>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {progressStats.map((stat, i) => {
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
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#00F59B]/5 rounded-full blur-xl pointer-events-none" />
              </div>
            );
          })}
        </section>

        {/* Courses and Achievements */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Course Card */}
          <div className="lg:col-span-2 bg-[#0e1410] border border-[#00F59B]/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-xs font-bold uppercase tracking-wide">
                  Misioni i Radhës
                </span>
                <span className="text-xs text-zinc-500">3 Sfida Hapësinore</span>
              </div>
              <h2 className="text-xl font-bold">Misionet Hapësinore me Blockly</h2>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                Ndihmo raketën tonë kozmike të lundrojë përmes yjeve duke kombinuar blloqe të thjeshta lëvizjeje. Shiko se si blloqet e tua kthehen në kod të vërtetë Javascript!
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-800/60 flex items-center justify-between">
              <div className="w-2/3 bg-zinc-900 rounded-full h-2">
                <div className="bg-[#00F59B] h-2 rounded-full" style={{ width: `${Math.min(student.xp, 100)}%` }}></div>
              </div>
              <Link
                href="/dashboard/editor"
                className="px-5 py-2.5 rounded-xl bg-[#00F59B] text-zinc-950 font-bold text-sm hover:bg-[#00d888] transition-all shadow-md"
              >
                Vazhdo Mësimin 🚀
              </Link>
            </div>
          </div>

          {/* Badges unlocked */}
          <div className="bg-[#0e1410] border border-[#00F59B]/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Medalet e Fituara
            </h2>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {student.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#060b08] border border-zinc-800/40 hover:border-[#00F59B]/30 transition-all"
                >
                  <span className="text-2xl">{ach.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold">{ach.title}</p>
                    <p className="text-[10px] text-zinc-500">Marrë më {new Date(ach.unlockedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}

              {student.achievements.length === 0 && (
                <div className="text-center py-8 text-zinc-500 text-xs italic">
                  Nuk keni fituar ende asnjë medalje.
                  <div className="mt-2 text-[10px] text-[#00F59B] not-italic">
                    Përfundoni sfida për të marrë medaljet e para!
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
