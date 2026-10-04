/**
 * 菜单项新增/更新请求模型 — multipart/form-data 提交。
 *
 * image 在新增时必传；更新时不传（undefined）表示保留原配图。
 */
export interface MenuItemDTO {
  /** 主键，新增不传，修改必传 */
  id?: number
  /** 菜单标题，最大 100 字符 */
  title: string
  /** 菜单副标题，最大 200 字符 */
  subtitle?: string
  /** 跳转的前端路由，建议从 FRONT_ROUTE_OPTIONS 选择 */
  path: string
  /** 配图文件，新增必传，更新可省略 */
  image?: File
  /** 卡片尺寸：large/normal/small */
  cardSize?: 'large' | 'normal' | 'small'
  /** 排序，数值越小越靠前 */
  sortOrder?: number
  /** 状态：1=启用，0=禁用 */
  status?: number
  /** 备注，最大 500 字符 */
  remark?: string
}
