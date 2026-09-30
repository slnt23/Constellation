import request from '@/core/api/request'
import type { ItemIntroDTO, PriceItemVO } from '@/modules/price/types'
import type { PageResult, Result } from '@/shared/types'

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
