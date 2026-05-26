import React from 'react'
import { Button } from '../ui/button'

function Kontakti() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-background">
      {/* Decorative dot grids on the sides */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-64 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] hidden xl:block pointer-events-none" />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-64 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] hidden xl:block pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* CTA Card with Jade Green Radial/Linear Gradient */}
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-500/10 bg-gradient-to-br from-[#022c1b]/80 via-[#061811]/95 to-[#030c08] p-10 sm:p-16 text-center shadow-2xl">
          
          {/* Subtle glowing radial background overlays */}
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-500/10 blur-[60px] pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-[#00F59B]/5 blur-[60px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Gati për të filluar kodimin?
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-medium">
              Regjistrohuni sot dhe merrni 1 javë provë falas në qendrën tonë në Vushtrri.
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              <Button 
                className="h-12 px-8 rounded-xl bg-[#00F59B] text-zinc-950 font-bold hover:bg-[#00d888] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#00F59B]/10 hover:shadow-[#00F59B]/20 duration-200 text-base cursor-pointer"
              >
                Regjistrohu Tani
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Kontakti