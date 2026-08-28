/** 焦点项目管理请求模型 — SpotlightDTO */
export interface SpotlightDTO {
  /** 主键，新增不传，修改必传 */
  id?: number
  /** 眉题，最大 50 字符 */
  eyebrow: string
  /** 主标题，最大 100 字符 */
  title: string
  /** 描述，最大 500 字符 */
  description?: string
  /** 图片文件，新增必传（multipart 字段 image） */
  image?: File
  /** 排序，0-9999 */
  sortOrder: number
  /** 跳转链接，最大 255 字符 */
  link?: string
  /** 打开方式，如 _blank */
  target?: string
}

/** 新增焦点项目请求模型 — multipart/form-data，image 必传 */
export type SpotlightCreateDTO = Omit<SpotlightDTO, 'id' | 'image'> & { image: File }

/** 更新焦点项目请求模型 — multipart/form-data，字段与新增一致 */
export type SpotlightUpdateDTO = SpotlightCreateDTO
