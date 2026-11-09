// Build a shareable URL encoding the current inputs, and a WhatsApp share text.
import { Inputs } from './constants'
import { Results, formatNaira, formatNairaRange } from './calc'

export function encodeInputs(input: Inputs): string {
  const slim = {
    a: input.appliances.filter((x) => x.qty > 0).map((x) => [x.id, x.qty, x.watts, x.hoursPerDay]),
    b: input.backupHours,
    d: input.discoHours,
    f: input.fuelType === 'diesel' ? 1 : 0,
    p: input.fuelPrice,
    l: input.location,
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(slim))))
}

export function decodeInputs(s: string, base: Inputs): Inputs | null {
  try {
    const o = JSON.parse(decodeURIComponent(escape(atob(s))))
    return {
      ...base,
      appliances: Array.isArray(o.a)
        ? o.a.map(([id, qty, watts, hoursPerDay]: string[]) => ({ id, name: id, qty, watts, hoursPerDay } as any))
        : base.appliances,
      backupHours: o.b ?? base.backupHours,
      discoHours: o.d ?? base.discoHours,
      fuelType: o.f ? 'diesel' : 'petrol',
      fuelPrice: o.p ?? base.fuelPrice,
      location: o.l ?? base.location,
    }
  } catch {
    return null
  }
}

export function shareText(r: Results, fuelType: 'petrol' | 'diesel'): string {
  const lines = [
    'My NaijaPowerCalc result:',
    `Generator: ${r.genKVARounded} kVA`,
    `Solar: ${r.solarKW} kW panels + ${r.batteryKWh} kWh battery`,
    `Solar cost: ${formatNairaRange(r.solarCostLow, r.solarCostHigh)}`,
    `Gen-only fuel: ${formatNaira(r.genMonthlyCost)}/mo (${fuelType})`,
    `Hybrid monthly: ${formatNaira(r.hybridMonthlyCost)}/mo`,
    `Monthly savings: ${formatNaira(r.monthlySavings)}`,
    `Payback: ${Number.isFinite(r.paybackMonths) ? r.paybackMonths + ' months' : 'fast'}`,
  ]
  return lines.join('\n')
}

export function shareUrl(payload: string): string {
  const u = new URL(window.location.href)
  u.search = `?s=${payload}`
  return u.toString()
}
