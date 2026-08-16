<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
import AdminEmptyState from '@/modules/admin/components/AdminEmptyState.vue'
import AdminPageHeader from '@/modules/admin/components/AdminPageHeader.vue'
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="系统设置" subtitle="站点配置与后台偏好设置" :show-action="false" />
    <div class="admin-page__card">
      <AdminEmptyState title="暂无系统设置" description="系统设置接口接入后将在此提供配置项管理。">
        <template #icon>
          <el-icon><Setting /></el-icon>
        </template>
      </AdminEmptyState>
    </div>
  </div>
</template>
