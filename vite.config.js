import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/app/main/flow/', // 部署时的公共路径，例如放在服务器的 /static/ 目录下
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.100.44:8823/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // 静态资源目录
    rollupOptions: {
      output: {
        // 可以进一步定制资源文件名
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
})
