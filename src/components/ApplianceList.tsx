import { useState } from 'react'
import { Appliance, APPLIANCE_LIBRARY, COMMON_IDS } from '../lib/constants'
import { Plus, Minus, ChevronDown } from './icons'

export function ApplianceList({
  appliances, onChange,
}: {
  appliances: Appliance[]
  onChange: (next: Appliance[]) => void
}) {
  const setQty = (id: string, delta: number) =>
    onChange(appliances.map((a) => (a.id === id ? { ...a, qty: Math.max(0, a.qty + delta) } : a)))

  const setField = (id: string, field: 'watts' | 'hoursPerDay', value: number) =>
    onChange(appliances.map((a) => (a.id === id ? { ...a, [field]: value } : a)))

  const add = (libId: string) => {
    const existing = appliances.find((a) => a.id === libId)
    if (existing) {
      setQty(libId, 1)
      return
    }
    const lib = APPLIANCE_LIBRARY.find((l) => l.id === libId)
    if (!lib) return
    onChange([...appliances, { ...lib, qty: 1 }])
  }

  const common = appliances.filter((a) => COMMON_IDS.includes(a.id))
  const extra = appliances.filter((a) => !COMMON_IDS.includes(a.id))
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="space-y-2.5">
      {common.map((a) => (
        <StepperRow key={a.id} appliance={a} onDelta={(d) => setQty(a.id, d)} onField={(f, v) => setField(a.id, f, v)} />
      ))}

      {extra.length > 0 && (
        <div className="space-y-2.5 pt-1">
          {extra.map((a) => (
            <StepperRow key={a.id} appliance={a} onDelta={(d) => setQty(a.id, d)} onField={(f, v) => setField(a.id, f, v)} onRemove={() => onChange(appliances.filter((x) => x.id !== a.id))} />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowMore((v) => !v)}
        className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        {showMore ? 'Hide extra appliances' : 'Show more appliances (AC, freezer, iron…)'}
        <ChevronDown className={`h-4 w-4 transition ${showMore ? 'rotate-180' : ''}`} />
      </button>

      {showMore && (
        <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-3">
          {APPLIANCE_LIBRARY.filter((l) => !COMMON_IDS.includes(l.id)).map((l) => (
            <button
              key={l.id}
              onClick={() => add(l.id)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Plus className="h-3.5 w-3.5 text-brand-600" />
              <span className="truncate">{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StepperRow({
  appliance: a, onDelta, onField, onRemove,
}: {
  appliance: Appliance
  onDelta: (d: number) => void
  onField: (field: 'watts' | 'hoursPerDay', value: number) => void
  onRemove?: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{a.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{a.watts}W · {a.hoursPerDay}h/day</div>
      </div>
      <div className="flex items-center gap-1.5">
        <StepperBtn onClick={() => onDelta(-1)} disabled={a.qty <= 0} ariaLabel={`Remove one ${a.name}`}>
          <Minus className="h-4 w-4" />
        </StepperBtn>
        <span className="w-7 text-center text-base font-bold tabular-nums text-slate-800 dark:text-slate-100">{a.qty}</span>
        <StepperBtn onClick={() => onDelta(1)} ariaLabel={`Add one ${a.name}`}>
          <Plus className="h-4 w-4" />
        </StepperBtn>
      </div>
      {onRemove && (
        <button onClick={onRemove} aria-label={`Remove ${a.name}`} className="ml-1 rounded-lg p-1 text-slate-300 transition hover:text-red-600 dark:text-slate-600">
          ×
        </button>
      )}
    </div>
  )
}

function StepperBtn({ onClick, disabled, children, ariaLabel }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; ariaLabel: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-700 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
    >
      {children}
    </button>
  )
}
