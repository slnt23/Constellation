/** 特性管理请求/响应模型 — FeatureDTO（FeatureVO 字段相同） */
export interface FeatureDTO {
  /** 主键，新增不传，修改必传 */
  id?: number
  /** 图标标识 */
  icon: string
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 排序，值越小越靠前 */
  sortOrder: number
}
