/** 后台角色视图对象 — RoleVO */
export interface RoleVO {
  /** 角色 ID */
  id: number
  /** 角色名，最大 100 字符，唯一 */
  roleName: string
  /** 角色描述 */
  description: string
  /** 是否启用 */
  enabled: boolean
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 后台新增角色请求体 — RoleCreateDTO */
export interface RoleCreateDTO {
  /** 角色名，最大 100 字符，唯一 */
  roleName: string
  /** 描述，最大 255 字符 */
  description?: string
  /** 是否启用，默认 true */
  enabled?: boolean
}

/** 后台更新角色请求体 — RoleUpdateDTO */
export interface RoleUpdateDTO {
  roleName?: string
  description?: string
  enabled?: boolean
}
