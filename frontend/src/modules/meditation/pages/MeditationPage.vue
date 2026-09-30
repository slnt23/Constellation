<script setup lang="ts">
import { useMeditation } from '@/modules/meditation/composables'

const { meditations, activeId, activeMeditation, selectMeditation } = useMeditation()
</script>

<template>
  <div class="meditation-page">
    <!-- Header -->
    <header class="meditation-header">
      <h1 class="meditation-header__title">Meditations of the Oak</h1>
      <p class="meditation-header__subtitle">
        A journey through seasons and species, celebrating oak trees as living monuments.
        Select a meditation below to begin.
      </p>
    </header>

    <!-- Navigation -->
    <nav class="meditation-nav">
      <button v-for="m in meditations" :key="m.id" class="meditation-nav__item"
        :class="{ 'is-active': activeId === m.id }" @click="selectMeditation(m.id)">
        <span class="meditation-nav__icon">{{ m.icon }}</span>
        <span class="meditation-nav__category">{{ m.category }}</span>
        <span class="meditation-nav__duration">{{ m.duration }}</span>
      </button>
    </nav>

    <!-- Active Meditation Detail -->
    <article class="meditation-detail" v-if="activeMeditation">
      <div class="meditation-detail__card">
        <span class="meditation-detail__icon">{{ activeMeditation.icon }}</span>
        <h2 class="meditation-detail__title">{{ activeMeditation.title }}</h2>
        <p class="meditation-detail__description">
          {{ activeMeditation.description }}
        </p>

        <div class="meditation-detail__meta">
          <div class="meditation-detail__meta-item">
            <span class="meditation-detail__meta-label">Length</span>
            <span class="meditation-detail__meta-value">{{ activeMeditation.duration }}</span>
          </div>
          <div class="meditation-detail__meta-item">
            <span class="meditation-detail__meta-label">Words by</span>
            <span class="meditation-detail__meta-value">{{ activeMeditation.author }}</span>
          </div>
          <div class="meditation-detail__meta-item">
            <span class="meditation-detail__meta-label">Voice by</span>
            <span class="meditation-detail__meta-value">{{ activeMeditation.voice }}</span>
          </div>
        </div>

        <div class="meditation-detail__prompts">
          <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="meditation-detail__prompts-icon">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M9.492 2.122C6.109 2.122 3.367 4.995 3.367 8.54v.377c.26-.015.522.043.756.165l.812.426A1.75 1.75 0 015.78 10.942v4.367c0 .608-.328 1.163-.846 1.435l-.812.425c-.488.256-1.096.229-1.56-.149a15.56 15.56 0 01-1.49-1.493C.582 14.9.094 14.055.094 13.125c0-.93.488-1.773.98-2.402.179-.23.37-.444.558-.64a1.72 1.72 0 01-.015-.17V8.54C1.617 3.983 5.143.29 9.492.29c4.35 0 7.875 3.694 7.875 8.25v1.375c0 .056-.005.11-.014.163.191.197.384.415.566.647.49.628.98 1.472.98 2.402 0 .93-.49 1.773-.98 2.402-.506.647-1.102 1.177-1.49 1.493-.464.378-1.072.404-1.56.149l-.812-.425a1.75 1.75 0 01-.846-1.435V10.942c0-.608.328-1.163.846-1.435l.812-.425c.232-.122.49-.18.748-.167V8.54c0-3.544-2.743-6.417-6.125-6.417z"
              fill="currentColor" />
          </svg>
          <div class="meditation-detail__prompts-text">
            <p v-for="(prompt, i) in activeMeditation.prompts" :key="i">
              {{ prompt }}
            </p>
          </div>
        </div>
      </div>
    </article>

    <!-- All Meditations Grid -->
    <section class="meditation-grid">
      <h2 class="meditation-grid__heading">All Meditations</h2>
      <div class="meditation-grid__items">
        <div v-for="m in meditations" :key="m.id" class="meditation-card" :class="{ 'is-active': activeId === m.id }"
          @click="selectMeditation(m.id)">
          <span class="meditation-card__icon">{{ m.icon }}</span>
          <h3 class="meditation-card__title">{{ m.title }}</h3>
          <p class="meditation-card__description">{{ m.description }}</p>
          <div class="meditation-card__footer">
            <span class="meditation-card__duration">{{ m.duration }}</span>
            <span class="meditation-card__author">{{ m.author }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.meditation-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 60px 20px 80px;
}

// Header
.meditation-header {
  text-align: center;
  margin-bottom: 48px;

  &__title {
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
    color: var(--theme-text);
    margin: 0 0 12px;
    letter-spacing: -0.02em;
  }

  &__subtitle {
    font-size: 1.1rem;
    color: var(--theme-text-muted);
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.7;
  }
}

// Navigation pills
.meditation-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 48px;

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: 1px solid var(--theme-border-soft);
    border-radius: var(--theme-radius-action);
    background: var(--theme-surface);
    color: var(--theme-text-regular);
    font-size: 0.9rem;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--theme-border);
      color: var(--theme-text);
    }

    &.is-active {
      background: var(--theme-text);
      color: #ffffff;
      border-color: var(--theme-text);
    }
  }

  &__icon {
    font-size: 1.1rem;
  }

  &__category {
    font-weight: var(--font-weight-medium);
  }

  &__duration {
    font-size: 0.8rem;
    opacity: 0.7;
  }
}

// Active detail card
.meditation-detail {
  margin-bottom: 64px;

  &__card {
    background: var(--theme-surface);
    border-radius: var(--theme-radius-large);
    padding: 48px;
    box-shadow: var(--theme-shadow-card);
    text-align: center;
  }

  &__icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: var(--font-weight-bold);
    color: var(--theme-text);
    margin: 0 0 16px;
  }

  &__description {
    font-size: 1.1rem;
    color: var(--theme-text-regular);
    line-height: 1.8;
    max-width: 640px;
    margin: 0 auto 32px;
  }

  &__meta {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  &__meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__meta-label {
    font-size: 0.8rem;
    color: var(--theme-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__meta-value {
    font-size: 0.95rem;
    color: var(--theme-text);
    font-weight: var(--font-weight-medium);
  }

  &__prompts {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 20px 24px;
    background: #f8faf5;
    border-radius: var(--theme-radius-card);
    max-width: 480px;
    margin: 0 auto;
    text-align: left;

    &-icon {
      flex-shrink: 0;
      color: #6b8e5a;
      margin-top: 2px;
    }

    &-text p {
      margin: 0;
      font-size: 0.9rem;
      color: #4a5b3e;
      line-height: 1.6;

      &+p {
        margin-top: 4px;
      }
    }
  }
}

// Grid section
.meditation-grid {
  &__heading {
    font-size: 1.25rem;
    font-weight: var(--font-weight-bold);
    color: var(--theme-text);
    margin: 0 0 24px;
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
}

// Cards
.meditation-card {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-soft);
  border-radius: var(--theme-radius-large);
  padding: 28px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: var(--theme-shadow-card);
    border-color: var(--theme-border);
  }

  &.is-active {
    border-color: var(--theme-text);
    box-shadow: var(--theme-shadow-card);
  }

  &__icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: var(--font-weight-bold);
    color: var(--theme-text);
    margin: 0 0 8px;
  }

  &__description {
    font-size: 0.9rem;
    color: var(--theme-text-regular);
    line-height: 1.7;
    margin: 0 0 16px;
    display: -webkit-box;
    // -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: var(--theme-text-muted);
  }

  &__duration {
    font-weight: var(--font-weight-medium);
  }
}

@media (max-width: 768px) {
  .meditation-page {
    padding: 30px 16px 60px;
  }

  .meditation-header__title {
    font-size: 1.75rem;
  }

  .meditation-detail__card {
    padding: 28px 20px;
  }

  .meditation-detail__meta {
    gap: 24px;
  }

  .meditation-grid__items {
    grid-template-columns: 1fr;
  }
}
</style>