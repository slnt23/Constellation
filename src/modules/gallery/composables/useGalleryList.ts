import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { galleryApi } from '@/modules/gallery/api'
import type { GalleryItemVO } from '@/modules/gallery/types'

export function useGalleryList() {
    const galleryItems = ref<GalleryItemVO[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function fetchGalleryItems() {
        isLoading.value = true
        error.value = null
        try {
            const response = await galleryApi.list()
            galleryItems.value = response.data ?? []
        } catch (e) {
            error.value = e instanceof Error ? e.message : '加载画廊数据失败'
            ElMessage.error('加载画廊数据失败，请稍后重试')
        } finally {
            isLoading.value = false
        }
    }

    return { galleryItems, isLoading, error, fetchGalleryItems }
}