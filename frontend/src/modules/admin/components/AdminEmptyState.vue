<script setup lang="ts">
import { Box } from '@element-plus/icons-vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
  }>(),
  {
    description: '',
  },
)
</script>

<template>
  <div class="admin-empty">
    <div class="admin-empty__icon">
      <slot name="icon">
        <el-icon><Box /></el-icon>
      </slot>
    </div>
    <h2 class="admin-empty__title">{{ title }}</h2>
    <p v-if="description" class="admin-empty__description">{{ description }}</p>
    <slot />
  </div>
</template>
