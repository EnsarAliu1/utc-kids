"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginStudent, type AuthState } from "@/lib/actions/student-auth.actions";
import { Lock, User, Loader2 } from "lucide-react";

const initialState: AuthState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full h-12 rounded-xl bg-[#00F59B] text-zinc-950 font-bold text-base hover:bg-[#00d888] hover:scale-[1.01] active:scale-95 transition-all duration-200 shadow-lg shadow-[#00F59B]/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {label}
    </button>
  );
}

export function StudentLoginForm() {
  const [state, action] = useActionState(loginStudent, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00F59B] uppercase">
          <User className="w-3 h-3" /> Username
        </label>
        <input
          name="username"
          type="text"
          placeholder="username-yt"
          autoComplete="username"
          required
          className="bg-[#0a0f0c]/80 border border-zinc-800 hover:border-zinc-700 focus:border-[#00F59B]/50 focus:ring-2 focus:ring-[#00F59B]/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00F59B] uppercase">
          <Lock className="w-3 h-3" /> Kodi Sekret
        </label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          className="bg-[#0a0f0c]/80 border border-zinc-800 hover:border-zinc-700 focus:border-[#00F59B]/50 focus:ring-2 focus:ring-[#00F59B]/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200"
        />
      </div>

      {state?.error && (
        <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton label="Fillo Aventurën 🚀" />
    </form>
  );
}
