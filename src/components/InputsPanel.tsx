import { useState } from 'react'
import { Inputs, STATES, DEFAULT_FUEL_PRICE_PETROL, DEFAULT_FUEL_PRICE_DIESEL, FuelType } from '../lib/constants'
import { Card, NumberInput } from './ui'
import { ApplianceList } from './ApplianceList'
import { Clock, Fuel, MapPin, ChevronDown } from './icons'

export function InputsPanel({ input, onChange }: { input: Inputs; onChange: (next: Inputs) => void }) {
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => onChange({ ...input, [k]: v })
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="space-y-4">
      {/* The only required input — appliances */}
      <Card>
        <div className="mb-3">
          <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            What dey your house?
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Tap + for each thing you use. We fit handle the rest.
          </p>
        </div>
        <ApplianceList appliances={input.appliances} onChange={(a) => set('appliances', a)} />
      </Card>

      {/* Two essential questions */}
      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Labeled icon={<Clock className="h-4 w-4" />} label="How many hours of light you need every night?">
            <NumberInput value={input.backupHours} onChange={(v) => set('backupHours', v)} min={1} max={24} step={1} suffix="hrs" ariaLabel="Backup hours per night" />
          </Labeled>
          <Labeled icon={<MapPin className="h-4 w-4" />} label="Where you dey? (for sun strength)">
            <select
              value={input.location}
              onChange={(e) => set('location', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-semibold text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
            >
              {Object.keys(STATES).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Labeled>
        </div>
      </Card>

      {/* Collapsible settings */}
      <button
        onClick={() => setShowMore((v) => !v)}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        {showMore ? 'Hide settings' : 'Adjust fuel price, NEPA hours & more'}
        <ChevronDown className={`h-4 w-4 transition ${showMore ? 'rotate-180' : ''}`} />
      </button>

      {showMore && (
        <Card>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Labeled icon={<Fuel className="h-4 w-4" />} label="Fuel type">
              <div className="flex gap-2">
                {(['petrol', 'diesel'] as FuelType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => onChange({ ...input, fuelType: f, fuelPrice: f === 'petrol' ? DEFAULT_FUEL_PRICE_PETROL : DEFAULT_FUEL_PRICE_DIESEL })}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize transition ${
                      input.fuelType === f
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                        : 'border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Labeled>
            <Labeled icon={<Fuel className="h-4 w-4" />} label="Fuel price per litre">
              <NumberInput value={input.fuelPrice} onChange={(v) => set('fuelPrice', v)} min={0} step={50} suffix="₦/L" ariaLabel="Fuel price per litre" />
            </Labeled>
            <Labeled icon={<Clock className="h-4 w-4" />} label="Average NEPA/Disco hours per day">
              <NumberInput value={input.discoHours} onChange={(v) => set('discoHours', v)} min={0} max={24} step={1} suffix="hrs" ariaLabel="Disco hours per day" />
            </Labeled>
            <Labeled label="Current monthly electricity bill (optional)">
              <NumberInput value={input.monthlyBill} onChange={(v) => set('monthlyBill', v)} min={0} step={1000} suffix="₦" ariaLabel="Monthly bill" />
            </Labeled>
          </div>
        </Card>
      )}
    </div>
  )
}

function Labeled({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {icon}{label}
      </span>
      {children}
    </label>
  )
}
