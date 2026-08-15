<script setup lang="ts">
import { ADMIN_OVERVIEW_FEATURE_CARDS, ADMIN_OVERVIEW_QUICK_CARDS } from '@/modules/admin/constants'
</script>

<template>
  <el-row :gutter="16">
    <el-col v-for="card in ADMIN_OVERVIEW_QUICK_CARDS" :key="card.title" :xs="24" :sm="12" :lg="8">
      <el-card shadow="never">
        <el-text size="large" tag="b">{{ card.title }}</el-text>
        <el-text type="info" size="small">{{ card.description }}</el-text>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="16" style="margin-top: 16px">
    <el-col v-for="card in ADMIN_OVERVIEW_FEATURE_CARDS" :key="card.title" :xs="24" :sm="12" :lg="6">
      <el-card shadow="never">
        <el-text size="large" tag="b">{{ card.title }}</el-text>
        <el-text type="info" size="small">{{ card.description }}</el-text>
      </el-card>
    </el-col>
  </el-row>
</template>
