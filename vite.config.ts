import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * Two build modes from one config:
 *   `vite build`            → the docs gallery (a normal SPA)
 *   `vite build --mode lib` → the distributable kit (ESM + one stylesheet)
 * React stays external in library mode so consumers keep a single copy.
 */
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // The package's exports map promises ./dist/index.d.ts — emit it in lib mode.
    ...(mode === 'lib'
      ? [dts({ entryRoot: 'src', include: ['src'], insertTypesEntry: true, outDir: 'dist' })]
      : []),
  ],
  // The hosted gallery lives at nim.zone/uikit, so its asset URLs use that
  // public prefix. The standalone build itself remains inside this repository.
  base: mode === 'lib' ? '/' : '/uikit/',
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      nim: resolve(import.meta.dirname, 'src/index.ts'),
    },
  },
  build:
    mode === 'lib'
      ? {
          lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            name: 'nim',
            fileName: () => 'nim.js',
            formats: ['es'],
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
            output: { assetFileNames: 'nim[extname]' },
          },
        }
      : { outDir: 'dist-docs', emptyOutDir: true },
}))
