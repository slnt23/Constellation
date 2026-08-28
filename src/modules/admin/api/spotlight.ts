import request from '@/core/api/request'
import type { SpotlightCreateDTO, SpotlightUpdateDTO } from '@/modules/admin/types'
import type { PageResult, Result, SpotlightItem } from '@/shared/types'

const SPOTLIGHT_BASE_URL = '/admin/spotlight'

/** 焦点项目管理（后台公开接口） */
export const spotlightApi = {
  /** 获取全部焦点项目（按 sortOrder 升序） — GET /admin/spotlight */
  list(): Promise<Result<SpotlightItem[]>> {
    return request.get(SPOTLIGHT_BASE_URL)
  },

  /** 分页获取全部焦点项目 — GET /admin/spotlight/page */
  page(pageNum = 1, pageSize = 10): Promise<Result<PageResult<SpotlightItem>>> {
    return request.get(`${SPOTLIGHT_BASE_URL}/page`, { params: { pageNum, pageSize } })
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
   * 使用 multipart/form-data，image 字段为图片文件
   */
  update(id: number, data: SpotlightUpdateDTO): Promise<Result<null>> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob)
      }
    })
    return request.put(`${SPOTLIGHT_BASE_URL}/${id}`, formData)
  },

  /** 删除焦点项目 — DELETE /admin/spotlight/{id} */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`${SPOTLIGHT_BASE_URL}/${id}`)
  },
}
