import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import postcssNesting from 'postcss-nesting'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

function loadEnvConfig () {
  const defaults = {
    devPort: 8083,
    backendUrl: 'http://localhost'
  }
  try {
    return { ...defaults, ...require('./env.js') }
  } catch {
    return defaults
  }
}

const env = loadEnvConfig()

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      src: path.resolve(__dirname, 'src'),
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      libs: path.resolve(__dirname, 'src/libs'),
      store: path.resolve(__dirname, 'src/store'),
      views: path.resolve(__dirname, 'src/views'),
      utils: path.resolve(__dirname, 'src/utils'),
      api: path.resolve(__dirname, 'src/api')
    }
  },
  css: {
    postcss: {
      plugins: [postcssNesting()]
    }
  },
  server: {
    host: true,
    port: env.devPort || 8083,
    proxy: {
      '/api': {
        target: env.backendUrl,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
