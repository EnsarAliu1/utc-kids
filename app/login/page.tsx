import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">

      {/* Dot grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      {/* Top green glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full bg-[#00F59B]/6 blur-[90px] pointer-events-none" />

      {/* Bottom subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-[#00F59B]/3 blur-[80px] pointer-events-none" />

      {/* Decorative side icons */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#00F59B]/8 hidden xl:block pointer-events-none select-none">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
        </svg>
      </div>
      <div className="absolute right-8 bottom-1/3 text-[#00F59B]/8 hidden xl:block pointer-events-none select-none">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div className="absolute right-16 top-1/4 text-[#00F59B]/6 hidden xl:block pointer-events-none select-none">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>

      {/* Header brand */}
      <header className="relative z-10 flex items-center px-8 pt-7 pb-2">
        <div className="flex items-center gap-3">
          <Image
            src="/utc.jpg"
            alt="Unity Tech Hub Kids Logo"
            width={36}
            height={36}
            className="rounded-lg border border-zinc-800/80"
          />
          <span className="text-base font-bold text-[#00F59B] tracking-tight">
            Unity Tech Hub Kids
          </span>
          <span className="ml-2 px-2 py-0.5 rounded-md bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-[10px] font-bold tracking-widest uppercase">
            Admin
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">

        {/* Title above card */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Portali i Administratorëve
          </h1>
          <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">
            Hyrja është e kufizuar. Vetëm stafi i autorizuar mund të aksesojë këtë panel.
          </p>
        </div>

        {/* Clerk SignIn with custom appearance */}
        <SignIn
          routing="hash"
          appearance={{
            variables: {
              colorPrimary: '#00F59B',
              colorBackground: '#0e1a14',
              colorText: '#ffffff',
              colorTextSecondary: '#71717a',
              colorInputBackground: '#0a0f0c',
              colorInputText: '#ffffff',
              borderRadius: '12px',
              fontFamily: 'inherit',
            },
            elements: {
              rootBox: 'w-full max-w-md',
              card: [
                'bg-[#0e1a14]/95',
                'border border-[#00F59B]/15',
                'rounded-2xl',
                'shadow-2xl',
                'shadow-black/60',
                'backdrop-blur-sm',
                'w-full',
              ].join(' '),
              headerTitle: 'text-white font-bold text-xl',
              headerSubtitle: 'text-zinc-500 text-sm',
              socialButtonsBlockButton: [
                'bg-zinc-900/80',
                'border border-zinc-800',
                'hover:bg-zinc-800',
                'text-white',
                'rounded-xl',
                'transition-all duration-200',
              ].join(' '),
              dividerLine: 'bg-zinc-800',
              dividerText: 'text-zinc-600 text-xs',
              formFieldLabel: 'text-[#00F59B] text-[10px] font-bold tracking-widest uppercase',
              formFieldInput: [
                'bg-[#0a0f0c]/80',
                'border border-zinc-800',
                'hover:border-zinc-700',
                'focus:border-[#00F59B]/50',
                'text-white',
                'rounded-xl',
                'placeholder:text-zinc-600',
                'transition-all duration-200',
              ].join(' '),
              formButtonPrimary: [
                'bg-[#00F59B]',
                'hover:bg-[#00d888]',
                'text-zinc-950',
                'font-bold',
                'rounded-xl',
                'transition-all duration-200',
                'hover:scale-[1.01]',
                'active:scale-95',
                'shadow-lg shadow-[#00F59B]/10',
              ].join(' '),
              footerActionLink: 'text-[#00F59B] hover:text-[#00d888] font-semibold',
              identityPreviewText: 'text-white',
              identityPreviewEditButton: 'text-[#00F59B]',
              formFieldInputShowPasswordButton: 'text-zinc-500 hover:text-[#00F59B]',
              alertText: 'text-red-400',
              formResendCodeLink: 'text-[#00F59B]',
            },
          }}
        />

      </main>

      {/* Footer note */}
      <footer className="relative z-10 text-center pb-6 text-zinc-700 text-xs">
        © 2024 Unity Tech Hub Kids · Portali i brendshëm
      </footer>

    </div>
  )
}