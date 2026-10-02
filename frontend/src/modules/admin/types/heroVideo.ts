/**
 * Hero 视频新增/更新请求模型 — multipart/form-data 提交。
 *
 * video 在新增时必传；更新时不传（undefined）表示保留原视频。
 */
export interface HeroVideoDTO {
  /** 主键，新增不传，修改必传 */
  id?: number
  /** 视频标题，最大 200 字符 */
  title: string
  /** 视频文件，新增必传，更新可省略 */
  video?: File
  /** 封面图文件，可选 */
  poster?: File
  /** 排序，数值越小越靠前 */
  sortOrder?: number
  /** 状态：1=启用，0=禁用 */
  status?: number
  /** 备注，最大 500 字符 */
  remark?: string
}
