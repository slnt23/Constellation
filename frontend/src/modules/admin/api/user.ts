import request from '@/core/api/request'
import type {
  AdminUserQuery,
  AdminUserStatus,
  AdminUserVO,
  UserCreateDTO,
  UserPasswordResetDTO,
  UserUpdateDTO,
} from '@/modules/admin/types'
import type { PageResult, Result } from '@/shared/types'

const ADMIN_USER_BASE_URL = '/admin/user-do'

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
