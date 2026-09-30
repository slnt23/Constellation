import request from '@/core/api/request'
import type { RoleCreateDTO, RoleUpdateDTO, RoleVO } from '@/modules/admin/types'
import type { Result } from '@/shared/types'

const ADMIN_ROLE_BASE_URL = '/admin/role-do'

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
