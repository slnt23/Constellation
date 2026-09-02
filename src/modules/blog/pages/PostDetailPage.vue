<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi } from '@/modules/blog/api'
import type { BlogPostVO } from '@/modules/blog/types'
import PostContent from '@/modules/blog/components/PostContent.vue'

const route = useRoute()
const post = ref<BlogPostVO | null>(null)
const loading = ref(false)

const postId = computed(() => Number(route.params.id))

onMounted(async () => {
  loading.value = true
  try {
    const res = await blogApi.getById(postId.value)
    if (res.code === 200 && res.data) {
      post.value = res.data
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="post-detail-page">
    <div v-if="loading" class="loading-state">
      <p>Loading...</p>
    </div>

    <template v-else-if="post">
      <PostContent :post="post" />

      <!-- Back link -->
      <div class="back-link-wrapper">
        <RouterLink to="/blog/posts" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to posts
        </RouterLink>
      </div>
    </template>

    <div v-else class="empty-state">
      <p>Post not found</p>
      <RouterLink to="/blog/posts" class="back-link">
        Back to posts
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px 80px;
  min-height: 100vh;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
  color: var(--color-muted-foreground);
}

.back-link-wrapper {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.03);
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background);
    color: var(--color-primary);
  }
}

@media (max-width: 768px) {
  .post-detail-page {
    padding: 30px 16px 60px;
  }
}
</style>