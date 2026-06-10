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

  // 1. Siguro që ekziston kursi, modulet, leksionet dhe sfidat (Database Seeding e shpejtë)
  const defaultCourse = await prisma.course.findUnique({
    where: { id: "course_blockly_1" },
  });

  const challengesCount = await prisma.challenge.count({
    where: { id: { in: ["sfida_html_1", "sfida_html_2", "sfida_html_3", "sfida_html_4"] } }
  });

  if (!defaultCourse || challengesCount < 4) {
    await prisma.$transaction(async (tx) => {
      // Krijo Kursin
      await tx.course.upsert({
        where: { id: "course_blockly_1" },
        update: {},
        create: {
          id: "course_blockly_1",
          title: "Blockly për Kids",
          description: "Mëso programimin duke ndërtuar faqe me blloqe yjesh",
          level: "KIDS_6_9",
        },
      });

      // Krijo Modulin
      await tx.module.upsert({
        where: { id: "module_blockly_1" },
        update: {},
        create: {
          id: "module_blockly_1",
          courseId: "course_blockly_1",
          title: "🪐 Fillimet Kozmike",
          order: 1,
        },
      });

      // Krijo Leksionin 1
      await tx.lesson.upsert({
        where: { id: "lesson_b1" },
        update: {},
        create: {
          id: "lesson_b1",
          moduleId: "module_blockly_1",
          title: "🛰️ Sekuenca e Parë",
          content: "Hyrje në HTML dhe blloqe",
          order: 1,
        },
      });

      // Krijo Leksionin 2
      await tx.lesson.upsert({
        where: { id: "lesson_b2" },
        update: {},
        create: {
          id: "lesson_b2",
          moduleId: "module_blockly_1",
          title: "🚀 Portali i Lansimit",
          content: "Butonat dhe portalet e teleportimit",
          order: 2,
        },
      });

      // Sfida 1 (Leksioni 1)
      await tx.challenge.upsert({
        where: { id: "sfida_html_1" },
        update: {},
        create: {
          id: "sfida_html_1",
          lessonId: "lesson_b1",
          instructions: "Krijo një faqe që përmban një titull kryesor me tekstin saktësisht 'Përshëndetje Botë!' brenda bllokut Trup të faqes.",
          solutionCode: "<h1>Përshëndetje Botë!</h1>",
          xpReward: 30,
        },
      });

      // Sfida 2 (Leksioni 1)
      await tx.challenge.upsert({
        where: { id: "sfida_html_2" },
        update: {},
        create: {
          id: "sfida_html_2",
          lessonId: "lesson_b1",
          instructions: "Ndërto artikull me titull <h1>, paragraf <p> me tekstin 'Unë po mësoj kodim!' dhe një bllok Foto-Galaktike.",
          solutionCode: "<img>",
          xpReward: 40,
        },
      });

      // Sfida 3 (Leksioni 2)
      await tx.challenge.upsert({
        where: { id: "sfida_html_3" },
        update: {},
        create: {
          id: "sfida_html_3",
          lessonId: "lesson_b2",
          instructions: "Krijo buton të gjelbër me tekstin 'Kliko Këtu' dhe link <a> me tekstin 'UTC Kids' që çon te 'https://utckids.com'.",
          solutionCode: "<a>",
          xpReward: 50,
        },
      });

      // Sfida 4 (Leksioni 2)
      await tx.challenge.upsert({
        where: { id: "sfida_html_4" },
        update: {},
        create: {
          id: "sfida_html_4",
          lessonId: "lesson_b2",
          instructions: "Krijo një listë me dy elemente që përmbajnë tekstet 'Udhëto në Mars' dhe 'Fluturo në Hënë'.",
          solutionCode: "<ul>",
          xpReward: 60,
        },
      });
    });
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
