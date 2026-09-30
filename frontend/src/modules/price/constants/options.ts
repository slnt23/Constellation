import type { Currency, TimeGranularity } from '@/modules/price/types'
import {
  Search,
  Coin,
  TrendCharts,
  DataAnalysis,
  Connection,
} from '@element-plus/icons-vue'

import PriceItemQuery from '@/modules/price/components/PriceItemQuery.vue'
import PriceLatest from '@/modules/price/components/PriceLatest.vue'
import PriceTrend from '@/modules/price/components/PriceTrend.vue'
import PriceRegion from '@/modules/price/components/PriceRegion.vue'
import PriceSource from '@/modules/price/components/PriceSource.vue'

export const PRICE_NAV_ITEMS = [
  { index: '0', label: '物品查询', icon: Search },
  { index: '1', label: '最新价格', icon: Coin },
  { index: '2', label: '价格趋势', icon: TrendCharts },
  { index: '3', label: '地区对比', icon: DataAnalysis },
  { index: '4', label: '来源对比', icon: Connection },
] as const

export const PRICE_TAB_COMPONENT_MAP: Record<string, any> = {
  '0': PriceItemQuery,
  '1': PriceLatest,
  '2': PriceTrend,
  '3': PriceRegion,
  '4': PriceSource,
}

export const PRICE_LOCATION_OPTIONS: { label: string; value: number }[] = [
  { label: '北京', value: 1 },
  { label: '天津', value: 2 },
  { label: '河北', value: 3 },
  { label: '山西', value: 4 },
  { label: '内蒙古', value: 5 },
  { label: '辽宁', value: 6 },
  { label: '吉林', value: 7 },
  { label: '黑龙江', value: 8 },
  { label: '上海', value: 9 },
  { label: '江苏', value: 10 },
  { label: '浙江', value: 11 },
  { label: '安徽', value: 12 },
  { label: '福建', value: 13 },
  { label: '江西', value: 14 },
  { label: '山东', value: 15 },
  { label: '河南', value: 16 },
  { label: '湖北', value: 17 },
  { label: '湖南', value: 18 },
  { label: '广东', value: 19 },
  { label: '广西', value: 20 },
  { label: '海南', value: 21 },
  { label: '重庆', value: 22 },
  { label: '四川', value: 23 },
  { label: '贵州', value: 24 },
  { label: '云南', value: 25 },
  { label: '西藏', value: 26 },
  { label: '陕西', value: 27 },
  { label: '甘肃', value: 28 },
  { label: '青海', value: 29 },
  { label: '宁夏', value: 30 },
  { label: '新疆', value: 31 },
  { label: '台湾', value: 32 },
  { label: '香港', value: 33 },
  { label: '澳门', value: 34 },
]

export const PRICE_CURRENCY_OPTIONS: { label: string; value: Currency }[] = [
  { label: '人民币 (CNY)', value: 'CNY' },
  { label: '美元 (USD)', value: 'USD' },
  { label: '欧元 (EUR)', value: 'EUR' },
  { label: '日元 (JPY)', value: 'JPY' },
  { label: '英镑 (GBP)', value: 'GBP' },
  { label: '港币 (HKD)', value: 'HKD' },
]

export const PRICE_GRANULARITY_OPTIONS: { label: string; value: TimeGranularity }[] = [
  { label: '按小时', value: 'HOUR' },
  { label: '按天', value: 'DAY' },
  { label: '按周', value: 'WEEK' },
  { label: '按月', value: 'MONTH' },
  { label: '按年', value: 'YEAR' },
]
