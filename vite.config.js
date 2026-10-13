import { copyFileSync, writeFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const githubPages = Boolean(process.env.GITHUB_PAGES)

export default defineConfig({
  plugins: [
    react(),
    githubPages && {
      name: 'github-pages-spa',
      closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
        writeFileSync('dist/.nojekyll', '')
      },
    },
  ].filter(Boolean),
  base: githubPages ? '/Cuarteto/' : '/',
})
