// Nigeria-specific defaults, appliance library, fuel & solar economics.
// Values are realistic 2026 Nigerian averages; all editable by the user.

export type Appliance = {
  id: string
  name: string
  watts: number
  qty: number
  hoursPerDay: number
}

export type FuelType = 'petrol' | 'diesel'

export type Inputs = {
  appliances: Appliance[]
  backupHours: number
  monthlyBill: number
  discoHours: number
  fuelType: FuelType
  fuelPrice: number
  roofM2: number
  budgetNaira: number
  location: string
}

export const STATES: Record<string, number> = {
  // peak sun hours/day (PSH) — average yearly
  'Abuja (FCT)': 5.4,
  Lagos: 4.6,
  'Rivers (PH)': 4.4,
  Kano: 6.2,
  Kaduna: 6.4,
  Ibadan: 4.9,
  Enugu: 5.0,
  Benin: 4.6,
  Jos: 5.8,
  Maiduguri: 6.6,
  Sokoto: 6.8,
  Calabar: 4.3,
  Warri: 4.5,
  Abeokuta: 4.8,
  Ilorin: 5.3,
  Osogbo: 5.2,
  Akure: 4.9,
  Lokoja: 5.4,
  Minna: 5.7,
  Bauchi: 6.3,
}

export const DEFAULT_LOCATION = 'Lagos'

// The items most Nigerian homes actually own — shown first as one-tap steppers.
export const COMMON_IDS = ['fridge', 'fan', 'tv', 'bulb', 'phone', 'laptop', 'decoder', 'pump']

// Common Nigerian household appliances with realistic running wattage.
// Common items come first (matching COMMON_IDS order) with sensible default qty.
export const DEFAULT_APPLIANCES: Appliance[] = [
  { id: 'fridge', name: 'Fridge', watts: 150, qty: 1, hoursPerDay: 24 },
  { id: 'fan', name: 'Fan (standing/ceiling)', watts: 75, qty: 2, hoursPerDay: 10 },
  { id: 'tv', name: 'TV (LED 32-43")', watts: 70, qty: 1, hoursPerDay: 6 },
  { id: 'bulb', name: 'LED bulb (9W)', watts: 9, qty: 6, hoursPerDay: 6 },
  { id: 'phone', name: 'Phone charger', watts: 15, qty: 3, hoursPerDay: 3 },
  { id: 'laptop', name: 'Laptop', watts: 65, qty: 1, hoursPerDay: 4 },
  { id: 'decoder', name: 'DSTV/Gotv decoder', watts: 25, qty: 1, hoursPerDay: 6 },
  { id: 'pump', name: 'Water pump (0.5HP)', watts: 370, qty: 1, hoursPerDay: 1 },
  { id: 'freezer', name: 'Deep freezer', watts: 200, qty: 0, hoursPerDay: 24 },
  { id: 'ac1', name: 'AC 1HP', watts: 1100, qty: 0, hoursPerDay: 8 },
  { id: 'ac15', name: 'AC 1.5HP', watts: 1700, qty: 0, hoursPerDay: 8 },
  { id: 'iron', name: 'Iron', watts: 1200, qty: 0, hoursPerDay: 0.5 },
  { id: 'microwave', name: 'Microwave', watts: 1000, qty: 0, hoursPerDay: 0.3 },
  { id: 'washing', name: 'Washing machine', watts: 500, qty: 0, hoursPerDay: 0.5 },
]

export const APPLIANCE_LIBRARY: Omit<Appliance, 'qty'>[] = [
  { id: 'fridge', name: 'Fridge', watts: 150, hoursPerDay: 24 },
  { id: 'freezer', name: 'Deep freezer', watts: 200, hoursPerDay: 24 },
  { id: 'fan', name: 'Fan (standing/ceiling)', watts: 75, hoursPerDay: 10 },
  { id: 'tv', name: 'TV (LED 32-43")', watts: 70, hoursPerDay: 6 },
  { id: 'tv55', name: 'TV (LED 50-55")', watts: 120, hoursPerDay: 6 },
  { id: 'bulb', name: 'LED bulb (9W)', watts: 9, hoursPerDay: 6 },
  { id: 'bulb12', name: 'LED bulb (12W)', watts: 12, hoursPerDay: 6 },
  { id: 'phone', name: 'Phone charger', watts: 15, hoursPerDay: 3 },
  { id: 'laptop', name: 'Laptop', watts: 65, hoursPerDay: 4 },
  { id: 'decoder', name: 'DSTV/Gotv decoder', watts: 25, hoursPerDay: 6 },
  { id: 'router', name: 'WiFi router', watts: 12, hoursPerDay: 24 },
  { id: 'pump', name: 'Water pump (0.5HP)', watts: 370, hoursPerDay: 1 },
  { id: 'pump1', name: 'Water pump (1HP)', watts: 750, hoursPerDay: 1 },
  { id: 'ac1', name: 'AC 1HP', watts: 1100, hoursPerDay: 8 },
  { id: 'ac15', name: 'AC 1.5HP', watts: 1700, hoursPerDay: 8 },
  { id: 'ac2', name: 'AC 2HP', watts: 2300, hoursPerDay: 8 },
  { id: 'iron', name: 'Iron', watts: 1200, hoursPerDay: 0.5 },
  { id: 'microwave', name: 'Microwave', watts: 1000, hoursPerDay: 0.3 },
  { id: 'washing', name: 'Washing machine', watts: 500, hoursPerDay: 0.5 },
  { id: 'blender', name: 'Blender', watts: 400, hoursPerDay: 0.2 },
]

// 2026 realistic Nigerian averages (editable in UI).
export const DEFAULT_FUEL_PRICE_PETROL = 1100 // ₦/litre
export const DEFAULT_FUEL_PRICE_DIESEL = 1350 // ₦/litre

// Generator: litres of fuel per kWh produced (real-world, includes idle/inefficiency).
export const FUEL_LITRE_PER_KWH: Record<FuelType, number> = {
  petrol: 0.85, // small "I pass my neighbour" + mid petrol gens
  diesel: 0.32, // diesel gens are more efficient per kWh
}

// Typical gen power factor and safety margin.
export const GEN_POWER_FACTOR = 0.8
export const GEN_SAFETY_MARGIN = 1.25 // 25% headroom for surges (fridge/freezer/pump)

// Solar economics (₦, 2026 NG).
export const SOLAR_PER_Watt = 850 // panel + mounting per Watt of panel
export const BATTERY_PER_KWH = 320000 // lithium (LiFePO4) per kWh
export const INVERTER_PER_KVA = 95000 // pure-sine inverter per kVA
export const INSTALL_BALANCE = 0.18 // 18% of equipment cost for wiring, breakers, install

// Battery depth of discharge and system losses.
export const BATTERY_DOD = 0.85
export const SYSTEM_LOSS = 0.77 // dirt, heat, wiring, controller, inverter
export const BATTERY_ROUNDTRIP = 0.92

// NEPA/Disco tariff blended average ₦/kWh (Band E-ish realistic 2026).
export const DISCO_TARIFF = 95

export const DEFAULT_INPUTS: Inputs = {
  appliances: DEFAULT_APPLIANCES,
  backupHours: 8,
  monthlyBill: 15000,
  discoHours: 6,
  fuelType: 'petrol',
  fuelPrice: DEFAULT_FUEL_PRICE_PETROL,
  roofM2: 0,
  budgetNaira: 0,
  location: DEFAULT_LOCATION,
}

export function pshFor(location: string): number {
  return STATES[location] ?? 5.0
}
