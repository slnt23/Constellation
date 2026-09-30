<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { AiConversation } from '@/modules/ai/types'

defineProps<{
  conversations: AiConversation[]
  activeConversationId: string
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'select', id: string): void
  (e: 'delete', id: string): void
}>()

const openMenuId = ref('')

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? '' : id
}

const closeMenu = () => {
  openMenuId.value = ''
}

const onDelete = (id: string) => {
  closeMenu()
  emit('delete', id)
}

const onDocumentClick = () => {
  closeMenu()
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', onDocumentClick)
}

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onDocumentClick)
  }
})
</script>

<template>
  <aside class="chat-sidebar">
    <div class="chat-sidebar__header">
      <button type="button" class="chat-sidebar__new" @click="emit('create')">新建会话</button>
    </div>

    <div class="chat-sidebar__list u-scrollbar-hidden">
      <div v-for="item in conversations" :key="item.id" class="chat-sidebar__item-wrapper">
        <button type="button" class="chat-sidebar__item"
          :class="{ 'chat-sidebar__item--active': item.id === activeConversationId }" @click="emit('select', item.id)">
          <h3>{{ item.title }}</h3>
          <p>{{ item.preview }}</p>
        </button>
        <div class="chat-sidebar__menu-anchor">
          <button type="button" class="chat-sidebar__more" @click.stop="toggleMenu(item.id)">...</button>
          <div v-if="openMenuId === item.id" class="chat-sidebar__dropdown">
            <button type="button" class="chat-sidebar__dropdown-item chat-sidebar__dropdown-item--danger" @click.stop="onDelete(item.id)">删除会话</button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.chat-sidebar {
  display: grid;
  grid-template-rows: auto 1fr;
  background: #ffffff;
}

.chat-sidebar__header {
  padding: 16px;
  /* {spacing.md} */
  border-bottom: 1px solid #e6dfd8;
  /* {colors.hairline} */
}

.chat-sidebar__new {
  width: 100%;
  padding: 12px 16px;
  /* {spacing.sm} */
  border: 1px solid #e6dfd8;
  /* {colors.hairline} */
  border-radius: 8px;
  /* {rounded.md} */
  background: #faf9f5;
  /* {colors.canvas} */
  color: #141413;
  /* {colors.ink} */
  font-family: 'StyreneB', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  line-height: 1;
}

.chat-sidebar__new:hover {
  background: #f5f0e8;
  /* {colors.surface-soft} */
}

.chat-sidebar__list {
  display: grid;
  align-content: start;
  gap: 4px;
  /* {spacing.xxs} */
  padding: 8px;
  /* {spacing.xs} */
  overflow: auto;
}

.chat-sidebar__item-wrapper {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
}

.chat-sidebar__item-wrapper:hover .chat-sidebar__more {
  opacity: 1;
}

.chat-sidebar__item {
  display: grid;
  gap: 4px;
  /* {spacing.xxs} */
  padding: 12px;
  /* {spacing.sm} */
  border: 1px solid transparent;
  border-radius: 8px;
  /* {rounded.md} */
  background: transparent;
  text-align: left;
}

.chat-sidebar__item:hover {
  background: #f5f0e8;
  /* {colors.surface-soft} */
}

.chat-sidebar__item--active {
  border-color: #e6dfd8;
  /* {colors.hairline} */
  background: #efe9de;
  /* {colors.surface-card} */
}

.chat-sidebar__item h3 {
  margin: 0;
  font-family: 'StyreneB', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #141413;
  /* {colors.ink} */
  line-height: 1.4;
}

.chat-sidebar__item p {
  margin: 0;
  font-family: 'StyreneB', 'Inter', sans-serif;
  font-size: 13px;
  color: #6c6a64;
  /* {colors.muted} */
  line-height: 1.4;
}

.chat-sidebar__menu-anchor {
  position: relative;
}

.chat-sidebar__more {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #8e8b82;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
}

.chat-sidebar__more:hover {
  background: #e6dfd8;
  color: #141413;
}

.chat-sidebar__dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 10;
  min-width: 120px;
  padding: 4px;
  border: 1px solid #e6dfd8;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.chat-sidebar__dropdown-item {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #141413;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.chat-sidebar__dropdown-item:hover {
  background: #f5f0e8;
}

.chat-sidebar__dropdown-item--danger {
  color: #d14343;
}

.chat-sidebar__dropdown-item--danger:hover {
  background: #fdf2f2;
}
</style>
