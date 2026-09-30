import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { isAuthenticated, getCurrentUser, } from '@/core/permission'
import adminRoutes from './modules/admin.routes.js'
import frontRoutes from './modules/front.routes.js'

// export const authState = globalAuthState

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [...frontRoutes, ...adminRoutes],
  // 滚动行为：保存位置、锚点或回到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

// 全局前置守卫 - 路由权限控制
router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta?.requiresAdmin)
  const publicOnly = to.matched.some(record => record.meta?.publicOnly)
  // 获取当前认证状态和用户信息
  const authenticated = isAuthenticated()
  const currentUser = getCurrentUser()
  const isAdmin = currentUser?.role?.toUpperCase() === 'ADMIN'

  // 0. 管理员已登录，访问前端页面（包括首页）→ 强制跳转管理员界面
  if (authenticated && isAdmin && to.path !== '/admin' && !to.path.startsWith('/admin/')) {
    return { name: 'admin-home-dashboard' }
  }

  // 1. 仅限未登录用户访问的页面，但用户已登录 → 自动跳转默认页面
  if (publicOnly && authenticated) {
    return {
      name: isAdmin ? 'admin-home-dashboard' : 'front-profile'
    }
  }

  // 2. 需要认证但未登录 → 跳转登录弹窗
  if (requiresAuth && !authenticated) {
    ElMessage.warning({
      message: '请先登录以访问此页面',
      duration: 3000
    })
    return false
  }

  // 3. 需要管理员权限但不是管理员 → 跳转个人中心
  if (requiresAdmin && !isAdmin) {
    return { name: 'front-profile' }
  }

  // 4. 所有检查通过，允许访问
  return true
})

export default router