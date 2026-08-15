<script setup lang="ts">

import type { Component } from 'vue'
import { computed, ref } from 'vue'

import {
  ArrowDown,
  Bell,
  Box,
  Brush,
  ChatDotRound,
  CreditCard,
  FolderOpened,
  Compass,
  Key,
  Lock,
  Message,
  Monitor,
  OfficeBuilding,
  Setting,
  Share,
  User,
  View,
} from '@element-plus/icons-vue'

// 导入类型定义
import type { IconKey, NavSection, NavItem } from '@/shared/types'

/**
 * 组件属性定义
 */
const props = withDefaults(
  defineProps<{
    modelValue: string                    // 当前激活的导航项ID
    sections: NavSection[]                // 导航区块配置（暂时注释）
    titleLine: string                    // 标题行文本
    subtitleLine: string                 // 副标题文本
    avatarUrl?: string | null            // 头像URL（可选）
    avatarInitial?: string               // 头像占位字母（可选）
  }>(),
  {
    // sections: () => [],                // 导航区块默认值（暂时注释）
    avatarUrl: null,                     // 头像URL默认为null
    avatarInitial: '?',                  // 头像占位字母默认为问号
  },
)

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  'update:modelValue': [id: string]  // 导航项点击事件，更新激活状态
}>()

/**
 * 响应式数据：记录展开/收起状态的导航项
 * key: 导航项ID, value: 是否展开
 */
const expandedIds = ref<Record<string, boolean>>({})

/**
 * 图标组件映射表
 * 将图标键名映射到对应的 Element Plus 图标组件
 */
const iconComponents: Record<IconKey, Component> = {
  user: User,              // 用户图标
  setting: Setting,        // 设置图标
  brush: Brush,            // 画笔图标（外观）
  view: View,              // 视图图标（辅助功能）
  bell: Bell,              // 铃铛图标（通知）
  creditCard: CreditCard,  // 信用卡图标
  message: Message,        // 消息图标
  lock: Lock,              // 锁图标（安全）
  monitor: Monitor,        // 显示器图标
  key: Key,                // 钥匙图标
  officeBuilding: OfficeBuilding,  // 办公楼图标
  compass: Compass,        // 指南针图标
  chatWarning: ChatDotRound, // 聊天警告图标
  folder: FolderOpened,    // 文件夹图标
  share: Share,            // 分享图标
  box: Box,                // 盒子图标
}

/**
 * 根据图标键名解析对应的图标组件
 * @param key - 图标键名
 * @returns 对应的图标组件
 */
const resolveIcon = (key: IconKey): Component => iconComponents[key]

/**
 * 计算属性：处理后的头像URL（去除前后空格）
 */
const resolvedAvatarUrl = computed(() => (props.avatarUrl ?? '').trim())

/**
 * 计算属性：是否显示头像图片（有有效URL时显示）
 */
const showAvatarImage = computed(() => resolvedAvatarUrl.value.length > 0)

/**
 * 检查指定导航项是否展开
 * @param id - 导航项ID
 * @returns 是否展开
 */
const isExpanded = (id: string) => !!expandedIds.value[id]

/**
 * 切换导航项的展开/收起状态
 * @param item - 导航项对象
 */
const toggleExpand = (item: NavItem) => {
  if (!item.expandable) return  // 不可展开的项直接返回
  expandedIds.value = {
    ...expandedIds.value,
    [item.id]: !expandedIds.value[item.id],  // 切换展开状态
  }
}

/**
 * 导航项点击事件处理
 * @param item - 被点击的导航项
 */
const onRowClick = (item: NavItem) => {
  if (item.disabled) return  // 禁用项不响应点击

  // 处理可展开项
  if (item.expandable) {
    toggleExpand(item)
    if (item.navigable === false) return  // 不可导航的展开项只切换展开状态
  }

  if (item.navigable === false) return  // 不可导航项不触发导航

  // 触发导航事件，更新激活状态
  emit('update:modelValue', item.id)
}
</script>

<template>
  <!-- 设置侧边栏容器 -->
  <aside class="ps-sidebar" aria-label="设置导航">
    <!-- 头部区域：用户信息展示 -->
    <div class="ps-sidebar__header">
      <!-- 头像显示：有图片时显示图片，否则显示字母 -->
      <div v-if="showAvatarImage" class="ps-sidebar__avatar ps-sidebar__avatar--img">
        <img :src="resolvedAvatarUrl" alt="用户头像" />
      </div>
      <div v-else class="ps-sidebar__avatar ps-sidebar__avatar--text" aria-hidden="true">
        {{ avatarInitial }}
      </div>
      <!-- 用户信息文本 -->
      <div class="ps-sidebar__header-text">
        <div class="ps-sidebar__title-line">{{ titleLine }}</div>
        <div class="ps-sidebar__subtitle">{{ subtitleLine }}</div>
      </div>
    </div>

    <!-- 导航区域：菜单列表 -->
    <nav class="ps-sidebar__nav">
      <!-- 遍历导航区块 -->
      <template v-for="(section, sIdx) in sections" :key="sIdx">
        <!-- 区块分隔线（非第一个区块前显示） -->
        <div v-if="sIdx > 0" class="ps-sidebar__divider" role="presentation" />
        <!-- 区块标题 -->
        <p v-if="section.title" class="ps-sidebar__section-title">{{ section.title }}</p>
        <!-- 导航项列表 -->
        <ul class="ps-sidebar__list" role="list">
          <li v-for="item in section.items" :key="item.id" class="ps-sidebar__li" role="none">
            <!-- 导航项按钮 -->
            <button type="button" class="ps-sidebar__item" :class="{
              'ps-sidebar__item--active': item.id === modelValue && item.navigable !== false,  // 激活状态
              'ps-sidebar__item--disabled': item.disabled,  // 禁用状态
            }" :disabled="item.disabled" role="menuitem" @click="onRowClick(item)">
              <!-- 激活状态指示条 -->
              <span class="ps-sidebar__item-border" aria-hidden="true" />
              <!-- 图标 -->
              <el-icon class="ps-sidebar__icon" :size="16">
                <component :is="resolveIcon(item.icon)" />
              </el-icon>
              <!-- 标签文本 -->
              <span class="ps-sidebar__label">{{ item.label }}</span>
              <!-- 徽章（新功能提示等） -->
              <span v-if="item.badge" class="ps-sidebar__badge">{{ item.badge }}</span>
              <!-- 展开/收起箭头（可展开项显示） -->
              <el-icon v-if="item.expandable" class="ps-sidebar__chevron"
                :class="{ 'ps-sidebar__chevron--open': isExpanded(item.id) }" :size="14">
                <ArrowDown />
              </el-icon>
            </button>
          </li>
        </ul>
      </template>
    </nav>

    <!-- 底部区域：自定义内容（如退出登录按钮） -->
    <div v-if="$slots.footer" class="ps-sidebar__footer">
      <slot name="footer" />
    </div>
  </aside>
</template>

<style scoped lang="scss">
/**
 * 侧边栏容器样式
 */
.ps-sidebar {
  --ps-border: #ebebeb;
  --ps-muted: #888888;
  --ps-text: #171717;
  --ps-active-bg: #fafafa;
  --ps-active-bar: #171717;
  --ps-row-hover: #f5f5f5;

  box-sizing: border-box;
  width: 100%;
  max-width: 320px;
  min-width: 0;
  padding: 16px 0 20px;
  background: #ffffff;
  border: 1px solid var(--ps-border);
  border-radius: 8px;
}

/**
 * 头部区域样式
 */
.ps-sidebar__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px 20px;
}

/**
 * 头像容器样式
 */
.ps-sidebar__avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--ps-border);
}

/**
 * 图片头像样式
 */
.ps-sidebar__avatar--img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/**
 * 文字头像样式（渐变背景）
 */
.ps-sidebar__avatar--text {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #007cf0 0%, #00dfd8 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
}

/**
 * 头部文本容器样式
 */
.ps-sidebar__header-text {
  min-width: 0;
  /* 防止文本溢出 */
}

/**
 * 标题行样式
 */
.ps-sidebar__title-line {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ps-text);
  word-break: break-word;
  letter-spacing: -0.28px;
}

/**
 * 副标题样式
 */
.ps-sidebar__subtitle {
  margin-top: 4px;
  font-size: 12px;
  line-height: 16px;
  color: var(--ps-muted);
}

/**
 * 导航区域样式
 */
.ps-sidebar__nav {
  padding: 0 8px;
}

/**
 * 区块分隔线样式
 */
.ps-sidebar__divider {
  height: 1px;
  margin: 12px 8px 14px;
  background: var(--ps-border);
}

/**
 * 区块标题样式（大写字母）
 */
.ps-sidebar__section-title {
  margin: 0 8px 6px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--ps-muted);
}

/**
 * 导航列表样式
 */
.ps-sidebar__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ps-sidebar__li {
  margin: 0;
}

/**
 * 导航项按钮样式
 */
.ps-sidebar__item {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 8px 12px 8px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--ps-text);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.12s ease;

  &:hover:not(:disabled) {
    background: var(--ps-row-hover);
  }
}

/**
 * 禁用状态导航项样式
 */
.ps-sidebar__item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/**
 * 激活状态指示条样式
 */
.ps-sidebar__item-border {
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  border-radius: 2px;
  background: transparent;
  pointer-events: none;
}

/**
 * 激活状态导航项样式
 */
.ps-sidebar__item--active {
  background: var(--ps-active-bg);
  font-weight: 500;

  .ps-sidebar__item-border {
    background: var(--ps-active-bar);
  }
}

/**
 * 导航项图标样式
 */
.ps-sidebar__icon {
  flex-shrink: 0;
  color: var(--ps-muted);
}

/**
 * 激活状态图标颜色
 */
.ps-sidebar__item--active .ps-sidebar__icon {
  color: var(--ps-text);
}

/**
 * 导航项标签文本样式
 */
.ps-sidebar__label {
  flex: 1;
  min-width: 0;
  /* 防止文本溢出 */
}

/**
 * 徽章样式（新功能提示等）
 */
.ps-sidebar__badge {
  flex-shrink: 0;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #4d4d4d;
  background: #fafafa;
  border: none;
}

/**
 * 展开/收起箭头样式
 */
.ps-sidebar__chevron {
  flex-shrink: 0;
  color: var(--ps-muted);
  transition: transform 0.15s ease;
}

/**
 * 展开状态箭头样式（旋转180度）
 */
.ps-sidebar__chevron--open {
  transform: rotate(-180deg);
}

/**
 * 底部区域样式
 */
.ps-sidebar__footer {
  margin-top: 16px;
  padding: 14px 16px 0;
  border-top: 1px solid var(--ps-border);
}
</style>