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
  // React Three Fiber ships its own reconciler; dedupe React so only one
  // copy is loaded (otherwise: "Invalid hook call / multiple copies of React").
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@react-three/fiber', 'three'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
