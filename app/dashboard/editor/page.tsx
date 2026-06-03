import React from "react";
import { getStudentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditorClientWrapper from "@/components/editor/EditorClientWrapper";

export default async function EditorPage() {
  const session = await getStudentSession();

  if (!session.studentId) {
    redirect("/studentauth");
  }

  // Lexo studentin direkt nga databaza për të pasur XP/Nivelin e saktë në kohë reale
  const student = await prisma.studentProfile.findUnique({
    where: { id: session.studentId },
  });

  if (!student) {
    redirect("/studentauth");
  }

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
            <span className="text-lg font-bold text-[#00F59B] tracking-tight">Kodi Blockly</span>
            <span className="px-2 py-0.5 rounded-md bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-[10px] font-bold tracking-widest uppercase">
              Misioni Hapësinor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
            <span className="text-zinc-400">
              Niveli: <span className="text-[#00F59B] font-extrabold">{student.level}</span>
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span className="text-zinc-400">
              Pikët: <span className="text-amber-400 font-extrabold">{student.xp} XP</span>
            </span>
          </div>
          <span className="text-xs font-semibold text-zinc-300">
            Nxënësi: <span className="text-[#00F59B] font-bold">{student.fullName}</span>
          </span>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Sfidat e Hapësirës: Dërgo raketën te ylli! 🚀</h1>
          <p className="text-zinc-400 text-xs mt-1.5 max-w-2xl leading-relaxed">
            Mëso konceptet kryesore të programimit si sekuencat, drejtimet dhe rrotullimet. Zgjidh sfidat e renditura për të fituar XP dhe për t'u ngjitur në nivel.
          </p>
        </div>

        {/* Blockly Workspace */}
        <EditorClientWrapper />
      </main>
    </div>
  );
}
