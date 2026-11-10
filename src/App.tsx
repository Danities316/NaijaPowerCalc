import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_INPUTS, Inputs } from './lib/constants'
import { calculate } from './lib/calc'
import { encodeInputs, decodeInputs, shareText, shareUrl } from './lib/share'
import { InputsPanel } from './components/InputsPanel'
import { ResultsPanel } from './components/ResultsPanel'
import { AdSenseUnit } from './components/AdSenseUnit'
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

        <AdSenseUnit slot={import.meta.env.VITE_ADSENSE_SLOT_RESULTS} />
        <BuyingGuide />
        <AdSenseUnit slot={import.meta.env.VITE_ADSENSE_SLOT_GUIDE} />
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
        Find the right generator and solar size for your Nigerian home.
      </h1>
      <p className="mt-1.5 text-sm text-brand-50/90 sm:text-base">
        Add your appliances to estimate generator kVA, solar panel capacity, battery backup and monthly fuel costs. Free, instant and no sign-up.
      </p>
    </section>
  )
}

function BuyingGuide() {
  return (
    <section className="mt-6 space-y-4">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
          Generator and solar sizing made for Nigerian homes
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Choosing backup power starts with what you need to run, not just the number of bedrooms. Add your appliances and how long you need backup to compare an estimated generator size, solar panel capacity, battery size and running costs. Your location helps estimate available sunlight, while fuel type and price help estimate generator expenses.
        </p>
        <h3 className="mt-4 font-semibold text-slate-800 dark:text-slate-100">How to use the power calculator</h3>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <li>Select the appliances you want to power and set their quantity.</li>
          <li>Enter your backup hours and choose your Nigerian location.</li>
          <li>Review the estimated kVA, solar and battery sizes, and monthly cost comparison.</li>
        </ol>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Use the results as a starting point when comparing generator, inverter, battery or solar installation quotes. Share your power plan with a supplier or qualified installer, and ask them to confirm appliance starting surges, equipment specifications, warranty and installation requirements before you buy.
        </p>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
          Generator and solar calculator FAQs
        </h2>
        <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
          <details className="py-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100">What size generator do I need for my house?</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Generator size depends on the appliances you run at the same time and their starting surge, not only the number of rooms. Select your appliances above for an estimate, then have an installer verify the load before purchase.</p>
          </details>
          <details className="py-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100">How many solar panels and batteries do I need?</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Solar panel and battery requirements depend on your daily energy use, desired backup hours, location and system losses. Enter your appliance use and location to see an initial estimate.</p>
          </details>
          <details className="py-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100">Can I use this to compare petrol and diesel generator costs?</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Yes. Choose petrol or diesel and adjust the fuel price to compare estimated monthly generator and hybrid running costs. Actual consumption varies with generator model, load and maintenance.</p>
          </details>
          <details className="py-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100">Are the equipment sizes and prices guaranteed?</summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">No. These are planning estimates, not an engineering design, product quote or guarantee. Confirm actual loads, equipment specifications, current prices and installation details with a qualified professional.</p>
          </details>
        </div>
      </article>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <p className="font-semibold text-slate-700 dark:text-slate-300">NaijaPowerCalc — free generator and solar planning estimates for Nigeria.</p>
      <p className="mt-1 max-w-2xl">
        Results are estimates, not professional engineering advice or a supplier quote. Prices and real-world performance vary; confirm your requirements with a qualified technician before buying. Appliance selections are calculated in your browser; if you choose to share your plan, its inputs are encoded in the share link.
      </p>
    </footer>
  )
}
