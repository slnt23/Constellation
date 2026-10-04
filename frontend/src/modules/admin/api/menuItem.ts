import request from '@/core/api/request'
import type { MenuItemDTO } from '@/modules/admin/types'
import type { MenuItemVO, PageResult, Result } from '@/shared/types'

const MENU_ITEM_BASE_URL = '/admin/menu-item'
const PUBLIC_MENU_ITEM_BASE_URL = '/public/menu-item'

/** 构建 multipart 请求体，跳过空值 */
function toFormData(data: MenuItemDTO): FormData {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob)
    }
  })
  return formData
}

/** 菜单项：管理端接口要求 ADMIN，公开读接口免登录 */
export const menuItemApi = {
  /**
   * 获取全部启用中的菜单项（按排序升序） — GET /public/menu-item/list
   * 前台菜单面板使用
   */
  listEnabled(): Promise<Result<MenuItemVO[]>> {
    return request.get(`${PUBLIC_MENU_ITEM_BASE_URL}/list`)
  },

  /** 分页获取全部菜单项 — GET /admin/menu-item/page */
  page(pageNum = 1, pageSize = 10): Promise<Result<PageResult<MenuItemVO>>> {
    return request.get(`${MENU_ITEM_BASE_URL}/page`, { params: { pageNum, pageSize } })
  },

  /** 获取单条菜单项 — GET /admin/menu-item/{id} */
  getById(id: number): Promise<Result<MenuItemVO>> {
    return request.get(`${MENU_ITEM_BASE_URL}/${id}`)
  },

  /** 新增菜单项 — POST /admin/menu-item（multipart，image 必传） */
  create(data: MenuItemDTO): Promise<Result<number>> {
    return request.post(MENU_ITEM_BASE_URL, toFormData(data))
  },

  /** 更新菜单项 — PUT /admin/menu-item/{id}（multipart，不传 image 表示保留原配图） */
  update(id: number, data: MenuItemDTO): Promise<Result<null>> {
    return request.put(`${MENU_ITEM_BASE_URL}/${id}`, toFormData(data))
  },

  /** 删除菜单项 — DELETE /admin/menu-item/{id} */
  deleteById(id: number): Promise<Result<null>> {
    return request.delete(`${MENU_ITEM_BASE_URL}/${id}`)
  },

  /** 启用/禁用菜单项 — PUT /admin/menu-item/{id}/status */
  updateStatus(id: number, status: number): Promise<Result<null>> {
    return request.put(`${MENU_ITEM_BASE_URL}/${id}/status`, null, { params: { status } })
  },
}
