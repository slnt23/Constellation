// spotlight.api.ts

import request from '../request'
import type {
  AdminUserQuery,
  AdminUserStatus,
  AdminUserVO,
  FeatureDTO,
  FeatureItem,
  PageResult,
  Result,
  RoleCreateDTO,
  RoleUpdateDTO,
  RoleVO,
  SpotlightCreateDTO,
  SpotlightItem,
  SpotlightUpdateDTO,
  UserCreateDTO,
  UserPasswordResetDTO,
  UserUpdateDTO,
} from '@/types'

const FEATURE_BASE_URL = '/admin/feature'
const SPOTLIGHT_BASE_URL = '/admin/spotlight'
const ADMIN_USER_BASE_URL = '/admin/user-do'
const ADMIN_ROLE_BASE_URL = '/admin/role-do'

/** 焦点项目管理（后台公开接口） */
export const spotlightApi = {
  /** 获取全部焦点项目（按 sortOrder 升序） — GET /admin/spotlight */
  list(): Promise<Result<SpotlightItem[]>> {
    return request.get(SPOTLIGHT_BASE_URL)
  },

  /** 获取单个焦点项目 — GET /admin/spotlight/{id} */
  getById(id: number): Promise<Result<SpotlightItem>> {
    return request.get(`${SPOTLIGHT_BASE_URL}/${id}`)
  },

  /**
   * 新增焦点项目 — POST /admin/spotlight
   * 使用 multipart/form-data，image 字段为图片文件
   */
  create(data: SpotlightCreateDTO): Promise<Result<number>> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob)
      }
    })
    return request.post(SPOTLIGHT_BASE_URL, formData)
  },

  /**
   * 更新焦点项目 — PUT /admin/spotlight/{id}
   * 当前后端使用 JSON 接收 SpotlightDTO（已知问题：JSON 无法绑定图片文件）
   */
  update(id: number, data: SpotlightUpdateDTO): Promise<Result<null>> {
    const payload = { ...data, id }
    return request.put(`${SPOTLIGHT_BASE_URL}/${id}`, payload)
  },

  /** 删除焦点项目 — DELETE /admin/spotlight/{id} */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`${SPOTLIGHT_BASE_URL}/${id}`)
  },
}

/** 特性管理（后台公开接口） */
export const featureApi = {
  /** 获取全部产品特性（按 sortOrder 升序） — GET /admin/feature */
  list(): Promise<Result<FeatureItem[]>> {
    return request.get(FEATURE_BASE_URL)
  },

  /** 获取单个产品特性 — GET /admin/feature/{id} */
  getById(id: number): Promise<Result<FeatureItem>> {
    return request.get(`${FEATURE_BASE_URL}/${id}`)
  },

  /** 新增产品特性，返回主键 ID — POST /admin/feature */
  create(data: FeatureDTO): Promise<Result<number>> {
    return request.post(FEATURE_BASE_URL, data)
  },

  /** 更新产品特性 — PUT /admin/feature/{id} */
  update(id: number, data: FeatureDTO): Promise<Result<null>> {
    const payload = { ...data, id }
    return request.put(`${FEATURE_BASE_URL}/${id}`, payload)
  },

  /** 删除产品特性 — DELETE /admin/feature/{id} */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`${FEATURE_BASE_URL}/${id}`)
  },
}

/** 后台用户管理（要求 ROLE_ADMIN） */
export const adminUserApi = {
  /** 用户分页列表 — GET /admin/user-do */
  list(params?: AdminUserQuery): Promise<Result<PageResult<AdminUserVO>>> {
    return request.get(ADMIN_USER_BASE_URL, { params })
  },

  /** 用户详情 — GET /admin/user-do/{id} */
  getById(id: number): Promise<Result<AdminUserVO>> {
    return request.get(`${ADMIN_USER_BASE_URL}/${id}`)
  },

  /** 新增用户，返回新用户 ID — POST /admin/user-do */
  create(data: UserCreateDTO): Promise<Result<number>> {
    return request.post(ADMIN_USER_BASE_URL, data)
  },

  /** 更新用户 — PUT /admin/user-do/{id} */
  update(id: number, data: UserUpdateDTO): Promise<Result<null>> {
    return request.put(`${ADMIN_USER_BASE_URL}/${id}`, data)
  },

  /** 删除用户 — DELETE /admin/user-do/{id} */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`${ADMIN_USER_BASE_URL}/${id}`)
  },

  /** 启用/封禁用户 — PUT /admin/user-do/{id}/status */
  updateStatus(id: number, status: AdminUserStatus): Promise<Result<null>> {
    return request.put(`${ADMIN_USER_BASE_URL}/${id}/status`, null, { params: { status } })
  },

  /** 修改用户角色 — PUT /admin/user-do/{id}/role */
  updateRole(id: number, roleName: string): Promise<Result<null>> {
    return request.put(`${ADMIN_USER_BASE_URL}/${id}/role`, null, { params: { roleName } })
  },

  /** 重置用户密码 — PUT /admin/user-do/{id}/password/reset */
  resetPassword(id: number, data: UserPasswordResetDTO): Promise<Result<null>> {
    return request.put(`${ADMIN_USER_BASE_URL}/${id}/password/reset`, data)
  },
}

/** 后台角色管理（要求 ROLE_ADMIN） */
export const adminRoleApi = {
  /** 角色列表 — GET /admin/role-do */
  list(): Promise<Result<RoleVO[]>> {
    return request.get(ADMIN_ROLE_BASE_URL)
  },

  /** 角色详情 — GET /admin/role-do/{id} */
  getById(id: number): Promise<Result<RoleVO>> {
    return request.get(`${ADMIN_ROLE_BASE_URL}/${id}`)
  },

  /** 新增角色，返回新角色 ID — POST /admin/role-do */
  create(data: RoleCreateDTO): Promise<Result<number>> {
    return request.post(ADMIN_ROLE_BASE_URL, data)
  },

  /** 更新角色 — PUT /admin/role-do/{id} */
  update(id: number, data: RoleUpdateDTO): Promise<Result<null>> {
    return request.put(`${ADMIN_ROLE_BASE_URL}/${id}`, data)
  },

  /** 删除角色 — DELETE /admin/role-do/{id} */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`${ADMIN_ROLE_BASE_URL}/${id}`)
  },

  /** 启用/禁用角色 — PUT /admin/role-do/{id}/enabled */
  updateEnabled(id: number, enabled: boolean): Promise<Result<null>> {
    return request.put(`${ADMIN_ROLE_BASE_URL}/${id}/enabled`, null, { params: { enabled } })
  },
}
