// spotlight.api.ts

import request from '../request'
import type { FeatureDTO, FeatureItem, Result, SpotlightCreateDTO, SpotlightItem, SpotlightUpdateDTO } from '@/types'

const FEATURE_BASE_URL = '/admin/feature'
const SPOTLIGHT_BASE_URL = '/admin/spotlight'

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
