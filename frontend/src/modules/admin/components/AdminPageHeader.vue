<script setup lang="ts">
import type { Component } from 'vue'
import { Plus } from '@element-plus/icons-vue'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    actionLabel?: string
    actionIcon?: Component
    actionLoading?: boolean
    showAction?: boolean
  }>(),
  {
    actionIcon: Plus,
    showAction: true,
  },
)

defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="admin-page-header">
    <div class="admin-page-header__main">
      <h1 class="admin-page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="admin-page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="showAction && actionLabel" class="admin-page-header__actions">
      <slot name="actions">
        <el-button type="primary" :icon="actionIcon" :loading="actionLoading" @click="$emit('action')">
          {{ actionLabel }}
        </el-button>
      </slot>
    </div>
  </div>
</template>
