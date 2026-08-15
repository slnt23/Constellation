import { defineConfig, loadEnv } from 'vite' // Vite 配置辅助函数，提供类型提示
import vue from '@vitejs/plugin-vue' // Vue 单文件组件编译插件
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' // Element Plus 组件解析器
import AutoImport from 'unplugin-auto-import/vite' // API 自动导入（ref、computed 等）
import Components from 'unplugin-vue-components/vite' // 组件按需自动注册
import { fileURLToPath, URL } from 'node:url' // 路径转换工具

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://127.0.0.1:18080'

  return {
    plugins: [
      vue(), // 编译 .vue 文件
      AutoImport({ // 自动导入 Vue API 和 Element Plus API
        resolvers: [ElementPlusResolver()],
        dts: 'src/core/config/auto-imports.d.ts',
      }),
      Components({ // 自动按需导入 Element Plus 组件
        resolvers: [ElementPlusResolver()],
        dirs: ['src/modules', 'src/shared/components'],
        dts: 'src/core/config/components.d.ts',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true, // 修改请求头 Origin 为目标地址
        },
      },
    },
  }
})
