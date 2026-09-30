import { ref } from 'vue'
import { blogApi } from '@/modules/blog/api'
import type { BlogSettingsVO } from '@/modules/blog/types'

export function useBlogSettings() {
    const settings = ref<BlogSettingsVO | null>(null)
    const loading = ref(false)

    async function fetchSettings() {
        loading.value = true
        try {
            const res = await blogApi.getSettings()
            if (res.code === 200 && res.data) {
                settings.value = res.data
            }
        } finally {
            loading.value = false
        }
    }

    return {
        settings,
        loading,
        fetchSettings,
    }
}