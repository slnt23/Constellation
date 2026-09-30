import request from '@/core/api/request'
import type { FeatureDTO } from '@/modules/admin/types'
import type { FeatureItem, PageResult, Result } from '@/shared/types'

const FEATURE_BASE_URL = '/admin/feature'

/** 特性管理（后台公开接口） */
export const featureApi = {
  /** 获取全部产品特性（按 sortOrder 升序） — GET /admin/feature */
  list(): Promise<Result<FeatureItem[]>> {
    return request.get(FEATURE_BASE_URL)
  },

  /** 分页获取全部产品特性 — GET /admin/feature/page */
  page(pageNum = 1, pageSize = 10): Promise<Result<PageResult<FeatureItem>>> {
    return request.get(`${FEATURE_BASE_URL}/page`, { params: { pageNum, pageSize } })
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
    return request.put(`${FEATURE_BASE_URL}/${id}`, data)
  },

  /** 删除产品特性 — DELETE /admin/feature/{id} */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`${FEATURE_BASE_URL}/${id}`)
  },
}
