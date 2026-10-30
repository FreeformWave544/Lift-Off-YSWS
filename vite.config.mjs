import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
        rollupOptions: {
            input: {
                index: resolve(import.meta.dirname, 'index.html'),
                main: resolve(import.meta.dirname, 'pages/main.html'),
                about: resolve(import.meta.dirname, 'pages/about.html'),
                navbar: resolve(import.meta.dirname, 'components/navbar.html'),
                signup: resolve(import.meta.dirname, 'pages/signup.html'),
            }
        }
    }
})
