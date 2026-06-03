"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/session";

export interface AuthState {
  error?: string;
  success?: string;
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerStudent(state: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName  = (formData.get("lastName")  as string)?.trim();
  const username  = (formData.get("username")  as string)?.trim().toLowerCase();
  const password  = formData.get("password") as string;

  console.log("registerStudent u thirr me:", { firstName, lastName, username, password: password ? "[REDACTED]" : undefined });

  if (!firstName || !lastName || !username || !password) {
    console.log("registerStudent error: Mungojnë fushat.");
    return { error: "Të gjitha fushat janë të detyrueshme." };
  }

  if (password.length < 4) {
    console.log("registerStudent error: Kodi sekret tepër i shkurtër.");
    return { error: "Kodi sekret duhet të ketë të paktën 4 karaktere." };
  }

  try {
    const existing = await prisma.studentProfile.findUnique({ where: { username } });
    if (existing) {
      console.log("registerStudent error: Username ekziston.");
      return { error: "Ky username është i zënë. Provo një tjetër." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await prisma.studentProfile.create({
      data: {
        fullName: `${firstName} ${lastName}`,
        username,
        passwordHash,
        age: 0, // Teacher updates this later
      },
    });

    console.log("Studenti u regjistrua me sukses:", created.id);
    return { success: "Llogaria u krijua! Mund të hysh tani." };
  } catch (err: any) {
    console.error("Gabim gjatë regjistrimit:", err);
    return { error: `Ndodhi një gabim gjatë regjistrimit: ${err.message || err}` };
  }
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginStudent(state: AuthState, formData: FormData): Promise<AuthState> {
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  console.log("loginStudent u thirr me:", { username, password: password ? "[REDACTED]" : undefined });

  if (!username || !password) {
    console.log("loginStudent error: Mungon username ose fjalëkalimi.");
    return { error: "Plotëso të dyja fushat." };
  }

  let student;
  try {
    student = await prisma.studentProfile.findUnique({ where: { username } });
  } catch (err: any) {
    console.error("Gabim gjatë leximit të studentit:", err);
    return { error: "Ndodhi një gabim me databazën." };
  }

  if (!student) {
    console.log("loginStudent error: Studenti nuk u gjet.");
    return { error: "Username ose kodi sekret është i gabuar." };
  }

  const isValid = await bcrypt.compare(password, student.passwordHash);
  if (!isValid) {
    console.log("loginStudent error: Fjalëkalimi i pasaktë.");
    return { error: "Username ose kodi sekret është i gabuar." };
  }

  const session = await getStudentSession();
  session.studentId = student.id;
  session.username  = student.username;
  session.fullName  = student.fullName;
  await session.save();

  console.log("Studenti u loggua me sukses, duke e ridrejtuar.");
  redirect("/dashboard");
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutStudent() {
  const session = await getStudentSession();
  session.destroy();
  redirect("/");
}
