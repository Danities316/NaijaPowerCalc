import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_INPUTS, Inputs } from './lib/constants'
import { calculate } from './lib/calc'
import { encodeInputs, decodeInputs, shareText, shareUrl } from './lib/share'
import { InputsPanel } from './components/InputsPanel'
import { ResultsPanel } from './components/ResultsPanel'
import { Sun, Moon, Share, Check, Refresh, Bolt } from './components/icons'

type Theme = 'light' | 'dark'

export default function App() {
  const [input, setInput] = useState<Inputs>(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('s')
    if (s) {
      const decoded = decodeInputs(s, DEFAULT_INPUTS)
      if (decoded) return decoded
    }
    return DEFAULT_INPUTS
  })

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('npc-theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('npc-theme', theme)
  }, [theme])

  const results = useMemo(() => calculate(input), [input])

  const onShare = async () => {
    const payload = encodeInputs(input)
    const url = shareUrl(payload)
    const text = shareText(results, input.fuelType)
    if (navigator.share) {
      try { await navigator.share({ title: 'NaijaPowerCalc', text, url }); return } catch { /* fall through */ }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const onWhatsApp = () => {
    const payload = encodeInputs(input)
    const url = shareUrl(payload)
    const text = encodeURIComponent(`${shareText(results, input.fuelType)}\n${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener')
  }

  const onReset = () => {
    setInput(DEFAULT_INPUTS)
    const u = new URL(window.location.href)
    u.search = ''
    window.history.replaceState({}, '', u.toString())
  }

  return (
    <div className="min-h-full">
      <Header
        theme={theme}
        onTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onShare={onShare}
        onWhatsApp={onWhatsApp}
        onReset={onReset}
        copied={copied}
      />

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-4 sm:pt-6">
        <Hero />

        <div className="mt-5 space-y-4">
          <InputsPanel input={input} onChange={setInput} />
          <ResultsPanel r={results} fuelType={input.fuelType} />
        </div>

        <AdSlot label="Sponsored — Generators, inverters & solar kits on Jumia/Konga" />

        <Footer />
      </main>
    </div>
  )
}

function Header({
  theme, onTheme, onShare, onWhatsApp, onReset, copied,
}: {
  theme: Theme
  onTheme: () => void
  onShare: () => void
  onWhatsApp: () => void
  onReset: () => void
  copied: boolean
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <Bolt className="h-5 w-5" />
        </div>
        <div className="mr-auto">
          <div className="font-display text-base font-bold leading-none text-slate-900 dark:text-slate-50">
            NaijaPowerCalc
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Free generator & solar calculator</div>
        </div>

        <button onClick={onReset} aria-label="Reset" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800">
          <Refresh className="h-4 w-4" />
        </button>
        <button onClick={onTheme} aria-label="Toggle dark mode" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button onClick={onWhatsApp} className="rounded-lg bg-[#25D366] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90">
          WhatsApp
        </button>
        <button onClick={onShare} aria-label="Share result" className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-700">
          {copied ? <Check className="h-4 w-4" /> : <Share className="h-4 w-4" />}
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-5 py-5 text-white shadow-sm sm:px-7 sm:py-7">
      <h1 className="font-display text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
        Know your correct generator & solar size in 60 seconds.
      </h1>
      <p className="mt-1.5 text-sm text-brand-50/90 sm:text-base">
        Tap the things wey dey your house. We go show you the right kVA, solar size, and how much fuel money you go save. Free, no signup.
      </p>
    </section>
  )
}

function AdSlot({ label }: { label: string }) {
  return (
    <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Ad space</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <p className="font-semibold text-slate-700 dark:text-slate-300">NaijaPowerCalc — free expert consultation, no charge.</p>
      <p className="mt-1 max-w-2xl">
        Estimates use realistic Nigerian fuel prices, generator efficiencies, solar irradiance by state and 2026 equipment costs.
        Real installations vary — always confirm with a qualified technician before buying. No data leaves your phone.
      </p>
    </footer>
  )
}
