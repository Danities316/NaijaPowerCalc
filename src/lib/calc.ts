// All power/fuel/solar/cost math for NaijaPowerCalc. Pure functions, client-side.

import {
  Inputs,
  FUEL_LITRE_PER_KWH,
  GEN_POWER_FACTOR,
  GEN_SAFETY_MARGIN,
  SOLAR_PER_Watt,
  BATTERY_PER_KWH,
  INVERTER_PER_KVA,
  INSTALL_BALANCE,
  BATTERY_DOD,
  SYSTEM_LOSS,
  BATTERY_ROUNDTRIP,
  DISCO_TARIFF,
  pshFor,
} from './constants'

export type Results = {
  totalLoadW: number
  peakLoadW: number
  dailyKWh: number
  genKVA: number
  genKVARounded: number
  // Generator-only
  genDailyLitres: number
  genDailyCost: number
  genMonthlyCost: number
  // Solar
  solarKW: number
  batteryKWh: number
  inverterKVA: number
  solarCostLow: number
  solarCostHigh: number
  // Hybrid
  hybridMonthlyCost: number
  hybridMonthlyLitres: number
  // Comparison
  monthlySavings: number
  paybackMonths: number
  // Run-times for the chosen generator
  runtime: { loadPct: number; label: string; hours: number }[]
  // Disco
  discoMonthlyCost: number
  discoMonthlyKWh: number
  // Plain-language + gentle warnings
  summary: string
  warnings: { tone: 'green' | 'orange'; text: string }[]
}

const round = (n: number, d = 0) => {
  const f = Math.pow(10, d)
  return Math.round(n * f) / f
}

export function calculate(input: Inputs): Results {
  const appliances = input.appliances.filter((a) => a.qty > 0 && a.watts > 0)

  // Running load (sum of watts * qty). Peak uses surge factor on motor loads.
  const SURGE = 2.5
  const motorIds = ['fridge', 'freezer', 'ac1', 'ac15', 'ac2', 'pump', 'pump1', 'iron', 'microwave', 'washing', 'blender']

  const totalLoadW = appliances.reduce((s, a) => s + a.watts * a.qty, 0)
  const peakLoadW = appliances.reduce((s, a) => {
    const w = a.watts * a.qty
    const surge = motorIds.includes(a.id) ? SURGE : 1
    return s + w * surge
  }, 0)

  const dailyKWh = appliances.reduce(
    (s, a) => s + (a.watts * a.qty * a.hoursPerDay) / 1000,
    0,
  )

  // Generator size from peak running load with safety margin.
  const genKVA = (totalLoadW * GEN_SAFETY_MARGIN) / (1000 * GEN_POWER_FACTOR)
  const genKVARounded = roundUpKVA(genKVA)

  // Fuel: petrol/diesel small gens burn more per kWh at partial load.
  // Use a part-load penalty when running well below rated capacity.
  const litrePerKWh = FUEL_LITRE_PER_KWH[input.fuelType]
  // Energy the generator must supply = dailyKWh minus what NEPA supplies.
  const discoDailyKWh = (input.discoHours / 24) * dailyKWh
  const genDailyKWh = Math.max(0, dailyKWh - discoDailyKWh)
  const partLoad = genDailyKWh > 0 && genDailyKWh * 1000 < totalLoadW * 0.4 ? 1.25 : 1.0
  const genDailyLitres = genDailyKWh * litrePerKWh * partLoad
  const genDailyCost = genDailyLitres * input.fuelPrice
  const genMonthlyCost = genDailyCost * 30

  // Solar sizing — designed to cover the backup hours need.
  // Battery must supply backupHours share of daily energy.
  const backupShare = Math.min(1, input.backupHours / 24)
  const batteryNeedKWh = (dailyKWh * backupShare) / (BATTERY_DOD * BATTERY_ROUNDTRIP)
  const psh = pshFor(input.location)
  // Panels must recharge the daily energy used during backup, within PSH.
  const solarKW = (dailyKWh * backupShare) / (psh * SYSTEM_LOSS)
  // Inverter must handle peak running load.
  const inverterKVA = (totalLoadW * 1.15) / (1000 * GEN_POWER_FACTOR)

  const panelCost = solarKW * 1000 * SOLAR_PER_Watt
  const battCost = batteryNeedKWh * BATTERY_PER_KWH
  const invCost = inverterKVA * INVERTER_PER_KVA
  const equip = panelCost + battCost + invCost
  const balance = equip * INSTALL_BALANCE
  const solarTotal = equip + balance
  const solarCostLow = round(solarTotal * 0.9)
  const solarCostHigh = round(solarTotal * 1.15)

  // Hybrid: solar covers daytime, gen covers shortfall during backup window.
  // Assume solar offsets ~70% of the gen energy if battery sized for backup.
  const solarOffset = Math.min(genDailyKWh, solarKW * psh * SYSTEM_LOSS * 0.8)
  const hybridDailyKWh = Math.max(0, genDailyKWh - solarOffset)
  const hybridDailyLitres = hybridDailyKWh * litrePerKWh
  const hybridMonthlyLitres = hybridDailyLitres * 30
  const hybridMonthlyCost = hybridDailyLitres * input.fuelPrice * 30

  const monthlySavings = Math.max(0, genMonthlyCost - hybridMonthlyCost)
  const paybackMonths = monthlySavings > 0 ? solarTotal / monthlySavings : Infinity

  // Run-time of the chosen generator on a full tank (assume tank litres ≈ kVA * 4).
  const tankLitres = Math.max(4, genKVARounded * 4)
  const ratedKWh = genKVARounded * GEN_POWER_FACTOR
  const runtime = [25, 50, 75, 100].map((pct) => {
    const loadW = (ratedKWh * 1000 * pct) / 100
    const litresPerHour = (loadW / 1000) * litrePerKWh * (pct < 40 ? 1.25 : 1.0)
    const hours = litresPerHour > 0 ? tankLitres / litresPerHour : 0
    return { loadPct: pct, label: `${pct}% load`, hours: round(hours, 1) }
  })

  const discoMonthlyKWh = discoDailyKWh * 30
  const discoMonthlyCost = discoMonthlyKWh * DISCO_TARIFF

  const base = {
    totalLoadW: round(totalLoadW),
    peakLoadW: round(peakLoadW),
    dailyKWh: round(dailyKWh, 2),
    genKVA: round(genKVA, 2),
    genKVARounded,
    genDailyLitres: round(genDailyLitres, 2),
    genDailyCost: round(genDailyCost),
    genMonthlyCost: round(genMonthlyCost),
    solarKW: round(solarKW, 2),
    batteryKWh: round(batteryNeedKWh, 2),
    inverterKVA: round(inverterKVA, 2),
    solarCostLow,
    solarCostHigh,
    hybridMonthlyCost: round(hybridMonthlyCost),
    hybridMonthlyLitres: round(hybridMonthlyLitres, 1),
    monthlySavings: round(monthlySavings),
    paybackMonths: Number.isFinite(paybackMonths) ? round(paybackMonths, 1) : Infinity,
    runtime,
    discoMonthlyCost: round(discoMonthlyCost),
    discoMonthlyKWh: round(discoMonthlyKWh, 1),
  }

  return {
    ...base,
    summary: buildSummary(base, input),
    warnings: buildWarnings(base, input, appliances),
  }
}

function buildSummary(r: Pick<Results, 'genKVARounded' | 'genMonthlyCost' | 'hybridMonthlyCost' | 'monthlySavings' | 'paybackMonths'>, input: Inputs): string {
  const hasAc = input.appliances.some((a) => a.id.startsWith('ac') && a.qty > 0)
  const genPart = `A ${r.genKVARounded} kVA generator will carry your house without stress${hasAc ? ' when the AC is on' : ''}.`
  if (r.monthlySavings <= 0) {
    return `${genPart} Right now solar won't save you much — your fuel use is low, so just stick with the generator.`
  }
  const payback = Number.isFinite(r.paybackMonths) ? `The solar setup pays for itself in about ${Math.round(r.paybackMonths)} months` : 'The solar setup pays for itself quickly'
  return `${genPart} Running only a generator costs about ${formatNaira(r.genMonthlyCost)} in fuel every month. Add solar and that drops to about ${formatNaira(r.hybridMonthlyCost)} — you save ${formatNaira(r.monthlySavings)} monthly. ${payback}, after that the savings are pure gain.`
}

function buildWarnings(
  r: Pick<Results, 'totalLoadW' | 'genKVARounded' | 'monthlySavings' | 'paybackMonths'>,
  input: Inputs,
  appliances: { id: string; qty: number; watts: number; hoursPerDay: number }[],
): { tone: 'green' | 'orange'; text: string }[] {
  const w: { tone: 'green' | 'orange'; text: string }[] = []
  const activeCount = appliances.reduce((s, a) => s + a.qty, 0)

  if (activeCount === 0) {
    w.push({ tone: 'orange', text: 'No appliances selected yet. Tap + on the items you use so we can calculate your size.' })
  }
  if (r.totalLoadW > 0 && r.totalLoadW < 100) {
    w.push({ tone: 'orange', text: 'Your total load is very small. A small "I pass my neighbour" generator (1–1.5 kVA) is plenty.' })
  }
  if (r.genKVARounded >= 15) {
    w.push({ tone: 'orange', text: "That's a big generator. Check if you really run all those appliances at once — you may be able to drop a size and save fuel." })
  }
  if (input.backupHours > 16) {
    w.push({ tone: 'orange', text: 'Asking for more than 16 hours of backup means a very large (and expensive) battery. Most homes do well with 6–10 hours.' })
  }
  if (input.discoHours > 18) {
    w.push({ tone: 'orange', text: 'More than 18 hours of NEPA a day is rare in most areas. If your supply is that good, you may not need solar at all.' })
  }
  if (input.fuelPrice > 0 && input.fuelPrice < 300) {
    w.push({ tone: 'orange', text: 'That fuel price looks too low for 2026. Check the current price at your filling station.' })
  }
  if (r.totalLoadW > 100 && r.monthlySavings > 0 && Number.isFinite(r.paybackMonths) && r.paybackMonths < 24 && activeCount > 0) {
    w.push({ tone: 'green', text: 'Good news: solar makes strong sense for you — it pays back in under 2 years.' })
  }
  return w
}

// Snap to a sensible Nigerian generator size label.
const KVA_SIZES = [1, 1.5, 2, 2.5, 3, 3.5, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 40, 50]
function roundUpKVA(kva: number): number {
  for (const s of KVA_SIZES) if (s >= kva) return s
  return Math.ceil(kva)
}

export function formatNaira(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return '₦' + Math.round(n).toLocaleString('en-NG')
}

export function formatNairaRange(low: number, high: number): string {
  return `${formatNaira(low)} – ${formatNaira(high)}`
}
