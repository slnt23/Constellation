<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { updateAvatarApi } from '@/modules/user/api/profile'
import type { UserInfoVO } from '@/shared/types'


import {
  EXAMPLE_PUBLIC_PROFILE_EMAIL_OPTIONS,
  // EXAMPLE_PUBLIC_PROFILE_HINTS,
  // EXAMPLE_PUBLIC_PROFILE_PRONOUNS_OPTIONS,
} from '@/modules/user/constants'

const hints = {
  displayUserName: '你的姓名可能会显示在站点中你参与协作或被提及的位置，可随时修改或清空。',
  displayName: '你的昵称可能会显示在站点中你参与协作或被提及的位置，可随时修改或清空。',
  publicEmail: '你已将邮箱设为私密。要调整展示方式，请到「邮箱设置」中取消勾选「对外隐藏邮箱」。',
  bio: '可以记录一些个人简介信息，',
  // pronouns: '',
  // websiteUrl: '',
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
// const pronounsOptions = EXAMPLE_PUBLIC_PROFILE_PRONOUNS_OPTIONS

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
  <section class="public-profile">
    <header class="public-profile__head">
      <div class="public-profile__head-text">
        <h3 class="public-profile__title">公开资料</h3>
        <div class="public-profile__rule" />
      </div>
      <!--      <button type="button" class="public-profile__ghost-btn" @click="goPersonalProfile">-->
      <!--        前往个人主页-->
      <!--      </button>-->
    </header>

    <div class="public-profile__grid">
      <div class="public-profile__form">

        <div class="field">
          <label class="field__label" for="pp-display-name">用户名</label>
          <input id="pp-display-name" v-model="formState.userName" type="text" class="field__control"
            autocomplete="name" />
          <p class="field__hint">{{ hints.displayUserName }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="pp-display-name">昵称</label>
          <input id="pp-display-name" v-model="formState.nickname" type="text" class="field__control"
            autocomplete="name" />
          <p class="field__hint">{{ hints.displayName }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="pp-public-email">公开邮箱</label>
          <select id="pp-public-email" v-model="formState.email" class="field__control field__select">
            <option v-for="opt in emailOptionsResolved" :key="`${opt.value}-${opt.label}`" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <p class="field__hint">
            {{ hints.publicEmail }}
            <button type="button" class="field__hint-link" @click="emit('email-settings')">邮箱设置</button>
          </p>
        </div>

        <div class="field">
          <label class="field__label" for="pp-url">手机号</label>
          <input id="pp-url" v-model="formState.phone" class="field__control" autocomplete="url"
            placeholder="https://" />
        </div>

        <div class="field">
          <label class="field__label" for="pp-bio">备注/个人简介</label>
          <textarea id="pp-bio" v-model="formState.remark" class="field__control field__textarea" rows="5" />
          <p class="field__hint">{{ hints.bio }}</p>
        </div>

        <!--        <div class="field">-->
        <!--          <label class="field__label" for="pp-pronouns">人称代词</label>-->
        <!--          <select id="pp-pronouns" v-model="formState.pronouns" class="field__control field__select">-->
        <!--            <option v-for="opt in pronounsOptions" :key="opt.label" :value="opt.value">-->
        <!--              {{ opt.label }}-->
        <!--            </option>-->
        <!--    type="url"      </select>-->
        <!--        </div>-->

        <div class="public-profile__actions">
          <button type="button" class="public-profile__submit" @click="handleConfirmUpdate">
            确认更新
          </button>
        </div>
      </div>

      <aside class="public-profile__aside">
        <span class="field__label public-profile__aside-label">头像</span>
        <div class="public-profile__avatar-wrap">
          <div v-if="formState.avatarUrl" class="public-profile__avatar-ring">
            <img :src="formState.avatarUrl" alt="默认头像" class="public-profile__avatar-img" />
          </div>
          <div v-else class="public-profile__avatar-ring public-profile__avatar-ring--placeholder">
            {{ formState.nickname?.trim().slice(0, 1) || formState.userName?.trim().slice(0, 1) || '用' }}
          </div>
          <input ref="avatarInput" type="file" accept="image/jpeg,image/png,image/webp"
            class="public-profile__avatar-input" @change="handleAvatarChange" />
          <button type="button" class="public-profile__edit-avatar" :disabled="avatarUploading"
            @click="avatarInput?.click()">
            {{ avatarUploading ? '上传中...' : '更换' }}
          </button>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.public-profile {
  --pp-border: #ebebeb;
  --pp-bg: #fafafa;
  --pp-hint: #888888;
  --pp-primary: #171717;
  --pp-primary-hover: #171717;
  --pp-link: #0070f3;

  min-width: 0;
}

.public-profile__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.public-profile__title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #171717;
  letter-spacing: -0.96px;
}

.public-profile__rule {
  height: 1px;
  background: var(--pp-border);
  max-width: 100%;
}

.public-profile__ghost-btn {
  flex-shrink: 0;
  margin-top: 2px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #171717;
  background: #ffffff;
  border: 1px solid var(--pp-border);
  border-radius: 100px;
  cursor: pointer;
  white-space: nowrap;
  height: 28px;

  &:hover {
    background: var(--pp-bg);
  }
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
  gap: 24px;
  min-width: 0;
}

.field__label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #171717;
  line-height: 20px;
}

.field__control {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0 12px;
  font-size: 14px;
  line-height: 20px;
  color: #171717;
  background: #ffffff;
  border: 1px solid var(--pp-border);
  border-radius: 6px;
  outline: none;
  height: 40px;

  &:focus {
    border-color: #171717;
    box-shadow: 0 0 0 3px rgba(23, 23, 23, 0.1);
  }
}

.field__textarea {
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  padding-top: 10px;
  padding-bottom: 10px;
}

.field__select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2365768a' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;
}

.field__hint {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--pp-hint);
}

.field__hint-link {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: inherit;
  color: var(--pp-link);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #0761d1;
  }
}

.public-profile__actions {
  margin-top: 4px;
}

.public-profile__submit {
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
  background: var(--pp-primary);
  border: none;
  border-radius: 100px;
  cursor: pointer;
  height: 32px;

  &:hover {
    opacity: 0.9;
  }
}

.public-profile__aside {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}

.public-profile__aside-label {
  margin-bottom: 0;
}

.public-profile__avatar-wrap {
  position: relative;
  width: 100%;
  max-width: 280px;
}

.public-profile__avatar-ring {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--pp-border);
  background: var(--pp-bg);
}

.public-profile__avatar-ring--placeholder {
  display: grid;
  place-items: center;
  font-size: 4.5rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #007cf0 0%, #00dfd8 100%);
  border: none;
}

.public-profile__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.public-profile__avatar-input {
  display: none;
}

.public-profile__edit-avatar {
  position: absolute;
  left: 8px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #171717;
  background: #ffffff;
  border: 1px solid var(--pp-border);
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05), 0 2px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    background: var(--pp-bg);
  }
}

@media (max-width: 900px) {
  .public-profile__grid {
    grid-template-columns: 1fr;
  }

  .public-profile__avatar-wrap {
    max-width: 220px;
  }
}

@media (max-width: 600px) {
  .public-profile__head {
    flex-direction: column;
    align-items: stretch;
  }

  .public-profile__ghost-btn {
    width: fit-content;
  }
}
</style>
