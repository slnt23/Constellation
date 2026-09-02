<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBlogSettings } from '@/modules/blog/composables'

const { settings, fetchSettings } = useBlogSettings()

onMounted(fetchSettings)

const educations = computed(() => {
  return settings.value?.educations || []
})
</script>

<template>
  <section class="education-section">
    <div class="section-label">
      <h2>Education</h2>
    </div>
    <div class="section-content">
      <div class="education-list">
        <div v-for="(edu, index) in educations" :key="index" class="education-card">
          <h3 class="school-name">{{ edu.school }}</h3>
          <p class="degree">{{ edu.degree }}</p>
          <p class="period">{{ edu.period }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.education-section {
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

.education-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.education-card {
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 16px 20px;
  background: var(--color-background);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    border-color: var(--color-border);
  }
}

.school-name {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--color-text-deep);
}

.degree {
  font-size: 0.9rem;
  color: var(--color-muted-foreground);
  margin: 0 0 4px;
}

.period {
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
  opacity: 0.7;
  margin: 0;
}

@media (max-width: 768px) {
  .education-card {
    padding: 12px 16px;
    border-radius: 12px;
  }
}
</style>