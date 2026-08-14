import request from '../request'
import type {
  PriceLatestVO,
  PriceTrendVO,
  PriceCompareVO,
  SourceCompareVO,
  PriceLatestQueryDTO,
  PriceTrendQueryDTO,
  PriceCompareLocationDTO,
  PriceCompareSourceDTO,
  ItemIntroDTO,
  PriceItemVO,
} from '@/types/modules/price.type'
import type { PageResult, Result } from '@/types'

const PRICE_BASE_URL = '/price'

/** 价格查询接口 */
export const priceApi = {
  /** 查询最新价格 — POST /price/latest */
  getLatest(data: PriceLatestQueryDTO): Promise<Result<PriceLatestVO>> {
    return request.post(`${PRICE_BASE_URL}/latest`, data)
  },

  /** 查询价格趋势 — POST /price/trend */
  getTrend(data: PriceTrendQueryDTO): Promise<Result<PriceTrendVO[]>> {
    return request.post(`${PRICE_BASE_URL}/trend`, data)
  },

  /** 多地区价格对比 — POST /price/compare/location */
  compareLocation(data: PriceCompareLocationDTO): Promise<Result<PriceCompareVO>> {
    return request.post(`${PRICE_BASE_URL}/compare/location`, data)
  },

  /** 多来源价格对比 — POST /price/compare/source */
  compareSource(data: PriceCompareSourceDTO): Promise<Result<SourceCompareVO[]>> {
    return request.post(`${PRICE_BASE_URL}/compare/source`, data)
  },
}

/** 价格中心物品接口 */
export const itemApi = {
  /** 物品分页查询（按名称模糊匹配） — POST /item/page */
  searchItems(data: ItemIntroDTO): Promise<Result<PageResult<PriceItemVO>>> {
    return request.post('/item/page', data)
  },

  /** 删除物品 — DELETE /item/{id}（后端当前为空实现） */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`/item/${id}`)
  },
}

/** 价格中心分类接口 */
export const categoryApi = {
  /** 获取分类树 — GET /category/tree（后端当前为空实现，返回 null） */
  getTree(): Promise<Result<null>> {
    return request.get('/category/tree')
  },

  /** 删除分类 — DELETE /category/{id}（后端当前为空实现） */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`/category/${id}`)
  },
}

/** 价格中心来源接口 */
export const sourceApi = {
  /** 删除来源 — DELETE /source/{id}（后端当前为空实现） */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`/source/${id}`)
  },
}
