import React from "react";
import { getStudentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditorClientWrapper from "@/components/editor/EditorClientWrapper";

export default async function EditorPage() {
  const session = await getStudentSession();

  if (!session.studentId) {
    redirect("/studentauth");
  }




  // 2. Lexo studentin dhe progresin e tij reale nga DB
  const student = await prisma.studentProfile.findUnique({
    where: { id: session.studentId },
  });

  if (!student) {
    redirect("/studentauth");
  }

  // 3. Ngarko Modulet dhe Leksionet nga kursi
  const modules = await prisma.module.findMany({
    where: { courseId: "course_blockly_1" },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          challenges: {
            orderBy: { xpReward: "asc" },
          },
        },
      },
    },
  });

  // 4. Merr listën e sfidave të përfunduara për këtë student
  const completedSubmissions = await prisma.submission.findMany({
    where: {
      studentProfileId: student.id,
      passed: true,
    },
    select: {
      challengeId: true,
    },
  });
  const completedIds = completedSubmissions.map((s) => s.challengeId);

  // 5. Merr të gjitha snapshot-et e workspace të studentit
  const snapshots = await prisma.workspaceSnapshot.findMany({
    where: {
      studentProfileId: student.id,
    },
    select: {
      challengeId: true,
      workspace: true,
    },
  });

  const initialSnapshots = snapshots.reduce((acc, curr) => {
    acc[curr.challengeId] = curr.workspace;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#070d0a] text-white flex flex-col">
      <EditorClientWrapper
        student={{
          fullName: student.fullName,
          level: student.level,
          xp: student.xp,
        }}
        modules={modules}
        completedIds={completedIds}
        initialSnapshots={initialSnapshots}
      />
    </div>
  );

}
