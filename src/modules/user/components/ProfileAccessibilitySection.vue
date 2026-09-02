<script setup lang="ts">
import type { ProfileCardExample } from '@/shared/types'

defineProps<{
  cards: ProfileCardExample[]
}>()
</script>

<template>
  <el-card class="profile-accessibility" shadow="never">
    <template #header>
      <h3 class="profile-accessibility__title">辅助功能</h3>
    </template>

    <div class="profile-accessibility__list">
      <el-card v-for="card in cards" :key="card.title" class="profile-accessibility__item" shadow="hover">
        <h4 class="profile-accessibility__item-title">{{ card.title }}</h4>
        <p class="profile-accessibility__item-desc">{{ card.description }}</p>
      </el-card>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.profile-accessibility {
  border: none;
  background: transparent;

  :deep(.el-card__header) {
    padding: 0 0 20px;
    border-bottom: none;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.profile-accessibility__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.profile-accessibility__list {
  display: grid;
  gap: 16px;
}

.profile-accessibility__item {
  border: 1px solid var(--el-border-color-light);

  :deep(.el-card__header) {
    padding: 0;
    border-bottom: none;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.profile-accessibility__item-title {
  margin: 0 0 8px;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.profile-accessibility__item-desc {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 20px;
}
</style>