<script setup lang="ts">
import { Monitor } from '@element-plus/icons-vue'
import AdminEmptyState from '@/modules/admin/components/AdminEmptyState.vue'
import AdminPageHeader from '@/modules/admin/components/AdminPageHeader.vue'
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="控制台总览" subtitle="系统运行概览与关键指标" :show-action="false" />
    <div class="admin-page__card">
      <AdminEmptyState title="暂无统计数据" description="统计接口接入后将在此展示控制台指标与图表。">
        <template #icon>
          <el-icon><Monitor /></el-icon>
        </template>
      </AdminEmptyState>
    </div>
  </div>
</template>
