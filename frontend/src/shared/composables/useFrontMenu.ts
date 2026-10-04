import { ref } from 'vue'
import { menuItemApi } from '@/modules/admin/api'
import type { MenuItem, MenuItemVO } from '@/shared/types'

/**
 * 前台菜单面板的数据源。
 *
 * 菜单内容（标题 / 副标题 / 路由 / 配图）全部来自后台 `admin_menu_item`，
 * 配图是 MinIO 预签名 URL，不再打包进前端产物。
 *
 * 拉取失败时静默降级为空列表 —— 菜单拿不到不应影响页面其余内容。
 */
export function useFrontMenu() {
  const items = ref<MenuItem[]>([])
  const loading = ref(false)

  /** 接口 VO 映射为菜单面板的视图模型 */
  function toViewItem(vo: MenuItemVO): MenuItem {
    return {
      title: vo.title,
      subtitle: vo.subtitle ?? '',
      path: vo.path,
      image: vo.imageUrl,
      size: vo.cardSize,
    }
  }

  async function loadMenu() {
    loading.value = true
    try {
      const res = await menuItemApi.listEnabled()
      items.value = (res.data ?? []).map(toViewItem)
    } catch (error) {
      console.error('获取前台菜单失败', error)
      items.value = []
    } finally {
      loading.value = false
    }
  }

  return { items, loading, loadMenu }
}
