import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'

function Ballina() {
  return (
    <section className="relative min-h-[80vh] flex items-center py-12 lg:py-20 overflow-hidden bg-background">
      {/* Decorative background grid pattern on the right side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-700 via-transparent to-transparent hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Mëso Programimin në <br />
              <span className="text-[#00F59B]">Unity Tech Hub</span>
            </h1>

            <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Platforma unike hibride për fëmijët e Vushtrrisë. Kaloni nga blloqet vizuale në kodin profesional përmes lojës dhe sfidave kreative.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link href="/studentauth">
                <Button
                  className="h-12 px-8 rounded-xl bg-[#00F59B] text-zinc-950 font-bold hover:bg-[#00d888] active:scale-95 transition-all shadow-lg shadow-[#00F59B]/10 hover:shadow-[#00F59B]/20 duration-200 text-lg"
                >
                  Fillo Falas
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-12 px-8 rounded-xl border border-zinc-800 bg-zinc-900/30 text-[#00F59B] font-semibold hover:bg-zinc-500 hover:text-[#00F59B] hover:border-zinc-700 active:scale-95 transition-all duration-200 text-lg"
              >
                Shiko Kurset
              </Button>
            </div>
          </div>

          {/* Right Column: Hero Image & Badges */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            {/* Dot Grid Pattern behind image */}
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-16 h-72 opacity-20 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:12px_12px] z-0 hidden xl:block pointer-events-none" />

            <div className="relative w-full max-w-[500px] lg:max-w-none">
              {/* Backing decorative rotated green border/card */}
              <div className="absolute inset-0 bg-emerald-950/20 border border-[#00F59B]/10 rounded-3xl -rotate-2 -translate-x-3 translate-y-3 z-0" />

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl z-10">
                <Image
                  src="/ballina-image.png"
                  alt="Mëso Programimin në Unity Tech Hub"
                  width={600}
                  height={375}
                  className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-500"
                  priority={true}
                />
              </div>

              {/* Floating Award Badge */}
              <div className="absolute -bottom-4 right-4 lg:-right-4 z-20 bg-zinc-900/90 border border-zinc-800/80 rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <BadgeCheck className="w-8 h-8 text-[#00F59B] shrink-0" />
                <div>
                  <div className="text-white font-bold text-sm tracking-tight">Sfidë e Re!</div>
                  <div className="text-zinc-400 text-xs mt-0.5 font-medium">Fito 500 XP sot</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

export default Ballina