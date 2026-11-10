/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADSENSE_PUBLISHER_ID?: string
  readonly VITE_ADSENSE_SLOT_RESULTS?: string
  readonly VITE_ADSENSE_SLOT_GUIDE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
