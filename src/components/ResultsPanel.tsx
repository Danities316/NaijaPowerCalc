import { useState } from 'react'
import { Results, formatNaira, formatNairaRange } from '../lib/calc'
import { Card, SectionTitle, StatBig, Pill } from './ui'
import { Bolt, Fuel, Sparkles, ChevronDown, Check } from './icons'

export function ResultsPanel({ r, fuelType }: { r: Results; fuelType: 'petrol' | 'diesel' }) {
  const paybackText = Number.isFinite(r.paybackMonths)
    ? `${Math.round(r.paybackMonths)} mo`
    : 'fast'

  return (
    <div className="space-y-4">
      {/* Headline recommendation — biggest thing on screen */}
      <Card className="border-brand-300 bg-gradient-to-br from-brand-50 to-white dark:border-brand-900/60 dark:from-brand-900/30 dark:to-slate-900">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Your power plan
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatBig value={`${r.genKVARounded} kVA`} label="Generator size" sub="will carry your house" tone="accent" />
          <StatBig value={`${r.solarKW} kW`} label="Solar panels" sub={`${r.batteryKWh} kWh battery`} tone="brand" />
        </div>

        {/* The two big pain points, head to head */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <CostBox
            label="Generator only"
            value={formatNaira(r.genMonthlyCost)}
            sub="fuel every month"
            tone="orange"
          />
          <CostBox
            label="Solar + generator"
            value={formatNaira(r.hybridMonthlyCost)}
            sub="fuel every month"
            tone="green"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Pill tone="brand">
            <Check className="mr-1 inline h-3 w-3" /> Saves {formatNaira(r.monthlySavings)}/mo
          </Pill>
          <Pill tone="accent">Pays back in {paybackText}</Pill>
        </div>

        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          Based on typical Nigerian loads, current fuel prices, and real-world generator performance.
        </p>
      </Card>

      {/* Plain-language "What this means for you" */}
      <Card>
        <h3 className="mb-1.5 font-display text-base font-bold text-slate-900 dark:text-slate-50">What this means for you</h3>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{r.summary}</p>

        {r.warnings.length > 0 && (
          <div className="mt-3 space-y-2">
            {r.warnings.map((w, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                  w.tone === 'green'
                    ? 'bg-brand-50 text-brand-800 dark:bg-brand-900/30 dark:text-brand-200'
                    : 'bg-accent-50 text-accent-800 dark:bg-accent-900/30 dark:text-accent-200'
                }`}
              >
                <span className="mt-0.5 text-base leading-none">{w.tone === 'green' ? '✓' : '!'}</span>
                <span>{w.text}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Solar breakdown */}
      <Card>
        <SectionTitle hint="A full solar setup that can cover your backup hours.">
          <span className="inline-flex items-center gap-2"><Bolt className="h-4 w-4 text-brand-600" /> Solar system size</span>
        </SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniStat label="Panels" value={`${r.solarKW} kW`} sub={`~${Math.ceil(r.solarKW * 1000 / 550)} panels`} />
          <MiniStat label="Battery" value={`${r.batteryKWh} kWh`} sub="lithium" />
          <MiniStat label="Inverter" value={`${r.inverterKVA} kVA`} sub="pure sine" />
          <MiniStat label="Install cost" value={formatNairaRange(r.solarCostLow, r.solarCostHigh)} sub="all-in" />
        </div>
      </Card>

      {/* Generator runtime */}
      <Card>
        <SectionTitle hint={`Run-time of the ${r.genKVARounded} kVA generator on a full tank.`}>
          <span className="inline-flex items-center gap-2"><Fuel className="h-4 w-4 text-accent-600" /> Generator run-time</span>
        </SectionTitle>
        <div className="mb-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniStat label="Daily fuel" value={`${r.genDailyLitres} L`} sub={formatNaira(r.genDailyCost)} />
          <MiniStat label="Monthly fuel" value={formatNaira(r.genMonthlyCost)} sub={fuelType} />
          <MiniStat label="Daily energy" value={`${r.dailyKWh} kWh`} sub="all appliances" />
          <MiniStat label="Peak load" value={`${r.peakLoadW} W`} sub="with motor surge" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {r.runtime.map((rt) => (
            <div key={rt.loadPct} className="rounded-lg bg-slate-50 px-3 py-2 text-center dark:bg-slate-800/50">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{rt.label}</div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100">{rt.hours}h</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Side-by-side comparison */}
      <Card>
        <SectionTitle>Compare all options</SectionTitle>
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                <th className="p-3">Option</th>
                <th className="p-3 text-right">Monthly cost</th>
                <th className="p-3 text-right">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <Row name="Generator only" cost={formatNaira(r.genMonthlyCost)} note={`Loud, fuel-heavy, ${fuelType}`} />
              <Row name="Solar + generator" cost={formatNaira(r.hybridMonthlyCost)} note="Quieter, lower fuel" highlight />
              <Row name="Full solar" cost={formatNaira(0)} note="No fuel, big upfront" />
              <Row name="NEPA/Disco only" cost={formatNaira(r.discoMonthlyCost)} note="Unreliable supply" />
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          NEPA estimate uses a blended ₦95/kWh tariff and your disco hours. Real bills vary by band.
        </p>
      </Card>

      <HowWeCalculated r={r} fuelType={fuelType} />
    </div>
  )
}

function CostBox({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: 'green' | 'orange' }) {
  const tones = {
    green: 'border-brand-300 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/30',
    orange: 'border-accent-300 bg-accent-50 dark:border-accent-800 dark:bg-accent-900/30',
  }
  const valColor = {
    green: 'text-brand-700 dark:text-brand-300',
    orange: 'text-accent-700 dark:text-accent-300',
  }
  return (
    <div className={`rounded-xl border px-3 py-3 ${tones[tone]}`}>
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</div>
      <div className={`mt-0.5 font-display text-xl font-extrabold leading-tight ${valColor[tone]} sm:text-2xl`}>{value}</div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400">{sub}</div>
    </div>
  )
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-0.5 text-lg font-bold text-slate-800 dark:text-slate-100">{value}</div>
      {sub && <div className="text-xs text-slate-500 dark:text-slate-400">{sub}</div>}
    </div>
  )
}

function Row({ name, cost, note, highlight }: { name: string; cost: string; note: string; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'bg-brand-50/60 dark:bg-brand-900/20' : ''}>
      <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">
        <span className="inline-flex items-center gap-2">
          {name}
          {highlight && <Pill tone="brand">Best value</Pill>}
        </span>
      </td>
      <td className="p-3 text-right font-bold text-slate-800 dark:text-slate-100">{cost}</td>
      <td className="p-3 text-right text-xs text-slate-500 dark:text-slate-400">{note}</td>
    </tr>
  )
}

function HowWeCalculated({ r, fuelType }: { r: Results; fuelType: 'petrol' | 'diesel' }) {
  const [open, setOpen] = useState(false)
  return (
    <Card>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between">
        <span className="font-display text-base font-bold text-slate-900 dark:text-slate-50">How we calculated this</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p><strong>Total load:</strong> We add up the running wattage of every appliance you ticked, then add a 25% safety margin so the generator can handle motor surges (fridges, freezers, pumps and ACs draw 2–3× their normal power for a split second when they start).</p>
          <p><strong>Generator size (kVA):</strong> Running watts × 1.25 ÷ 0.8 power factor, rounded up to a standard Nigerian size (1, 1.5, 2, 2.5, 3, 5, 6, 8, 10… kVA).</p>
          <p><strong>Fuel cost:</strong> We subtract the hours NEPA supplies power, then apply a realistic {fuelType === 'petrol' ? '0.85 L/kWh (petrol gens run inefficient at low load)' : '0.32 L/kWh (diesel gens are more efficient)'} and your fuel price per litre.</p>
          <p><strong>Solar:</strong> Battery sized to cover your backup hours at 85% usable depth and system losses of ~23%. Panels sized to recharge that energy using the real peak-sun-hours for your state. Costs use 2026 Nigerian prices: panels ~₦850/W, lithium battery ~₦320,000/kWh, inverter ~₦95,000/kVA, plus 18% for wiring and installation.</p>
          <p><strong>Savings & payback:</strong> Hybrid assumes solar covers most daytime use and the generator only tops up the gap. Monthly savings = generator-only fuel − hybrid fuel. Payback = solar install cost ÷ monthly savings.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">These are estimates to guide your buying decision. Always confirm with a qualified technician before you pay for equipment.</p>
        </div>
      )}
    </Card>
  )
}
