import request from '@/core/api/request'
import type {
  PriceLatestVO,
  PriceTrendVO,
  PriceCompareVO,
  SourceCompareVO,
  PriceLatestQueryDTO,
  PriceTrendQueryDTO,
  PriceCompareLocationDTO,
  PriceCompareSourceDTO,
} from '@/modules/price/types'
import type { Result } from '@/shared/types'

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
