import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project sites are served from /<repo-name>/, so the base
  // must match the repo name in production. Local dev keeps root "/".
  base: process.env.GITHUB_PAGES ? '/fabrica-de-postres-preview/' : '/',
  plugins: [react(), tailwindcss()],
})
