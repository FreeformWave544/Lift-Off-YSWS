import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './'
//   build: {
//         rollupOptions: {
//             input: {
//                 index: resolve(import.meta.dirname, 'index.html'),
//                 main: resolve(import.meta.dirname, 'main.html'),
//             }
//         }
//     }
})
