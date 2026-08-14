import request from '../request'
import type {
  CategoryVO,
  MerchantOrderQuery,
  MerchantOrderUpdateParams,
  MerchantProductStatusParams,
  OrderDetailVO,
  OrderDTO,
  OrderListVO,
  ProductDetailVO,
  ProductDTO,
  ProductPageQuery,
  ProductVO,
  ShoppingCartDTO,
  ShoppingCartDeleteParams,
  ShoppingCartVO,
} from '@/types'
import type { PageResult, Result } from '@/types'

const PITAYA_PRODUCT = '/pitaya/product'
const PITAYA_CART = '/pitaya/cart'
const PITAYA_ORDER = '/pitaya/order'

/** 消费者商品接口 */
export const consumerProductApi = {
  /**
   * 商品分页列表 — GET /pitaya/product/consumer/products
   * productName 必填，可传空字符串进行全量分页查询
   */
  listProducts(params: ProductPageQuery): Promise<Result<PageResult<ProductVO>>> {
    return request.get(`${PITAYA_PRODUCT}/consumer/products`, { params })
  },

  /** 商品分类列表 — GET /pitaya/product/consumer/category */
  listCategories(): Promise<Result<CategoryVO[]>> {
    return request.get(`${PITAYA_PRODUCT}/consumer/category`)
  },

  /** 商品详情 — GET /pitaya/product/consumer/detail */
  getProductDetail(productId: number): Promise<Result<ProductDetailVO>> {
    return request.get(`${PITAYA_PRODUCT}/consumer/detail`, { params: { productId } })
  },
}

/** 消费者购物车接口 */
export const cartApi = {
  /** 加入购物车 — POST /pitaya/cart/consumer/product */
  addProduct(data: ShoppingCartDTO): Promise<Result<null>> {
    return request.post(`${PITAYA_CART}/consumer/product`, data)
  },

  /** 删除购物车商品 — DELETE /pitaya/cart/consumer/product（userId、productId 来自 query） */
  removeProduct(params: ShoppingCartDeleteParams): Promise<Result<null>> {
    return request.delete(`${PITAYA_CART}/consumer/product`, { params })
  },

  /** 更新购物车商品 — PUT /pitaya/cart/consumer/product */
  updateProduct(data: ShoppingCartDTO): Promise<Result<null>> {
    return request.put(`${PITAYA_CART}/consumer/product`, data)
  },

  /** 购物车分页列表 — GET /pitaya/cart/consumer/carts */
  listCarts(params: { pageNum?: number; pageSize?: number }): Promise<Result<PageResult<ShoppingCartVO>>> {
    return request.get(`${PITAYA_CART}/consumer/carts`, { params })
  },
}

/** 消费者订单接口 */
export const consumerOrderApi = {
  /** 创建订单 — POST /pitaya/order/consumer */
  create(data: OrderDTO): Promise<Result<null | string>> {
    return request.post(`${PITAYA_ORDER}/consumer`, data)
  },

  /** 确认收货 — PUT /pitaya/order/consumer/{orderId}/confirmed */
  confirm(orderId: number): Promise<Result<null | string>> {
    return request.put(`${PITAYA_ORDER}/consumer/${orderId}/confirmed`)
  },

  /** 取消订单 — PUT /pitaya/order/consumer/{orderId}/cancel */
  cancel(orderId: number): Promise<Result<null | string>> {
    return request.put(`${PITAYA_ORDER}/consumer/${orderId}/cancel`)
  },

  /** 订单详情 — GET /pitaya/order/consumer/{orderId} */
  getDetail(orderId: number): Promise<Result<OrderDetailVO>> {
    return request.get(`${PITAYA_ORDER}/consumer/${orderId}`)
  },

  /** 订单分页列表 — GET /pitaya/order/consumer/orders */
  listOrders(params: { pageNum?: number; pageSize?: number }): Promise<Result<PageResult<OrderListVO>>> {
    return request.get(`${PITAYA_ORDER}/consumer/orders`, { params })
  },
}

/** 商家商品接口 */
export const merchantProductApi = {
  /** 新增商品 — POST /pitaya/product/merchant/products */
  create(data: ProductDTO): Promise<Result<null | string>> {
    return request.post(`${PITAYA_PRODUCT}/merchant/products`, data)
  },

  /** 修改商品 — PUT /pitaya/product/merchant/products/modify */
  update(data: ProductDTO): Promise<Result<null | string>> {
    return request.put(`${PITAYA_PRODUCT}/merchant/products/modify`, data)
  },

  /** 删除商品 — DELETE /pitaya/product/merchant/products/{productId} */
  remove(productId: number): Promise<Result<null | string>> {
    return request.delete(`${PITAYA_PRODUCT}/merchant/products/${productId}`)
  },

  /** 商品上下架 — PUT /pitaya/product/merchant/products/{productId}/status */
  updateStatus(productId: number, params: MerchantProductStatusParams): Promise<Result<null | string>> {
    return request.put(`${PITAYA_PRODUCT}/merchant/products/${productId}/status`, null, { params })
  },
}

/** 商家订单接口 */
export const merchantOrderApi = {
  /** 订单分页列表 — GET /pitaya/order/merchant/orders（userId 表示被查询的消费者用户 ID） */
  listOrders(params: MerchantOrderQuery): Promise<Result<PageResult<OrderListVO>>> {
    return request.get(`${PITAYA_ORDER}/merchant/orders`, { params })
  },

  /** 更新订单状态 — PUT /pitaya/order/merchant */
  updateStatus(params: MerchantOrderUpdateParams): Promise<Result<null>> {
    return request.put(`${PITAYA_ORDER}/merchant`, null, { params })
  },
}
