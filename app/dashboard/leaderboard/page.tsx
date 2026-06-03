import React from "react";
import { getStudentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Trophy, Flame, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function LeaderboardPage() {
  const session = await getStudentSession();

  if (!session.studentId) {
    redirect("/studentauth");
  }

  // Merr të gjithë studentët e renditur sipas XP në mënyrë zbritëse
  const students = await prisma.studentProfile.findMany({
    orderBy: { xp: "desc" },
    include: {
      achievements: true,
    },
  });

  // Gjej rangun e studentit aktual të loguar
  const currentStudentIdx = students.findIndex((s) => s.id === session.studentId);
  const currentStudentRank = currentStudentIdx !== -1 ? currentStudentIdx + 1 : null;
  const currentStudentData = currentStudentIdx !== -1 ? students[currentStudentIdx] : null;

  return (
    <div className="min-h-screen bg-[#070d0a] text-white flex flex-col">
      {/* Top Header */}
      <header className="border-b border-[#00F59B]/10 bg-[#0a0f0c] px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#00F59B] transition-all bg-[#0e1410] px-3 py-1.5 rounded-xl border border-zinc-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kthehu te Paneli
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-lg font-bold text-white tracking-tight">Tabela e Nderit</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs font-semibold text-zinc-300">
            Nxënësi: <span className="text-[#00F59B] font-bold">{session.fullName}</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* Top Header Banner */}
        <section className="relative rounded-3xl bg-gradient-to-r from-[#0b1b12] to-[#070d0a] border border-[#00F59B]/20 p-8 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="z-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              Kampionët e UTC Kids <Sparkles className="w-6 h-6 text-[#00F59B] animate-pulse" />
            </h1>
            <p className="text-zinc-400 text-sm mt-2 max-w-md">
              Sfidoni shokët, zgjidhni detyrat e programimit dhe fitoni XP për t'u bërë programuesi më i mirë!
            </p>
          </div>

          {currentStudentRank && currentStudentData && (
            <div className="bg-[#070c08] border border-[#00F59B]/30 rounded-2xl p-5 text-center min-w-[200px] z-10 shadow-lg">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Rangu yt aktual</span>
              <div className="text-3xl font-black text-[#00F59B] mt-1">#{currentStudentRank}</div>
              <div className="text-xs text-zinc-300 font-semibold mt-2">{currentStudentData.xp} XP • Nivel {currentStudentData.level}</div>
            </div>
          )}

          {/* Glowing shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F59B]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#00F59B]/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Podium for Top 3 */}
        {students.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-4">
            {/* Rank 2 */}
            {students[1] && (
              <div className="bg-[#0e1410] border border-zinc-800 rounded-2xl p-6 text-center order-2 md:order-1 flex flex-col items-center shadow-lg">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-500 flex items-center justify-center text-3xl font-extrabold shadow-md">
                    🥈
                  </div>
                  <span className="absolute -top-2 -right-2 bg-zinc-500 text-zinc-950 font-black text-xs px-2 py-0.5 rounded-full">
                    #2
                  </span>
                </div>
                <h3 className="font-bold mt-4 text-base line-clamp-1">{students[1].fullName}</h3>
                <p className="text-[#00F59B] text-xs font-bold mt-1">Niveli {students[1].level}</p>
                <div className="mt-3 px-3 py-1 bg-[#070c08] rounded-xl text-xs font-bold text-zinc-300">
                  {students[1].xp} XP
                </div>
                <div className="flex gap-1.5 mt-3">
                  {students[1].achievements.slice(0, 3).map((ach) => (
                    <span key={ach.id} title={ach.title} className="text-sm">
                      {ach.emoji}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rank 1 (Middle and tallest) */}
            {students[0] && (
              <div className="bg-[#0e1410] border-2 border-[#00F59B]/40 rounded-3xl p-8 text-center order-1 md:order-2 flex flex-col items-center relative shadow-[#00F59B]/5 shadow-2xl md:scale-105">
                <Crown className="w-8 h-8 text-amber-400 absolute -top-5 animate-bounce" />
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-4 border-amber-300 flex items-center justify-center text-4xl font-extrabold shadow-lg">
                    👑
                  </div>
                  <span className="absolute -top-1 -right-2 bg-amber-400 text-zinc-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                    #1
                  </span>
                </div>
                <h3 className="font-black mt-4 text-lg line-clamp-1 text-amber-300">{students[0].fullName}</h3>
                <p className="text-[#00F59B] text-xs font-bold mt-1">Niveli {students[0].level}</p>
                <div className="mt-3 px-4 py-1.5 bg-[#00F59B]/10 border border-[#00F59B]/20 rounded-xl text-sm font-black text-[#00F59B]">
                  {students[0].xp} XP
                </div>
                <div className="flex gap-2 mt-4">
                  {students[0].achievements.slice(0, 4).map((ach) => (
                    <span key={ach.id} title={ach.title} className="text-base">
                      {ach.emoji}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {students[2] && (
              <div className="bg-[#0e1410] border border-zinc-800 rounded-2xl p-6 text-center order-3 flex flex-col items-center shadow-lg">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-amber-700 flex items-center justify-center text-3xl font-extrabold shadow-md">
                    🥉
                  </div>
                  <span className="absolute -top-2 -right-2 bg-amber-700 text-zinc-950 font-black text-xs px-2 py-0.5 rounded-full">
                    #3
                  </span>
                </div>
                <h3 className="font-bold mt-4 text-base line-clamp-1">{students[2].fullName}</h3>
                <p className="text-[#00F59B] text-xs font-bold mt-1">Niveli {students[2].level}</p>
                <div className="mt-3 px-3 py-1 bg-[#070c08] rounded-xl text-xs font-bold text-zinc-300">
                  {students[2].xp} XP
                </div>
                <div className="flex gap-1.5 mt-3">
                  {students[2].achievements.slice(0, 3).map((ach) => (
                    <span key={ach.id} title={ach.title} className="text-sm">
                      {ach.emoji}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Leaderboard Table List */}
        <section className="bg-[#0e1410] border border-[#00F59B]/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-zinc-800/60 bg-[#0c120e] flex items-center justify-between">
            <h2 className="font-bold text-sm tracking-wide text-zinc-300">Të Gjithë Studentët</h2>
            <span className="text-xs text-zinc-500 font-medium">{students.length} nxënës gjithsej</span>
          </div>

          <div className="divide-y divide-zinc-800/40">
            {students.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-xs">
                Nuk ka ende nxënës të regjistruar në sistem.
              </div>
            )}

            {students.map((student, index) => {
              const rank = index + 1;
              const isCurrent = student.id === session.studentId;

              return (
                <div
                  key={student.id}
                  className={`flex items-center justify-between px-6 py-4 transition-all ${
                    isCurrent ? "bg-[#00F59B]/5 border-l-4 border-l-[#00F59B]" : "hover:bg-zinc-800/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center text-sm font-extrabold text-zinc-400">
                      #{rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isCurrent ? "text-[#00F59B]" : "text-white"}`}>
                          {student.fullName}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-[8px] font-black uppercase">
                            TI
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {student.achievements.map((ach) => (
                          <span
                            key={ach.id}
                            title={ach.title}
                            className="text-xs cursor-help select-none"
                          >
                            {ach.emoji}
                          </span>
                        ))}
                        {student.achievements.length === 0 && (
                          <span className="text-[10px] text-zinc-600 italic">Pa medalje akoma</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-zinc-400 font-semibold">Niveli {student.level}</div>
                      <div className="text-xs text-amber-400 font-black mt-0.5">{student.xp} XP</div>
                    </div>
                    {student.streak > 0 && (
                      <div className="flex items-center gap-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-2 py-1 rounded-lg text-xs font-bold">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {student.streak}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
