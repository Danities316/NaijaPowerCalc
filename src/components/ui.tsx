import { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${className}`}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl">
        {children}
      </h2>
      {hint && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  )
}

export function Pill({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'accent' | 'slate' }) {
  const tones = {
    brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
    accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>
}

export function NumberInput({
  value, onChange, min = 0, max, step = 1, suffix, ariaLabel,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
  ariaLabel?: string
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        aria-label={ariaLabel}
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-semibold text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
          {suffix}
        </span>
      )}
    </div>
  )
}

export function StatBig({ value, label, sub, tone = 'brand' }: { value: string; label: string; sub?: string; tone?: 'brand' | 'accent' | 'slate' }) {
  const colors = {
    brand: 'text-brand-600 dark:text-brand-400',
    accent: 'text-accent-600 dark:text-accent-400',
    slate: 'text-slate-700 dark:text-slate-200',
  }
  return (
    <div className="animate-pop">
      <div className={`font-display text-3xl font-extrabold tracking-tight ${colors[tone]} sm:text-4xl`}>{value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</div>
      {sub && <div className="text-xs text-slate-500 dark:text-slate-400">{sub}</div>}
    </div>
  )
}
