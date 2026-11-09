// Inline SVG icons (no external icon dependency).
import { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
})

export const Sun = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
export const Moon = (p: P) => <svg {...base(p)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
export const Plus = (p: P) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
export const Minus = (p: P) => <svg {...base(p)}><path d="M5 12h14" /></svg>
export const ChevronDown = (p: P) => <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
export const Trash2 = (p: P) => <svg {...base(p)}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-9 0v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6" /></svg>
export const Bolt = (p: P) => <svg {...base(p)}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
export const Battery = (p: P) => <svg {...base(p)}><rect x="2" y="7" width="18" height="10" rx="2" /><path d="M22 11v2" /><path d="M6 10v4M10 10v4M14 10v4" /></svg>
export const Fuel = (p: P) => <svg {...base(p)}><path d="M3 22V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v18" /><path d="M3 14h10" /><path d="M13 8l3 3v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9l-3-3" /></svg>
export const Wallet = (p: P) => <svg {...base(p)}><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" /><path d="M16 12h.01" /></svg>
export const Clock = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
export const Share = (p: P) => <svg {...base(p)}><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><path d="M16 6l-4-4-4 4" /><path d="M12 2v14" /></svg>
export const Copy = (p: P) => <svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
export const Check = (p: P) => <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
export const Refresh = (p: P) => <svg {...base(p)}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
export const MapPin = (p: P) => <svg {...base(p)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
export const Sparkles = (p: P) => <svg {...base(p)}><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" /></svg>
