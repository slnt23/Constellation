
import type { UserInfoVO } from "@/shared/types";
import { AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY, AUTH_CHANGE_EVENT } from "@/shared/constants";
import { logoutApi } from '@/modules/user/api/auth'


/**
 * 登录鉴权工具模块 - 与后端API交互的真实认证系统
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

// 检查当前环境是否为客户端（浏览器环境）
const isClient = () => typeof window !== 'undefined'


// 检查是否已认证（是否有有效的token）
export const isAuthenticated = (): boolean => {
  const token = getToken()
  return !!token && token.length > 0
}

// 用户登出函数：通知后端失效 token，并清理本地登录态
export const logout = async (): Promise<void> => {
  try {
    await logoutApi()
  } catch {
    // 登出接口失败不阻塞本地清理
  } finally {
    if (isClient()) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
      window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }))// 触发认证状态变化事件
    }
  }
}

// 设置当前用户信息到localStorage，并触发认证状态变化事件
export const setCurrentUser = (userData: UserInfoVO): void => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: userData }))// 触发认证状态变化事件
}

// 获取当前用户信息，
export const getCurrentUser = (): UserInfoVO | null => {
  if (!isClient()) return null
  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawSession) return null
  try {
    return JSON.parse(rawSession)
  } catch {
    // 如果解析失败，清除损坏的用户数据 
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

// 注册认证状态变化监听器,用于在主页来监听认证状态变化（如登录/登出）并更新UI
export const onAuthChange = (callback: (user: UserInfoVO | null) => void): (() => void) => {
  if (!isClient() || typeof callback !== 'function') {
    return () => { } // 返回空函数
  }

  // 包装监听器：当事件触发时，读取最新的用户信息并传给回调
  const handler = () => {
    const user = getCurrentUser()
    callback(user)
  }

  window.addEventListener(AUTH_CHANGE_EVENT, handler)

  // 返回取消监听的函数
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handler)
  }
}
