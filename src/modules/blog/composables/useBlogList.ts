import { ref } from 'vue'
import { blogApi } from '@/modules/blog/api'
import type { BlogPostVO } from '@/modules/blog/types'

export interface BlogPostItem {
  id: number
  title: string
  excerpt: string
  date: string
  datetime: string
  tags: string[]
  readTime: string
  lang: string
  href: string
}

export function useBlogList() {
  const posts = ref<BlogPostItem[]>([])
  const currentPage = ref(1)
  const totalPages = ref(0)
  const totalPosts = ref(0)
  const loading = ref(false)

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function mapPostToItem(post: BlogPostVO): BlogPostItem {
    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      date: post.createTime,
      datetime: post.createTime,
      tags: post.tags,
      readTime: '5 min read',
      lang: '中文',
      href: `/blog/posts/${post.id}`,
    }
  }

  async function fetchPosts(pageNum = 1, pageSize = 10) {
    loading.value = true
    try {
      const res = await blogApi.page(pageNum, pageSize)
      if (res.code === 200 && res.data) {
        posts.value = res.data.records.map(mapPostToItem)
        currentPage.value = res.data.currentPage
        totalPages.value = res.data.totalPage
        totalPosts.value = res.data.total
      }
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    currentPage,
    totalPages,
    totalPosts,
    loading,
    formatDate,
    fetchPosts,
  }
}