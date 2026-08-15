<script setup lang="ts">
import ProfileAccountSection from '@/shared/components/ProfileAccountSection.vue'
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <el-text size="large" tag="b">系统设置</el-text>
    </template>
    <ProfileAccountSection />
  </el-card>
</template>
