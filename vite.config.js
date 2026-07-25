import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// `base` controls the path the site is served from.
//  - Local dev + user/organization Pages (yourname.github.io): keep '/'
//  - Project Pages (yourname.github.io/my_website/): set to '/my_website/'
// The GitHub Actions workflow sets VITE_BASE automatically to your repo name.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
