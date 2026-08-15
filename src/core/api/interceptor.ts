import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { AUTH_CHANGE_EVENT, AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY } from '@/shared/constants'

/** 后端业务码中表示登录态失效的集合 */
const UNAUTH_CODES = new Set([401, 401001, 401002, 401003, 401004])

/** 结构化接口错误，保留后端 code/message 与 HTTP status */
export class ApiError extends Error {
  code?: number
  data?: unknown
  status?: number

  constructor(payload: { code?: number; message?: string; data?: unknown; status?: number }) {
    super(payload.message || '请求失败')
    this.name = 'ApiError'
    this.code = payload.code
    this.data = payload.data
    this.status = payload.status
  }
}

function clearAuthState() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }))
}

function isAuthError(error: ApiError): boolean {
  return error.status === 401 || (error.code !== undefined && UNAUTH_CODES.has(error.code))
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (axios.isAxiosError(error)) {
    const body = error.response?.data
    return new ApiError({
      code: typeof body?.code === 'number' ? body.code : undefined,
      message: body?.message || error.message,
      data: body?.data,
      status: error.response?.status,
    })
  }
  if (error instanceof Error) return new ApiError({ message: error.message })
  return new ApiError({ message: '请求失败' })
}

export function registerInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(
    (response) => {
      const res = response.data

      // 后端成功码包含 200（操作成功）与 201（创建成功）
      if (res?.code !== 200 && res?.code !== 201) {
        const apiError = new ApiError({
          code: res?.code,
          message: res?.message,
          data: res?.data,
        })
        if (isAuthError(apiError)) clearAuthState()
        return Promise.reject(apiError)
      }

      return res
    },
    (error) => {
      const apiError = toApiError(error)
      if (isAuthError(apiError)) clearAuthState()
      return Promise.reject(apiError)
    },
  )
}
