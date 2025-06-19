import { defineConfig } from 'vitest/config'; 
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {       
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__test__/setup.ts',
    deps: {
      inline: [/@mui\/icons-material/],
    },
  },
})
