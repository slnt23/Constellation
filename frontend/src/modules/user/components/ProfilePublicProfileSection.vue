<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { updateAvatarApi } from '@/modules/user/api/profile'
import type { UserInfoVO } from '@/shared/types'

import {
  EXAMPLE_PUBLIC_PROFILE_EMAIL_OPTIONS,
} from '@/modules/user/constants'

const hints = {
  displayUserName: '你的姓名可能会显示在站点中你参与协作或被提及的位置，可随时修改或清空。',
  displayName: '你的昵称可能会显示在站点中你参与协作或被提及的位置，可随时修改或清空。',
  publicEmail: '你已将邮箱设为私密。要调整展示方式，请到「邮箱设置」中取消勾选「对外隐藏邮箱」。',
  bio: '可以记录一些个人简介信息，',
}

const props = defineProps<{
  profile: UserInfoVO
}>()

const emit = defineEmits<{
  save: [profile: UserInfoVO]
  avatarUpdated: [avatarUrl: string]
  'email-settings': []
}>()

const router = useRouter()
const avatarUploading = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)

const formState = reactive<UserInfoVO>({
  userName: '',
  nickname: '',
  email: '',
  phone: '',
  remark: '',
  role: '',
  avatarUrl: '',
  id: 0,
  userCode: '',
  createTime: '',
})

const emailOptionsBase = EXAMPLE_PUBLIC_PROFILE_EMAIL_OPTIONS

const emailOptionsResolved = computed(() => {
  const val = formState.email
  const list = [...emailOptionsBase]
  if (val && !list.some((o) => o.value === val)) {
    list.splice(1, 0, { value: val, label: val })
  }
  return list
})

const syncFormState = (profile: UserInfoVO) => {
  formState.userName = profile.userName
  formState.nickname = profile.nickname
  formState.email = profile.email
  formState.remark = profile.remark
  formState.phone = profile.phone
  formState.role = profile.role
  formState.avatarUrl = profile.avatarUrl
  formState.id = profile.id
  formState.userCode = profile.userCode
  formState.createTime = profile.createTime
}

watch(
  () => props.profile,
  (profile) => {
    syncFormState(profile)
  },
  { immediate: true, deep: true },
)

const handleConfirmUpdate = () => {
  emit('save', { ...formState })
}

const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    ElMessage.error('仅支持 jpeg/png/webp 图片')
    input.value = ''
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB')
    input.value = ''
    return
  }

  avatarUploading.value = true
  try {
    const res = await updateAvatarApi(file)
    const avatarUrl = res.data || formState.avatarUrl
    formState.avatarUrl = avatarUrl
    emit('avatarUpdated', avatarUrl)
    ElMessage.success('头像已更新')
  } catch (error) {
    ElMessage.error((error as Error).message || '头像上传失败，请稍后重试')
  } finally {
    avatarUploading.value = false
    input.value = ''
  }
}

const goPersonalProfile = () => {
  router.push({ name: 'front-home' })
}
</script>

<template>
  <el-card class="public-profile" shadow="never">
    <template #header>
      <div class="public-profile__header">
        <h3 class="public-profile__title">公开资料</h3>
      </div>
    </template>

    <div class="public-profile__grid">
      <el-form class="public-profile__form" label-position="top" label-width="auto">
        <el-form-item label="用户名">
          <el-input v-model="formState.userName" placeholder="请输入用户名" clearable />
          <div class="public-profile__hint">{{ hints.displayUserName }}</div>
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="formState.nickname" placeholder="请输入昵称" clearable />
          <div class="public-profile__hint">{{ hints.displayName }}</div>
        </el-form-item>

        <el-form-item label="公开邮箱">
          <el-select v-model="formState.email" placeholder="选择已验证邮箱以展示" style="width: 100%">
            <el-option v-for="opt in emailOptionsResolved" :key="`${opt.value}-${opt.label}`" :value="opt.value"
              :label="opt.label" />
          </el-select>
          <div class="public-profile__hint">
            {{ hints.publicEmail }}
            <el-button type="primary" link @click="emit('email-settings')">邮箱设置</el-button>
          </div>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="formState.phone" placeholder="请输入手机号" clearable />
        </el-form-item>

        <el-form-item label="备注/个人简介">
          <el-input v-model="formState.remark" type="textarea" :rows="5" placeholder="请输入个人简介" />
          <div class="public-profile__hint">{{ hints.bio }}</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleConfirmUpdate">
            确认更新
          </el-button>
        </el-form-item>
      </el-form>

      <aside class="public-profile__aside">
        <span class="public-profile__aside-label">头像</span>
        <div class="public-profile__avatar-wrap">
          <el-avatar :size="200" :src="formState.avatarUrl || undefined" class="public-profile__avatar">
            {{ formState.nickname?.trim().slice(0, 1) || formState.userName?.trim().slice(0, 1) || '用' }}
          </el-avatar>
          <input ref="avatarInput" type="file" accept="image/jpeg,image/png,image/webp"
            class="public-profile__avatar-input" @change="handleAvatarChange" />
          <el-button class="public-profile__edit-avatar" :loading="avatarUploading" @click="avatarInput?.click()">
            {{ avatarUploading ? '上传中...' : '更换' }}
          </el-button>
        </div>
      </aside>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.public-profile {
  border: none;
  background: transparent;

  :deep(.el-card__header) {
    padding: 0 0 20px;
    border-bottom: none;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.public-profile__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.public-profile__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.public-profile__grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
  gap: 32px;
  align-items: start;
}

.public-profile__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}

.public-profile__hint {
  margin-top: 8px;
  font-size: 12px;
  line-height: 16px;
  color: var(--el-text-color-secondary);

  .el-button {
    padding: 0;
    margin-left: 4px;
  }
}

.public-profile__aside {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.public-profile__aside-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.public-profile__avatar-wrap {
  position: relative;
  width: 200px;
  height: 200px;
}

.public-profile__avatar {
  width: 100%;
  height: 100%;
}

.public-profile__avatar-input {
  display: none;
}

.public-profile__edit-avatar {
  position: absolute;
  left: 8px;
  bottom: 8px;
}

@media (max-width: 900px) {
  .public-profile__grid {
    grid-template-columns: 1fr;
  }

  .public-profile__avatar-wrap {
    width: 160px;
    height: 160px;
  }
}
</style>