<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogList } from '@/modules/blog/composables'

const { posts, loading, fetchPosts } = useBlogList()

onMounted(fetchPosts)

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <section class="posts-section">
    <div class="section-label">
      <h2>Posts</h2>
    </div>
    <div class="section-content">
      <ul class="posts-list">
        <li v-for="post in posts" :key="post.id" class="post-preview">
          <a class="post-link" href="#">
            <time class="post-date" :datetime="post.datetime">
              {{ formatDate(post.date) }}
            </time>
            <div class="post-title-row">
              <span class="post-title">{{ post.title }}</span>
              <svg class="post-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" class="arrow-line" />
                <polyline points="12 5 19 12 12 19" class="arrow-head" />
              </svg>
            </div>
          </a>
        </li>
      </ul>
      <RouterLink class="view-all" to="/blog/posts">
        View All
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" class="arrow-line" />
          <polyline points="12 5 19 12 12 19" class="arrow-head" />
        </svg>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.posts-section {
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.section-label {
  @media (min-width: 768px) {
    min-width: 144px;
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: var(--color-text-deep);
  }
}

.section-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Post list ── */
.posts-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.post-preview {
  position: relative;
  border: 1px solid transparent;
  border-radius: 16px;
  background: var(--color-background);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    border-color: var(--color-border);
  }
}

.post-link {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }

  &:hover {
    color: var(--color-primary);
  }
}

.post-date {
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
  min-width: 95px;
  padding: 4px 0;

  @media (min-width: 640px) {
    min-width: 100px;
  }
}

.post-title-row {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.post-title {
  font-size: 0.95rem;
  font-weight: 500;
}

.post-arrow {
  flex-shrink: 0;
  stroke: var(--color-muted-foreground);
  transition: stroke 0.2s ease;

  .post-link:hover & {
    stroke: var(--color-primary);
  }

  .arrow-line {
    transition: all 0.3s ease;
    transform: translateX(4px) scaleX(0);
  }

  .arrow-head {
    transition: all 0.3s ease;
    transform: translateX(0);
  }

  .post-link:hover & .arrow-line {
    transform: translateX(1px) scaleX(1);
  }

  .post-link:hover & .arrow-head {
    transform: translateX(1px);
  }
}

/* ── View All ── */
.view-all {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-end;
  padding: 4px 8px;
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
    padding: 8px 16px;
  }
}
</style>