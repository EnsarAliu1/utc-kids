import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface StudentSessionData {
  studentId: string;
  username: string;
  fullName: string;
}

const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET!,
  cookieName: "utc-student-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getStudentSession(): Promise<IronSession<StudentSessionData>> {
  const cookieStore = await cookies();
  return getIronSession<StudentSessionData>(cookieStore, SESSION_OPTIONS);
}
