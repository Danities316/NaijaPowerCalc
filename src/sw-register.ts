// Registers a tiny service worker so the app works offline after first load.
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        /* offline support is best-effort */
      })
    })
  }
}
