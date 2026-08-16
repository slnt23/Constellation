<script setup lang="ts">
import { Folder } from '@element-plus/icons-vue'
import AdminEmptyState from '@/modules/admin/components/AdminEmptyState.vue'
import AdminPageHeader from '@/modules/admin/components/AdminPageHeader.vue'
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="内容管理" subtitle="站点内容模块的统一管理入口" :show-action="false" />
    <div class="admin-page__card">
      <AdminEmptyState title="内容管理模块建设中" description="内容管理接口与页面能力完善后将在此提供编辑入口。">
        <template #icon>
          <el-icon><Folder /></el-icon>
        </template>
      </AdminEmptyState>
    </div>
  </div>
</template>
