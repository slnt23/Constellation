// 时间字符串，格式：2026-05-12T18:30:00
export type DateTimeString = string

// ISO 日期时间字符串 (例如: "2026-05-21T15:30:00")
// export type DateTimeString = string;

// 金额类型（建议使用 string 避免浮点精度问题）
export type Money = string;

// 时间粒度，这个后期也是从后端获取，目前先写死，不然总是产生歧义，
export type TimeGranularity =
    | 'HOUR'
    | 'DAY'
    | 'WEEK'
    | 'MONTH'
    | 'YEAR'

// 币种，这个后期也是从后端获取，目前先写死，不然总是产生歧义，
export type Currency =
    | 'CNY'
    | 'USD'
    | 'EUR'
    | 'JPY'
    | 'GBP'
    | 'HKD'


// DTO（Data Transfer Object）是用于数据传输的对象，通常用于前后端之间的数据交换。VO（View Object）是用于视图展示的对象，通常包含了前端需要展示的数据结构。
// 价格查询基础参数
export interface BasePriceQueryDTO {

    // ==================== 物品 ====================
    // 单个物品ID
    itemId?: number

    // 多个物品ID
    itemIds?: number[]

    // 物品编码
    itemCode?: string

    // ==================== 地点 ====================
    // 单个地点ID
    locationId?: number

    // 多个地点ID
    locationIds?: number[]

    // ==================== 来源 ====================
    // 来源ID列表
    sourceIds?: number[]

    // 最低可靠等级 1 ~ 5
    minReliability?: number

    // ==================== 通用 ====================

    // 币种
    currency?: Currency

    // 最低可信度 0 ~ 100
    minConfidence?: number
}

/** 物品搜索请求参数 */
export interface ItemIntroDTO {
    itemName: string
    // 页码，默认 1
    pageNum?: number
    // 每页条数，默认 10
    pageSize?: number
}

export interface PriceLatestQueryDTO
    extends BasePriceQueryDTO {
}

export interface PriceTrendQueryDTO
    extends BasePriceQueryDTO {

    // 开始时间
    startTime: DateTimeString

    // 结束时间
    endTime: DateTimeString

    // 聚合粒度
    granularity: TimeGranularity
}

export interface PriceCompareLocationDTO
    extends BasePriceQueryDTO {

    // 对比时间点
    targetTime: DateTimeString
}

export interface PriceCompareSourceDTO
    extends BasePriceQueryDTO {

    // 对比时间点
    targetTime: DateTimeString
}








// VO（View Object）是用于视图展示的对象，通常包含了前端需要展示的数据结构。
// 物品简洁基础信息
export interface PriceItemVO {
    // 物品ID
    itemId: number;
    // 物品名称
    itemName: string;
    // 计量单位
    unit: string;
    // 物品规格描述
    specification: string;
    // 所属分类名称
    categoryName: string;
}

// 最新价格视图对象
export interface PriceLatestVO extends PriceItemVO {
    locationName: string;
    price: Money;
    currency: string;
    priceUnit: string;
    sourceName: string;
    reliabilityLevel: number;
    effectiveTime: DateTimeString;
    confidence: number;
}

// 价格趋势单点数据
export interface PriceTrendPointVO {
    // 时间点
    time: DateTimeString;
    // 价格
    price: Money;
}

// 价格趋势数据
export interface PriceTrendVO extends PriceItemVO {
    // 地点 ID
    locationId: number;
    // 地点名
    locationName: string;
    // 趋势数据点
    trend: PriceTrendPointVO[];
}

// 单来源价格对比信息
export interface SourceCompareVO {
    // 价格来源名称
    sourceName: string;
    // 价格金额
    price: Money;
    // 可靠等级（1-5）
    reliabilityLevel: number;
    // 可信度（0.00-100.00）
    confidence: number;
}

// 多地区价格对比 - 单地区价格点
export interface PriceRegionPointVO {
    locationName: string;
    price: Money;
}

// 多地区价格对比返回对象
export interface PriceCompareVO {
    item: PriceItemVO;
    prices: PriceRegionPointVO[];
}
