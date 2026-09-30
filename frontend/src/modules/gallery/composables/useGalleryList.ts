import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { galleryApi } from '@/modules/gallery/api'
import type { GalleryItemVO } from '@/modules/gallery/types'

export function useGalleryList() {
    const galleryItems = ref<GalleryItemVO[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const isPersonalMode = ref(false)
    const pageNum = ref(1)
    const pageSize = ref(20)
    const total = ref(0)
    const totalPage = ref(0)

    async function fetchGalleryItems() {
        isLoading.value = true
        error.value = null
        try {
            const response = isPersonalMode.value
                ? await galleryApi.page(pageNum.value, pageSize.value)
                : await galleryApi.allPage(pageNum.value, pageSize.value)
            const records = response.data?.records ?? []
            galleryItems.value = records.map(item => ({
                ...item,
                imageUrl: item.imageUrl?.replace(/^`|`$/g, '') ?? '',
                thumbnailUrl: item.thumbnailUrl?.replace(/^`|`$/g, '') ?? '',
            }))
            total.value = response.data?.total ?? 0
            totalPage.value = response.data?.totalPage ?? 0
        } catch (e) {
            error.value = e instanceof Error ? e.message : '加载画廊数据失败'
            console.error('Gallery API Error:', e)
            ElMessage.error('加载画廊数据失败，请稍后重试')
        } finally {
            isLoading.value = false
        }
    }

    function toggleMode() {
        isPersonalMode.value = !isPersonalMode.value
        pageNum.value = 1
        fetchGalleryItems()
    }

    function handlePageChange(page: number) {
        pageNum.value = page
        fetchGalleryItems()
    }

    return {
        galleryItems,
        isLoading,
        error,
        isPersonalMode,
        pageNum,
        pageSize,
        total,
        totalPage,
        fetchGalleryItems,
        toggleMode,
        handlePageChange,
    }
}