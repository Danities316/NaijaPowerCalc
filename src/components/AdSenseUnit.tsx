import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[]
  }
}

let adsenseScriptPromise: Promise<void> | undefined

function loadAdsenseScript(publisherId: string): Promise<void> {
  if (adsenseScriptPromise) return adsenseScriptPromise

  adsenseScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.crossOrigin = 'anonymous'
    script.dataset.npcAdsense = 'true'
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`
    script.onload = () => resolve()
    script.onerror = () => {
      adsenseScriptPromise = undefined
      reject(new Error('Failed to load the Google AdSense script'))
    }
    document.head.appendChild(script)
  })

  return adsenseScriptPromise
}

export function AdSenseUnit({ slot }: { slot: string | undefined }) {
  const adRef = useRef<HTMLModElement>(null)
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID

  useEffect(() => {
    if (!publisherId || !/^ca-pub-\d{16}$/.test(publisherId) || !slot || !/^\d+$/.test(slot)) return

    let active = true
    loadAdsenseScript(publisherId)
      .then(() => {
        const ad = adRef.current
        if (!active || !ad || ad.dataset.adsenseRequested === 'true') return

        window.adsbygoogle = window.adsbygoogle || []
        ad.dataset.adsenseRequested = 'true'
        window.adsbygoogle.push({})
      })
      .catch((error: unknown) => {
        console.error('AdSense ad could not be initialized.', error)
      })

    return () => {
      active = false
    }
  }, [publisherId, slot])

  if (!publisherId || !/^ca-pub-\d{16}$/.test(publisherId) || !slot || !/^\d+$/.test(slot)) return null

  return (
    <section className="my-6" aria-label="Advertisement">
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Advertisement
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle block min-h-[100px] w-full overflow-hidden"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  )
}
