import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { itemApi } from '@/modules/price/api'
import type { PriceItemVO } from '@/modules/price/types'

export const usePriceItemStore = defineStore('priceItem', () => {
  const selectedItem = ref<PriceItemVO | null>(null)
  const selectedLocationId = ref<number | undefined>(undefined)
  const searchResults = ref<PriceItemVO[]>([])
  const searchLoading = ref(false)

  async function searchItems(keyword: string) {
    const trimmed = keyword.trim()
    if (!trimmed) {
      searchResults.value = []
      return
    }
    searchLoading.value = true
    try {
      const res = await itemApi.searchItems({ itemName: trimmed })
      searchResults.value = res.data?.records ?? []
    } catch {
      ElMessage.error('搜索失败，请稍后再试')
    } finally {
      searchLoading.value = false
    }
  }

  function selectItem(item: PriceItemVO) {
    selectedItem.value = item
  }

  function clearSelection() {
    selectedItem.value = null
    searchResults.value = []
  }

  function selectLocation(id: number | undefined) {
    selectedLocationId.value = id
  }

  return {
    selectedItem,
    selectedLocationId,
    searchResults,
    searchLoading,
    searchItems,
    selectItem,
    selectLocation,
    clearSelection,
  }
})
