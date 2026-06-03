"use server";

import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export interface AwardXPResult {
  success: boolean;
  error?: string;
  xpAwarded?: number;
  newXp?: number;
  newLevel?: number;
  levelUp?: boolean;
  newBadge?: {
    title: string;
    emoji: string;
  } | null;
}

/**
 * Awards XP to the logged-in student, updates level, and manages achievements.
 */
export async function awardXP(xpAmount: number, challengeId?: string): Promise<AwardXPResult> {
  try {
    const session = await getStudentSession();
    if (!session.studentId) {
      return { success: false, error: "Nuk jeni i identifikuar si student." };
    }

    const studentId = session.studentId;

    // 1. Merr profilin aktual të studentit
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { achievements: true },
    });

    if (!student) {
      return { success: false, error: "Profili i studentit nuk u gjet." };
    }

    // Kontrollo nëse sfida është kryer tashmë për të shmangur fitimin e tepërt të pikëve
    if (challengeId) {
      const existingSubmission = await prisma.submission.findFirst({
        where: {
          studentProfileId: studentId,
          challengeId: challengeId,
          passed: true,
        },
      });
      if (existingSubmission) {
        return {
          success: true,
          xpAwarded: 0,
          newXp: student.xp,
          newLevel: student.level,
          levelUp: false,
          error: "Kjo sfidë është kryer më parë. Nuk u shtuan pikë të reja.",
        };
      }
    }

    // 2. Llogarit pikët e reja dhe nivelin
    const oldLevel = student.level;
    const baseNewXp = student.xp + xpAmount;
    
    // Formula e nivelit: Çdo 100 XP = 1 Nivel (p.sh. Nivel 1 = 0-99 XP, Nivel 2 = 100-199 XP, etj.)
    const baseNewLevel = Math.floor(baseNewXp / 100) + 1;
    const baseLevelUp = baseNewLevel > oldLevel;

    // 3. Kontrollo arritjet (Achievements)
    let newBadge = null;
    const earnedBadgeNames = student.achievements.map((a) => a.badgeName);

    // Arritja 1: Sfida e Parë
    if (!earnedBadgeNames.includes("first_challenge")) {
      newBadge = {
        badgeName: "first_challenge",
        title: "Sfida e Parë",
        emoji: "🚀",
        xpAwarded: 25,
      };
    } 
    // Arritja 2: Arritja e Nivelit 2
    else if (baseLevelUp && baseNewLevel === 2 && !earnedBadgeNames.includes("level_2")) {
      newBadge = {
        badgeName: "level_2",
        title: "Kodet e Parë",
        emoji: "🧙‍♂️",
        xpAwarded: 50,
      };
    }
    // Arritja 3: Arritja e Nivelit 5
    else if (baseLevelUp && baseNewLevel === 5 && !earnedBadgeNames.includes("level_5")) {
      newBadge = {
        badgeName: "level_5",
        title: "Mjeshtër i Bllokut",
        emoji: "👑",
        xpAwarded: 100,
      };
    }

    // Llogarit totalin final duke përfshirë bonusin nga medalja
    const bonusXp = newBadge ? newBadge.xpAwarded : 0;
    const finalXp = baseNewXp + bonusXp;
    const finalLevel = Math.floor(finalXp / 100) + 1;
    const levelUp = finalLevel > oldLevel;

    // 4. Përditëso databazën me transaksion
    await prisma.$transaction(async (tx) => {
      // Përditëso studentin
      await tx.studentProfile.update({
        where: { id: studentId },
        data: {
          xp: finalXp,
          level: finalLevel,
          lastActive: new Date(),
        },
      });

      // Krijo submission-in nëse ka challengeId
      if (challengeId) {
        await tx.submission.create({
          data: {
            studentProfileId: studentId,
            challengeId: challengeId,
            code: `BLOCKLY_COMPLETED_XP_${xpAmount}`,
            passed: true,
          },
        });
      }

      // Shto arritjen e re nëse është fituar
      if (newBadge) {
        await tx.achievement.create({
          data: {
            studentProfileId: studentId,
            badgeName: newBadge.badgeName,
            title: newBadge.title,
            emoji: newBadge.emoji,
            xpAwarded: newBadge.xpAwarded,
          },
        });
      }
    });

    // Rifresko rrugët përkatëse
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/leaderboard");

    return {
      success: true,
      xpAwarded: xpAmount + bonusXp,
      newXp: finalXp,
      newLevel: finalLevel,
      levelUp,
      newBadge: newBadge ? { title: newBadge.title, emoji: newBadge.emoji } : null,
    };
  } catch (err: any) {
    console.error("Gabim në server gjatë dhënies së XP:", err);
    return { success: false, error: err.message || "Ndodhi një gabim në server." };
  }
}

/**
 * Resets XP, levels, submissions, and achievements of the active student.
 */
export async function resetStudentProgress() {
  try {
    const session = await getStudentSession();
    if (!session.studentId) {
      return { success: false, error: "Nuk jeni i identifikuar si student." };
    }

    const studentId = session.studentId;

    await prisma.$transaction(async (tx) => {
      // 1. Fshi të gjitha arritjet e studentit
      await tx.achievement.deleteMany({
        where: { studentProfileId: studentId },
      });

      // 2. Fshi të gjitha submission-et e studentit
      await tx.submission.deleteMany({
        where: { studentProfileId: studentId },
      });

      // 3. Fshi snapshot-et e workspace nëse ka
      await tx.workspaceSnapshot.deleteMany({
        where: { studentProfileId: studentId },
      });

      // 4. Rivendos XP, nivelin dhe streak
      await tx.studentProfile.update({
        where: { id: studentId },
        data: {
          xp: 0,
          level: 1,
          streak: 0,
          lastActive: null,
        },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/leaderboard");
    revalidatePath("/dashboard/editor");

    return { success: true };
  } catch (err: any) {
    console.error("Gabim gjatë rivendosjes së progresit:", err);
    return { success: false, error: err.message || "Ndodhi një gabim në server." };
  }
}

