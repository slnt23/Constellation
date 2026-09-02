<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlogList } from '@/modules/blog/composables'

const { posts, currentPage, totalPages, totalPosts, loading, formatDate, fetchPosts } = useBlogList()

onMounted(() => fetchPosts(1, 10))

function loadMore() {
  if (currentPage.value < totalPages.value && !loading.value) {
    fetchPosts(currentPage.value + 1, 10)
  }
}
</script>

<template>
  <div class="blog-list">
    <!-- Header -->
    <div class="blog-header">
      <h1 class="blog-title">Blog</h1>
    </div>

    <!-- Two-column layout -->
    <div class="blog-layout">
      <!-- Main: post list -->
      <div class="blog-main">
        <ul class="posts-list">
          <li v-for="post in posts" :key="post.id" class="post-preview group/card">
            <RouterLink class="post-link group/link" :to="post.href">
              <!-- Date -->
              <time class="post-date" :datetime="post.datetime">
                {{ formatDate(post.date) }}
              </time>
              <!-- Content -->
              <div class="post-body">
                <!-- Title row -->
                <div class="post-title-row">
                  <span class="post-title">{{ post.title }}</span>
                  <svg class="post-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" class="arrow-line" />
                    <polyline points="12 5 19 12 12 19" class="arrow-head" />
                  </svg>
                </div>
                <!-- Excerpt -->
                <p class="post-excerpt">{{ post.excerpt }}</p>
                <!-- Meta row: read time + language -->
                <div class="post-meta">
                  <svg class="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                  </svg>
                  <span>{{ post.readTime }}</span>
                  <span class="meta-sep">·</span>
                  <span>{{ post.lang }}</span>
                </div>
                <!-- Tags -->
                <div class="post-tags">
                  <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
                </div>
              </div>
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Sidebar -->
      <aside class="blog-sidebar">
        <div class="sidebar-content">
          <p class="pagination-info">
            Page {{ currentPage }} - Showing {{ posts.length }} of {{ totalPosts }} posts
          </p>
          <a class="sidebar-link" href="#">
            View all posts by years
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" class="arrow-line" />
              <polyline points="12 5 19 12 12 19" class="arrow-head" />
            </svg>
          </a>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/modules/blog/styles/blog-common' as *;

.blog-list {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ── Header ── */
.blog-header {
  margin-bottom: 40px;
}

.blog-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-deep);
}

/* ── Two-column layout ── */
.blog-layout {
  display: grid;
  gap: 32px;

  @media (min-width: 640px) {
    grid-template-columns: 3fr 1fr;
    gap: 32px;
  }
}

/* ── Main post list ── */
.posts-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.post-preview {
  @extend .post-preview;
}

.post-link {
  @extend .post-link;
  padding: 16px 20px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
}

.post-date {
  @extend .post-date;
  min-width: 100px;
  padding: 4px 0;

  @media (min-width: 640px) {
    min-width: 110px;
  }
}

.post-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

/* ── Title row ── */
.post-title-row {
  @extend .post-title-row;
}

.post-title {
  @extend .post-title;
}

.post-arrow {
  @extend .post-arrow;
}

/* ── Excerpt ── */
.post-excerpt {
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 640px) {
    -webkit-line-clamp: 3;
  }
}

/* ── Meta ── */
.post-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
  font-style: italic;
  line-height: 1;
  padding: 6px 0;

  @media (min-width: 640px) {
    padding: 12px 0;
  }
}

.meta-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.meta-sep {
  opacity: 0.4;
}

/* ── Tags ── */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 2px;
}

.post-tag {
  @extend .post-tag;
}

/* ── Sidebar ── */
.blog-sidebar {
  @media (max-width: 640px) {
    display: none;
  }
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pagination-info {
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
  margin: 0;
}

.sidebar-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }

  .arrow-line {
    transition: all 0.3s ease;
    transform: translateX(4px) scaleX(0);
  }

  .arrow-head {
    transition: all 0.3s ease;
    transform: translateX(0);
  }

  &:hover .arrow-line {
    transform: translateX(1px) scaleX(1);
  }

  &:hover .arrow-head {
    transform: translateX(1px);
  }
}

@media (max-width: 768px) {
  .post-preview {
    border-radius: 12px;
  }

  .post-link {
    padding: 12px 16px;
  }
}
</style>