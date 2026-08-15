import { ref } from 'vue'
import { BLOG_POSTS, BLOG_POSTS_TOTAL, BLOG_POSTS_TOTAL_PAGES } from '@/modules/blog/constants'

export function useBlogList() {
  const posts = ref(BLOG_POSTS)
  const currentPage = ref(1)
  const totalPages = ref(BLOG_POSTS_TOTAL_PAGES)
  const totalPosts = ref(BLOG_POSTS_TOTAL)

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return {
    posts,
    currentPage,
    totalPages,
    totalPosts,
    formatDate,
  }
}
