<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import AdminPageHeader from '@/modules/admin/components/AdminPageHeader.vue'
import { useUiTheme, type UiThemeId } from '@/shared/theme'

const { activeTheme, themes, setTheme } = useUiTheme()

const selectTheme = (themeId: UiThemeId) => {
  setTheme(themeId)
}
</script>

<template>
  <div class="admin-page">
    <AdminPageHeader title="系统设置" subtitle="站点配置与后台偏好设置" :show-action="false" />
    <div class="admin-page__card theme-settings">
      <div class="theme-settings__header">
        <div>
          <h2>界面风格</h2>
          <p>选择会立即应用到前台与后台，并保存在当前浏览器中。</p>
        </div>
        <el-tag effect="plain">{{ themes.length }} 个可用主题</el-tag>
      </div>

      <div class="theme-settings__grid" role="radiogroup" aria-label="界面风格">
        <button
          v-for="theme in themes"
          :key="theme.id"
          type="button"
          class="theme-option"
          :class="{ 'is-active': activeTheme === theme.id }"
          role="radio"
          :aria-checked="activeTheme === theme.id"
          @click="selectTheme(theme.id)"
        >
          <span class="theme-option__preview" :style="{ background: theme.preview.background }">
            <span class="theme-option__preview-sidebar" :style="{ background: theme.preview.text }"></span>
            <span class="theme-option__preview-card" :style="{ background: theme.preview.surface }">
              <span :style="{ background: theme.preview.text }"></span>
              <span :style="{ background: theme.preview.primary }"></span>
            </span>
          </span>
          <span class="theme-option__content">
            <span class="theme-option__title">
              {{ theme.name }}
              <el-icon v-if="activeTheme === theme.id"><Check /></el-icon>
            </span>
            <span class="theme-option__description">{{ theme.description }}</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.theme-settings {
  padding: 24px;
}

.theme-settings__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    color: var(--theme-text);
    font-size: 18px;
    font-weight: 600;
  }

  p {
    margin: 8px 0 0;
    color: var(--theme-text-muted);
    font-size: 13px;
  }
}

.theme-settings__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.theme-option {
  display: grid;
  gap: 16px;
  padding: 12px;
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-card);
  background: var(--theme-surface);
  color: var(--theme-text);
  text-align: left;

  &:hover,
  &.is-active {
    border-color: var(--theme-primary);
  }

  &.is-active {
    box-shadow: 0 0 0 2px var(--theme-primary-soft);
  }
}

.theme-option__preview {
  display: grid;
  grid-template-columns: 28% 1fr;
  height: 132px;
  padding: 12px;
  gap: 12px;
  overflow: hidden;
  border: 1px solid var(--theme-border-soft);
  border-radius: calc(var(--theme-radius-card) - 4px);
}

.theme-option__preview-sidebar {
  border-radius: var(--theme-radius-control);
  opacity: 0.92;
}

.theme-option__preview-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 18px;
  border-radius: var(--theme-radius-control);

  span:first-child {
    width: 70%;
    height: 8px;
    border-radius: 999px;
    opacity: 0.78;
  }

  span:last-child {
    width: 54%;
    height: 28px;
    margin-top: auto;
    border-radius: var(--theme-radius-action);
  }
}

.theme-option__content {
  display: grid;
  gap: 6px;
}

.theme-option__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 600;

  .el-icon {
    color: var(--theme-primary);
  }
}

.theme-option__description {
  color: var(--theme-text-muted);
  font-size: 13px;
  line-height: 1.55;
}

@media (max-width: 760px) {
  .theme-settings {
    padding: 16px;
  }

  .theme-settings__header {
    flex-direction: column;
  }
}
</style>
