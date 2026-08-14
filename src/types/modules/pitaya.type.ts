import type { AddressVO } from './user.type'

/**
 * 电商中心接口模型
 * 对应 frontend-api.md「电商中心」章节
 */

/** 订单状态：0=待支付，1=待发货，2=待收货，3=已完成，4=取消 */
export type OrderStatus = 0 | 1 | 2 | 3 | 4

/** 商品状态：1=启用，0=禁用 */
export type ProductStatus = 0 | 1

/** 勾选状态：0=未勾选，1=勾选 */
export type CartChecked = 0 | 1

/** 商品列表项 — ProductVO */
export interface ProductVO {
  /** 商品名 */
  productName: string
  /** 分类名 */
  categoryName: string
  /** 单价 */
  price: number
  /** 库存 */
  stock: number
  /** 1=启用，0=禁用 */
  status: ProductStatus
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 商品图片 — ProductDetailVO.images 元素 */
export interface ProductImageVO {
  /** 图片 URL */
  imageUrl: string
  /** 图片排序 */
  imageSort: number
}

/** 商品详情 — ProductDetailVO */
export interface ProductDetailVO {
  /** 商品 ID */
  id: number
  /** 分类 ID */
  categoryId: number
  /** 分类名 */
  categoryName: string
  /** 商家 ID */
  sellerId: number
  /** 商品名 */
  name: string
  /** 商品描述 */
  description: string
  /** 单价 */
  price: number
  /** 库存 */
  stock: number
  /** 封面图 */
  coverImg: string
  /** 图片列表 */
  images: ProductImageVO[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 商品分类 — CategoryVO */
export interface CategoryVO {
  /** 父分类 ID，顶级为 0 */
  parentId: number
  /** 分类名 */
  name: string
  /** 分类层级 */
  level: number
  /** 排序 */
  sort: number
  /** 分类描述 */
  description: string
}

/** 消费者商品分页查询参数 */
export interface ProductPageQuery {
  /** 商品名，必填，可传空字符串进行全量分页查询 */
  productName: string
  /** 页码，默认 1 */
  pageNum?: number
  /** 每页条数，超过 50 会被后端限制为 50 */
  pageSize?: number
}

/** 购物车新增/更新请求体 — ShoppingCartDTO */
export interface ShoppingCartDTO {
  /** 用户 ID，新增/更新时来自请求体 */
  userId: number
  /** 商品 ID */
  productId: number
  /** 数量 */
  quantity?: number
  /** 0=未勾选，1=勾选 */
  checked?: CartChecked
}

/** 购物车删除参数（query） */
export interface ShoppingCartDeleteParams {
  /** 用户 ID（当前实现来自 query，与新增/更新不统一） */
  userId: number
  /** 商品 ID */
  productId: number
}

/** 购物车列表项 — ShoppingCartVO */
export interface ShoppingCartVO {
  /** 购物车 ID */
  cartId: number
  /** 商品 ID */
  productId: number
  /** 数量 */
  quantity: number
  /** 0=未勾选，1=勾选 */
  checked: CartChecked
  /** 商品名 */
  productName: string
  /** 单价 */
  price: number
  /** 封面图 */
  coverImage: string
}

/** 下单商品项 — OrderDTO.items 元素 */
export interface OrderItemDTO {
  /** 商品 ID */
  productId: number
  /** 数量 */
  quantity: number
}

/** 下单请求体 — OrderDTO */
export interface OrderDTO {
  /** 下单来源：CART / BUY_NOW */
  source?: 'CART' | 'BUY_NOW'
  /** 订单备注 */
  remark?: string
  /** 收货地址 ID，必须属于当前用户 */
  addressId: number
  /** 订单商品 */
  items: OrderItemDTO[]
}

/** 订单商品项 — OrderItemVO */
export interface OrderItemVO {
  /** 商品 ID */
  productId: number
  /** 商品名 */
  productName: string
  /** 商品图片 */
  productImage: string
  /** 单价 */
  unitPrice: number
  /** 数量 */
  quantity: number
  /** 小计 */
  totalPrice: number
}

/** 订单详情 — OrderDetailVO */
export interface OrderDetailVO {
  /** 订单 ID */
  id: number
  /** 订单编号 */
  orderNo: string
  /** 订单状态 */
  orderStatus: OrderStatus
  /** 支付状态 */
  payStatus: number
  /** 订单总金额 */
  totalAmount: number
  /** 下单时间 */
  createTime: string
  /** 支付时间 */
  payTime: string
  /** 发货时间 */
  deliveryTime: string
  /** 完成时间 */
  finishTime: string
  /** 收货地址快照 */
  address: AddressVO
  /** 订单商品列表 */
  items: OrderItemVO[]
}

/** 订单列表项 — OrderListVO */
export interface OrderListVO {
  /** 订单 ID */
  orderId: number
  /** 订单编号 */
  orderNo: string
  /** 订单状态 */
  orderStatus: OrderStatus
  /** 总金额 */
  totalAmount: number
  /** 商品数量 */
  itemCount: number
  /** 下单时间 */
  createTime: string
}

/** 商品创建/更新请求体 — ProductDTO */
export interface ProductDTO {
  /** 商品 ID，更新时必传 */
  id?: number
  /** 分类 ID */
  categoryId: number
  /** 商家 ID */
  sellerId?: number
  /** 商品名 */
  productName?: string
  /** 商品描述 */
  description?: string
  /** 价格 */
  price: number
  /** 库存 */
  stock: number
  /** 封面图 URL */
  coverImage?: string
  /** 1=启用，0=禁用 */
  status?: ProductStatus
  /** 商品图片，至少一张 */
  images: ProductImageDTO[]
}

/** 商品图片请求项 — ProductDTO.images 元素 */
export interface ProductImageDTO {
  /** 商品 ID */
  productId?: number
  /** 图片 URL */
  imageUrl: string
  /** 排序 */
  sort: number
}

/** 商家商品上下架参数（query） */
export interface MerchantProductStatusParams {
  /** 1=启用，0=禁用 */
  productStatus: ProductStatus
}

/** 商家订单列表查询参数（userId 表示被查询的消费者用户 ID） */
export interface MerchantOrderQuery {
  /** 页码 */
  pageNum?: number
  /** 每页条数 */
  pageSize?: number
  /** 被查询的消费者用户 ID */
  userId?: number
}

/** 商家更新订单状态参数（query） */
export interface MerchantOrderUpdateParams {
  /** 订单 ID */
  orderId: number
  /** 订单状态，取值同消费者订单状态 */
  orderStatus: OrderStatus
}
