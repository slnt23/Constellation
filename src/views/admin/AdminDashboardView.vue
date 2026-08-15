<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SettingsWorkspaceShell from '@/components/dashboard/SettingsWorkspaceShell.vue'
import ProfileAccountSection from '@/components/dashboard/ProfileAccountSection.vue'
import ProfileAppearanceSection from '@/components/dashboard/ProfileAppearanceSection.vue'
import SpotlightManageSection from '@/components/dashboard/SpotlightManageSection.vue'
import FeatureManageSection from '@/components/dashboard/FeatureManageSection.vue'
import UserManageSection from '@/components/dashboard/UserManageSection.vue'
import RoleManageSection from '@/components/dashboard/RoleManageSection.vue'
import SettingsSidebar from '@/components/dashboard/SettingsSidebar.vue'
import {
  ADMIN_DASHBOARD_NAV_SECTIONS,
  // ADMIN_DASHBOARD_SECTION_META,
  ADMIN_OVERVIEW_FEATURE_CARDS,
  ADMIN_OVERVIEW_QUICK_CARDS,
  EXAMPLE_PUBLIC_PROFILE_DEFAULTS,
} from '@/constant'
import type { DashboardSectionId, UserInfoVO } from '@/types'
import { getCurrentUser, logout, onAuthChange } from '@/utils/auth.ts'

import cardImageOne from '@/assets/example/editorial-hero-01.jpg'
import cardImageTwo from '@/assets/example/editorial-hero-02.jpg'
import cardImageThree from '@/assets/example/banner.jpg'

const router = useRouter()
const currentUser = ref<UserInfoVO | null>(getCurrentUser())
const activeSectionId = ref<DashboardSectionId>('overview')
let removeAuthListener = () => { }

const profileName = computed(
  () => currentUser.value?.nickname || currentUser.value?.userName || '管理员',
)
const profileTitleLine = computed(() => {
  const u = currentUser.value
  const nick = (u?.nickname || '').trim()
  const un = (u?.userName || '').trim()
  if (nick && un) return `${nick} (${un})`
  if (nick) return nick
  if (un) return un
  return profileName.value
})
const profileSidebarSubtitle = '管理员后台'


const profileInitial = computed(() => profileName.value.trim().slice(0, 1).toUpperCase() || 'A')

const sidebarAvatarUrl = computed(
  () => (currentUser.value as { avatarUrl?: string } | null)?.avatarUrl?.trim() || EXAMPLE_PUBLIC_PROFILE_DEFAULTS.avatarUrl,
)

// const activeSection = computed(() => ADMIN_DASHBOARD_SECTION_META[activeSectionId.value])

const contentPosts = [
  { image: cardImageOne, title: '内容发布', description: '这里先占位内容编辑与发布流程。', cta: '进入' },
  { image: cardImageTwo, title: '数据维护', description: '这里先占位价格维护、导入与校验。', cta: '进入' },
  { image: cardImageThree, title: '系统日志', description: '这里先占位后台操作日志与告警中心。', cta: '进入' },
]

const handleLogout = () => {
  void logout().then(() => router.push('/'))
}

onMounted(() => {
  removeAuthListener = onAuthChange((user) => {
    currentUser.value = user as UserInfoVO | null
  })
})

onBeforeUnmount(() => {
  removeAuthListener()
})
</script>

<template>
  <SettingsWorkspaceShell>
    <template #sidebar>
      <SettingsSidebar v-model="activeSectionId" :sections="ADMIN_DASHBOARD_NAV_SECTIONS" :title-line="profileTitleLine"
        :subtitle-line="profileSidebarSubtitle" :avatar-url="sidebarAvatarUrl" :avatar-initial="profileInitial">
        <template #footer>
          <button type="button" class="profile-logout" @click="handleLogout">退出登录</button>
        </template>
      </SettingsSidebar>
    </template>

    <div class="profile-content">
      <!--      <header class="profile-content__header">-->
      <!--        <div>-->
      <!--          <p class="eyebrow-label">{{ activeSection.eyebrow }}</p>-->
      <!--          <h2>{{ activeSection.heading }}</h2>-->
      <!--          <p>{{ activeSection.description }}</p>-->
      <!--        </div>-->
      <!--      </header>-->

      <template v-if="activeSectionId === 'overview'">
        <ProfileAppearanceSection :cards="ADMIN_OVERVIEW_QUICK_CARDS" />
        <ProfileAppearanceSection :cards="ADMIN_OVERVIEW_FEATURE_CARDS" />
      </template>

      <section v-else-if="activeSectionId === 'content'" class="admin-posts" aria-label="内容模块占位">
        <article v-for="item in contentPosts" :key="item.title" class="admin-post-card">
          <div class="admin-post-card__img-wrap">
            <img :src="item.image" :alt="item.title" />
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <button type="button" class="admin-post-card__cta">{{ item.cta }}</button>
        </article>
      </section>

      <SpotlightManageSection v-else-if="activeSectionId === 'spotlight'" />

      <FeatureManageSection v-else-if="activeSectionId === 'feature'" />

      <UserManageSection v-else-if="activeSectionId === 'user'" />

      <RoleManageSection v-else-if="activeSectionId === 'role'" />

      <ProfileAccountSection v-else />
    </div>
  </SettingsWorkspaceShell>
</template>

<style scoped lang="scss">
.profile-logout {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: #cf222e;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #ffebe9;
  }
}

.profile-content {
  display: grid;
  gap: 22px;
  min-width: 0;
}

.profile-content__header {
  padding: 8px 4px 0;
  background: transparent;
}

.profile-content__header h2 {
  margin: 4px 0 10px;
  font-size: 2rem;
  color: var(--color-text);
}

.profile-content__header p:last-child {
  margin: 0;
  color: var(--color-text-soft);
  max-width: 720px;
}

.admin-posts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.admin-post-card {
  display: grid;
  gap: 12px;
  padding: 18px 18px 20px;
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.05);
}

.admin-post-card__img-wrap {
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: rgba(15, 23, 42, 0.08);
}

.admin-post-card__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.admin-post-card h3 {
  margin: 0;
  font-size: 1.05rem;
  color: var(--color-text);
}

.admin-post-card p {
  margin: 0;
  color: var(--color-text-soft);
  line-height: 1.65;
  font-size: 0.95rem;
}

.admin-post-card__cta {
  justify-self: start;
  margin-top: 4px;
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.08);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;

  &:hover {
    background: rgba(15, 23, 42, 0.12);
  }
}

@media (max-width: 1120px) {
  .admin-posts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .admin-posts {
    grid-template-columns: 1fr;
  }
}
</style>
