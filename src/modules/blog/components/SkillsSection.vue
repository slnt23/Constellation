<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBlogSettings } from '@/modules/blog/composables'

const { settings, fetchSettings } = useBlogSettings()

onMounted(fetchSettings)

const skills = computed(() => {
  return settings.value?.skills || []
})

const poem = computed(() => {
  return settings.value?.about?.poem || ''
})
</script>

<template>
  <section class="skills-section">
    <div class="section-label">
      <h2>Skills</h2>
    </div>
    <div class="section-content">
      <div class="skills-container">
        <div v-for="skill in skills" :key="skill.category" class="skill-category">
          <h3 class="category-name">{{ skill.category }}</h3>
          <div class="skill-tags">
            <span v-for="item in skill.items" :key="item" class="skill-tag">
              {{ item }}
            </span>
          </div>
        </div>
      </div>

      <div class="poem-box">
        <span class="poem-dot"></span>
        <span class="poem-text">{{ poem }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.skills-section {
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
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skill-category {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-deep);
  min-width: 100px;
  margin: 0;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}

.skill-tag {
  display: inline-block;
  padding: 3px 10px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--color-muted-foreground);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.25);
    color: var(--color-text-deep);
  }
}

/* ── Poem ── */
.poem-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
  padding: 12px 24px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background);
}

.poem-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

.poem-text {
  font-size: 0.9rem;
  color: var(--color-muted-foreground);
  font-style: italic;
}

@media (max-width: 768px) {
  .skill-category {
    flex-direction: column;
    gap: 6px;
  }

  .category-name {
    min-width: auto;
  }

  .poem-box {
    padding: 10px 16px;
  }

  .poem-text {
    font-size: 0.8rem;
  }
}
</style>