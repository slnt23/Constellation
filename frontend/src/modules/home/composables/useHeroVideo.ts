import { ref } from 'vue'
import { heroVideoApi } from '@/modules/admin/api'
import type { HeroVideoItem } from '@/shared/types'

/**
 * 首页 Hero 视频：挂载时从后端拉取当前生效的那一条。
 *
 * 拉取失败时静默降级 —— 只写控制台，不弹提示、不阻塞首屏；
 * 此时 videoUrl 为空，HeroSection 不渲染 <video>，页面其余内容照常展示。
 */
export function useHeroVideo() {
  const video = ref<HeroVideoItem | null>(null)
  const videoUrl = ref('')
  const posterUrl = ref('')

  async function loadHeroVideo() {
    try {
      const res = await heroVideoApi.active()
      if (res.code === 200 && res.data) {
        video.value = res.data
        videoUrl.value = res.data.videoUrl ?? ''
        posterUrl.value = res.data.posterUrl ?? ''
      }
    } catch (error) {
      console.error('获取 Hero 视频失败', error)
    }
  }

  return { video, videoUrl, posterUrl, loadHeroVideo }
}
