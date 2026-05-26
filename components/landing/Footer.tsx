import React from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Medal, Aperture } from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-background pt-16 pb-8 relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute right-0 bottom-0 w-48 h-48 opacity-[0.02] bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:12px_12px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        
        {/* Top Section: Brand & Navigation columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          
          {/* Brand details */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/utc.jpg" 
                alt="Unity Tech Hub Logo" 
                width={40} 
                height={40} 
                className="rounded-lg border border-zinc-800" 
              />
              <span className="text-xl font-bold text-[#00F59B] tracking-tight">
                Unity Tech Hub Kids
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Qendra kryesore e edukimit teknologjik për fëmijë në qytetin e Vushtrrisë. Ne fuqizojmë brezin e ri përmes teknologjisë.
            </p>
          </div>

          {/* Contact details */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Kontakti
            </h4>
            <ul className="flex flex-col gap-3 text-zinc-300 text-sm">
              <li className="flex items-center gap-3 group">
                <MapPin className="w-5 h-5 text-[#00F59B] shrink-0" />
                <span className="group-hover:text-white transition-colors duration-200">
                  Rr. Ismail Qemali, Vushtrri
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-[#00F59B] shrink-0" />
                <span className="group-hover:text-white transition-colors duration-200">
                  +383 4X XXX XXX
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-[#00F59B] shrink-0" />
                <a 
                  href="mailto:info@unitytechhub.com" 
                  className="group-hover:text-white transition-colors duration-200"
                >
                  info@unitytechhub.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social connections */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Sociale
            </h4>
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center text-[#00F59B] hover:bg-[#00F59B]/10 active:scale-95 transition-all shadow-sm shadow-[#00F59B]/5"
                aria-label="Rewards"
              >
                <Medal className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center text-[#00F59B] hover:bg-[#00F59B]/10 active:scale-95 transition-all shadow-sm shadow-[#00F59B]/5"
                aria-label="Achievements"
              >
                <Aperture className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-zinc-500 font-medium">
          <div>
            © 2024 Unity Tech Hub. Të gjitha të drejtat e rezervuara.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors duration-200">
              Privatësia
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Termat
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer