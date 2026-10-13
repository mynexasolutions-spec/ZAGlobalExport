import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    // The SSR build (used only for prerendering) doesn't need the public assets.
    copyPublicDir: !isSsrBuild,
  },
}))
