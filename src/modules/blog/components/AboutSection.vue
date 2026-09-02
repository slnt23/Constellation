<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { getCurrentUser } from '@/core/permission'
import { EXAMPLE_PUBLIC_PROFILE_DEFAULTS } from '@/shared/constants'
import { MOCK_BLOG_SETTINGS } from '@/modules/blog/constants/mock'

const currentUser = getCurrentUser()
const aboutData = ref(MOCK_BLOG_SETTINGS.about)

const avatarUrl = computed(() => {
  const url = (currentUser?.avatarUrl ?? '').trim()
  return url || EXAMPLE_PUBLIC_PROFILE_DEFAULTS.avatarUrl
})

const displayName = computed(() => {
  return currentUser?.nickname || currentUser?.userName || 'Arthals'
})
</script>

<template>
  <section class="about-section">
    <div class="about-header">
      <div class="avatar-wrapper">
        <img class="avatar" :src="avatarUrl" :alt="displayName" />
      </div>
      <h1 class="name">{{ displayName }}</h1>
      <div class="location-row">
        <span class="location-item">
          <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2a9 9 0 0 1 9 9c0 3.074-1.676 5.59-3.442 7.395a20.4 20.4 0 0 1-2.876 2.416l-.426.29l-.2.133l-.377.24l-.336.205l-.416.242a1.87 1.87 0 0 1-1.854 0l-.416-.242l-.52-.32l-.192-.125l-.41-.273a20.6 20.6 0 0 1-3.093-2.566C4.676 16.589 3 14.074 3 11a9 9 0 0 1 9-9m0 2a7 7 0 0 0-7 7c0 2.322 1.272 4.36 2.871 5.996a18 18 0 0 0 2.222 1.91l.458.326q.222.155.427.288l.39.25l.343.209l.289.169l.455-.269l.367-.23q.293-.186.627-.417l.458-.326a18 18 0 0 0 2.222-1.91C17.728 15.361 19 13.322 19 11a7 7 0 0 0-7-7m0 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4" />
          </svg>
          {{ aboutData.location }}
        </span>
        <a :href="aboutData.githubUrl" target="_blank" class="location-item github-link">
          <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M6.315 6.176c-.25-.638-.24-1.367-.129-2.034a6.8 6.8 0 0 1 2.12 1.07c.28.214.647.283.989.18A9.3 9.3 0 0 1 12 5c.961 0 1.874.14 2.703.391c.342.104.709.034.988-.18a6.8 6.8 0 0 1 2.119-1.07c.111.667.12 1.396-.128 2.033c-.15.384-.075.826.208 1.14C18.614 8.117 19 9.04 19 10c0 2.114-1.97 4.187-5.134 4.818c-.792.158-1.101 1.155-.495 1.726c.389.366.629.882.629 1.456v3a1 1 0 0 0 2 0v-3c0-.57-.12-1.112-.334-1.603C18.683 15.35 21 12.993 21 10c0-1.347-.484-2.585-1.287-3.622c.21-.82.191-1.646.111-2.28c-.071-.568-.17-1.312-.57-1.756c-.595-.659-1.58-.271-2.28-.032a9 9 0 0 0-2.125 1.045A11.4 11.4 0 0 0 12 3c-.994 0-1.953.125-2.851.356a9 9 0 0 0-2.125-1.045c-.7-.24-1.686-.628-2.281.031c-.408.452-.493 1.137-.566 1.719l-.005.038c-.08.635-.098 1.462.112 2.283C3.484 7.418 3 8.654 3 10c0 2.992 2.317 5.35 5.334 6.397A4 4 0 0 0 8 17.98l-.168.034c-.717.099-1.176.01-1.488-.122c-.76-.322-1.152-1.133-1.63-1.753c-.298-.385-.732-.866-1.398-1.088a1 1 0 0 0-.632 1.898c.558.186.944 1.142 1.298 1.566c.373.448.869.916 1.58 1.218c.682.29 1.483.393 2.438.276V21a1 1 0 0 0 2 0v-3c0-.574.24-1.09.629-1.456c.607-.572.297-1.568-.495-1.726C6.969 14.187 5 12.114 5 10c0-.958.385-1.881 1.108-2.684c.283-.314.357-.756.207-1.14" />
          </svg>
          GitHub
        </a>
      </div>
    </div>

    <div class="about-body">
      <div class="section-label">
        <h2>About</h2>
      </div>
      <div class="section-content">
        <p class="tag-line" v-html="aboutData.tagLine"></p>
        <div class="bio-text">
          <p v-for="(line, index) in aboutData.bio" :key="index" v-html="line"></p>
        </div>
        <div class="codetime-badge">
          <img alt="CodeTime Badge" :src="aboutData.codetimeUrl" />
        </div>
        <a class="more-link" href="/about">
          More about me
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" class="arrow-line" />
            <polyline points="12 5 19 12 12 19" class="arrow-head" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* ── Header ── */
.about-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 0;
}

.avatar-wrapper {
  margin-bottom: 0;
}

.avatar {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  padding: 4px;
  object-fit: cover;
}

.name {
  font-size: 30px;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-deep);
}

.location-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 28px;
  color: var(--color-muted-foreground);
  font-size: 0.95rem;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.github-link {
  text-decoration: none;
  color: var(--color-muted-foreground);
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.75;
  }
}

/* ── Two-column body ── */
.about-body {
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
  gap: 12px;
}

.tag-line {
  color: var(--color-muted-foreground);
  margin: 0;
  margin-top: 2px;
}

.bio-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--color-muted-foreground);
  line-height: 1.6;

  p {
    margin: 0;
  }

  del {
    opacity: 0.5;
  }
}

.codetime-badge {
  margin-top: 4px;

  img {
    border-radius: 6px;
    border: 1px solid var(--color-border);
  }
}

.more-link {
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
  .avatar {
    width: 96px;
    height: 96px;
  }

  .name {
    font-size: 24px;
  }

  .more-link {
    align-self: flex-start;
  }
}
</style>