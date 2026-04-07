import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
      port: 5180,
      origin: "http://localhost:8080",
      open: "http://localhost:8080",
  },
  build: {
          manifest: true,
          sourcemap:
              process.env.NODE_ENV == "prod" ||
              process.env.NODE_ENV == "production"
                  ? false
                  : "inline",
  
          outDir: "../api/public",
      },
})
