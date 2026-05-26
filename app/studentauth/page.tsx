"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, User, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function StudentAuth() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">

      {/* Decorative background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      {/* Green radial glow top-center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#00F59B]/5 blur-[80px] pointer-events-none" />
      {/* Decorative icons */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[#00F59B]/10 hidden lg:block pointer-events-none select-none">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
      <div className="absolute right-10 bottom-1/3 text-[#00F59B]/10 hidden lg:block pointer-events-none select-none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-6 pb-2">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/utc.jpg"
            alt="Unity Tech Hub Kids Logo"
            width={38}
            height={38}
            className="rounded-lg border border-zinc-800"
          />
          <span className="text-lg font-bold text-[#00F59B] tracking-tight hidden sm:inline">
            Unity Tech Hub Kids
          </span>
        </Link>

        {/* Back button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Kthehu mbrapa
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {tab === 'login' ? 'Mirësevini në botën e kodimit!' : 'Krijo llogarinë tënde!'}
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            {tab === 'login'
              ? 'Hyr në portalin tënd të teknologjisë'
              : 'Fillo aventurën tënde si student i ri'}
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md relative">
          {/* Glowing border effect */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[#00F59B]/30 via-[#00F59B]/10 to-transparent pointer-events-none" />

          <div className="relative bg-[#0e1a14]/95 border border-[#00F59B]/15 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

            {/* Tab Switcher */}
            <div className="flex bg-[#0a0a0a]/80 rounded-xl p-1 mb-8 border border-zinc-800/60">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  tab === 'login'
                    ? 'bg-[#00F59B] text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Hyrja
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  tab === 'register'
                    ? 'bg-[#00F59B] text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Regjistrohu
              </button>
            </div>

            <form className="flex flex-col gap-5" onSubmit={e => e.preventDefault()}>

              {/* --- REGISTER ONLY FIELDS --- */}
              {tab === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Emri */}
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00F59B] uppercase">
                      <User className="w-3 h-3" /> Emri
                    </label>
                    <input
                      type="text"
                      placeholder="p.sh. Arta"
                      className="bg-[#0a0f0c]/80 border border-zinc-800 hover:border-zinc-700 focus:border-[#00F59B]/50 focus:ring-2 focus:ring-[#00F59B]/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200"
                    />
                  </div>
                  {/* Mbiemri */}
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00F59B] uppercase">
                      <User className="w-3 h-3" /> Mbiemri
                    </label>
                    <input
                      type="text"
                      placeholder="p.sh. Berisha"
                      className="bg-[#0a0f0c]/80 border border-zinc-800 hover:border-zinc-700 focus:border-[#00F59B]/50 focus:ring-2 focus:ring-[#00F59B]/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Username */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00F59B] uppercase">
                  <Mail className="w-3 h-3" /> Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  className="bg-[#0a0f0c]/80 border border-zinc-800 hover:border-zinc-700 focus:border-[#00F59B]/50 focus:ring-2 focus:ring-[#00F59B]/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00F59B] uppercase">
                  <Lock className="w-3 h-3" /> Kodi Sekret
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-[#0a0f0c]/80 border border-zinc-800 hover:border-zinc-700 focus:border-[#00F59B]/50 focus:ring-2 focus:ring-[#00F59B]/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#00F59B] transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full h-12 rounded-xl bg-[#00F59B] text-zinc-950 font-bold text-base hover:bg-[#00d888] hover:scale-[1.01] active:scale-95 transition-all duration-200 shadow-lg shadow-[#00F59B]/10 hover:shadow-[#00F59B]/20"
              >
                {tab === 'login' ? 'Fillo Aventurën 🚀' : 'Regjistrohu Tani 🎯'}
              </button>

            </form>

            {/* Switch tab link */}
            <div className="mt-6 text-center">
              {tab === 'login' ? (
                <>
                  <p className="text-zinc-600 text-xs tracking-wider uppercase mb-2">S&apos;ke një llogari?</p>
                  <button
                    onClick={() => setTab('register')}
                    className="text-[#00F59B] text-xs font-bold tracking-widest uppercase hover:underline transition-all"
                  >
                    Regjistrohu si Student i Ri
                  </button>
                </>
              ) : (
                <>
                  <p className="text-zinc-600 text-xs tracking-wider uppercase mb-2">Ke tashmë llogari?</p>
                  <button
                    onClick={() => setTab('login')}
                    className="text-[#00F59B] text-xs font-bold tracking-widest uppercase hover:underline transition-all"
                  >
                    Hyr në llogari
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}
