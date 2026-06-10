"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/session";

export interface AuthState {
  error?: string;
  success?: string;
}

export async function registerStudent(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const ageRaw = formData.get("age") as string;
  const age = ageRaw ? parseInt(ageRaw, 10) : 0;

  if (!firstName || !lastName || !username || !password)
    return { error: "Të gjitha fushat janë të detyrueshme." };

  if (password.length < 4)
    return { error: "Kodi sekret duhet të ketë të paktën 4 karaktere." };

  try {
    const existing = await prisma.studentProfile.findUnique({
      where: { username },
    });
    if (existing) return { error: "Ky username është i zënë. Provo një tjetër." };

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.studentProfile.create({
      data: { fullName: `${firstName} ${lastName}`, username, passwordHash, age },
    });

    return { success: "Llogaria u krijua! Mund të hysh tani." };
  } catch (err: any) {
    return { error: `Ndodhi një gabim gjatë regjistrimit: ${err.message}` };
  }
}

export async function loginStudent(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!username || !password) return { error: "Plotëso të dyja fushat." };

  try {
    const student = await prisma.studentProfile.findUnique({
      where: { username },
    });

    if (!student || !(await bcrypt.compare(password, student.passwordHash)))
      return { error: "Username ose kodi sekret është i gabuar." };

    const session = await getStudentSession();
    session.studentId = student.id;
    session.username = student.username;
    session.fullName = student.fullName;
    await session.save();
  } catch (err: any) {
    return { error: "Ndodhi një gabim me databazën." };
  }

  redirect("/dashboard");
}

export async function logoutStudent() {
  const session = await getStudentSession();
  session.destroy();
  redirect("/");
}
