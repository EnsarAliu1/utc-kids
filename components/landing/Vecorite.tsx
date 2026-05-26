import React from 'react'
import { Puzzle, Trophy, Sparkles } from 'lucide-react'

function Vecorite() {
  const features = [
    {
      icon: Puzzle,
      title: "Mësimi Hibrid",
      description: "Kaloni lehtësisht nga 'Blocks' në 'Code'. Fëmijët kuptojnë logjikën përpara se të shkruajnë sintaksën.",
      customFooter: (
        <div className="mt-2 bg-[#0e0e11]/80 border border-zinc-800/80 rounded-2xl p-5 font-mono text-[13px] leading-relaxed text-[#00F59B] w-full">
          <div><span className="text-[#00F59B] font-bold">if</span> (lessonComplete) &#123;</div>
          <div className="pl-4">rewardXP(<span className="text-emerald-400">100</span>);</div>
          <div>&#125;</div>
        </div>
      )
    },
    {
      icon: Trophy,
      title: "Gamifikimi",
      description: "Çdo rresht kodi vlen! XP, distinktivë (badges) dhe leaderboard për t'i mbajtur nxënësit të motivuar.",
      customFooter: (
        <div className="mt-4 w-full space-y-3">
          <div className="h-2.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
            <div className="h-full bg-[#00F59B] rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Level 12</span>
            <span className="text-[#00F59B]">750/1000 XP</span>
          </div>
        </div>
      )
    },
    {
      icon: Sparkles,
      title: "Përshtatja",
      description: "Kurrikula e ndërtuar sipas moshës, nga fillestarët 7 vjeç deri te adoleshentët që duan të bëhen Pro.",
      customFooter: (
        <div className="mt-4 w-full flex items-center gap-3">
          <span className="bg-emerald-950/20 border border-emerald-800/30 text-[#00F59B] text-xs font-bold px-4 py-2 rounded-full tracking-wider">
            7-10 VJEÇ
          </span>
          <span className="bg-emerald-950/20 border border-emerald-800/30 text-[#00F59B] text-xs font-bold px-4 py-2 rounded-full tracking-wider">
            11-14 VJEÇ
          </span>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#00F59B] mb-4">
            Pse Unity Tech Hub Kids?
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Metodologji e avancuar që e bën mësimin e teknologjisë të thjeshtë dhe argëtues.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex flex-col h-full bg-zinc-900/10 border border-zinc-800/60 hover:border-zinc-700/80 rounded-3xl p-8 transition-all duration-350 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 group"
              >
                {/* Icon Container */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/30 border border-[#00F59B]/20 text-[#00F59B] mb-6 shadow-sm shadow-[#00F59B]/5 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Interactive Footer visual */}
                <div className="mt-auto pt-2 flex items-center w-full">
                  {feature.customFooter}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default Vecorite