/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<any, any, any>
  export default component
}

// Element Plus 全局类型声明
// declare global {
//   interface Window {
//     // Element Plus 消息提示
//     elMessage?: (options: {
//       message: string
//       type?: 'success' | 'warning' | 'info' | 'error'
//       duration?: number
//     }) => void
//   }
// }

// export { }
