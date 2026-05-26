import React from 'react'
import { Rocket } from 'lucide-react'

function RrugaMesimore() {
  const steps = [
    {
      id: 1,
      title: "Blockly Logic",
      description: "Bazat e programimit përmes blloqeve vizuale.",
      type: "number",
      value: "1"
    },
    {
      id: 2,
      title: "Python Basics",
      description: "Kalimi në sintaksën e vërtetë me gjuhën Python.",
      type: "number",
      value: "2"
    },
    {
      id: 3,
      title: "Web Studio",
      description: "Krijimi i uebfaqeve të para me HTML/CSS.",
      type: "number",
      value: "3"
    },
    {
      id: 4,
      title: "Pro React",
      description: "Aplikacione moderne me React dhe Next.js.",
      type: "icon",
      value: Rocket
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-background">
      {/* Side background details to match the theme */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-96 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Rruga drejt Suksesit
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Udhëtimi i fëmijës tuaj nga kurioziteti në krijimin e aplikacioneve reale.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Desktop Horizontal Connecting Line */}
          <div className="absolute top-6 left-[12.5%] right-[12.5%] h-[2px] bg-zinc-800/80 hidden lg:block -z-10">
            {/* Filled progress up to Step 3 (66.6% of the timeline path) */}
            <div className="absolute left-0 top-0 h-full bg-[#00F59B] w-[66.6%] shadow-sm shadow-[#00F59B]/50" />
          </div>

          {/* Mobile/Tablet Vertical Connecting Line */}
          <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-zinc-800/80 lg:hidden -z-10">
            {/* Filled progress up to Step 3 */}
            <div className="absolute left-0 top-0 w-full bg-[#00F59B] h-[66.6%] shadow-sm shadow-[#00F59B]/50" />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-6">
            {steps.map((step, idx) => {
              const Icon = step.value;
              return (
                <div 
                  key={idx} 
                  className="flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center gap-6 lg:gap-0 group"
                >
                  
                  {/* Circle / Icon Container */}
                  <div className="relative shrink-0 lg:mb-6">
                    {step.type === "number" ? (
                      <div className="w-12 h-12 rounded-full bg-[#00F59B] text-zinc-950 font-extrabold flex items-center justify-center text-lg shadow-lg shadow-[#00F59B]/10 group-hover:scale-110 group-hover:shadow-[#00F59B]/20 transition-all duration-300">
                        {step.value}
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800/85 text-[#00F59B] flex items-center justify-center shadow-lg shadow-black/40 group-hover:scale-110 group-hover:border-zinc-700 transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 lg:px-2 pt-1 lg:pt-0">
                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-[#00F59B] transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-xs lg:mx-auto">
                      {step.description}
                    </p>
                  </div>

                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}

export default RrugaMesimore