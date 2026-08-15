<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import { bindEmailApi, getUserInfoApi, sendCodeApi, updatePasswordApi, updateUserInfoApi } from '@/api'
import { setCurrentUser } from '@/utils/auth'

const phone = ref('')
const newEmail = ref('')
const emailCode = ref('')
const oldPassword = ref('')
const newPassword = ref('')

const phoneLoading = ref(false)
const emailCodeLoading = ref(false)
const emailBindingLoading = ref(false)
const passwordLoading = ref(false)

const refreshUser = async () => {
  const res = await getUserInfoApi()
  if (res.code === 200) {
    setCurrentUser(res.data)
    phone.value = res.data.phone || ''
  }
}

const handleUpdatePhone = async () => {
  const value = phone.value.trim()
  if (!value) {
    ElMessage.warning('请输入手机号')
    return
  }

  phoneLoading.value = true
  try {
    await updateUserInfoApi({ phone: value })
    ElMessage.success('手机号已更新')
    await refreshUser()
  } catch (error) {
    ElMessage.error((error as Error).message || '更新失败，请稍后重试')
  } finally {
    phoneLoading.value = false
  }
}

const handleSendEmailCode = async () => {
  const email = newEmail.value.trim()
  if (!email) {
    ElMessage.warning('请输入新邮箱')
    return
  }

  emailCodeLoading.value = true
  try {
    const res = await sendCodeApi({ email })
    if (res.code === 200) {
      ElMessage.success('验证码已发送，请检查新邮箱')
    }
  } catch (error) {
    ElMessage.error((error as Error).message || '验证码发送失败，请稍后重试')
  } finally {
    emailCodeLoading.value = false
  }
}

const handleBindEmail = async () => {
  const email = newEmail.value.trim()
  const code = emailCode.value.trim()
  if (!email || !code) {
    ElMessage.warning('请填写新邮箱和验证码')
    return
  }

  emailBindingLoading.value = true
  try {
    await bindEmailApi({ newEmail: email, code })
    ElMessage.success('邮箱已绑定')
    newEmail.value = ''
    emailCode.value = ''
    await refreshUser()
  } catch (error) {
    ElMessage.error((error as Error).message || '邮箱绑定失败，请稍后重试')
  } finally {
    emailBindingLoading.value = false
  }
}

const handleUpdatePassword = async () => {
  if (!newPassword.value) {
    ElMessage.warning('请输入新密码')
    return
  }

  passwordLoading.value = true
  try {
    await updatePasswordApi({
      oldPassword: oldPassword.value || undefined,
      newPassword: newPassword.value,
    })
    ElMessage.success('密码已更新')
    oldPassword.value = ''
    newPassword.value = ''
  } catch (error) {
    ElMessage.error((error as Error).message || '密码更新失败，请稍后重试')
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <ElForm class="account-settings-form" label-position="top">
    <ElFormItem label="手机号" class="form-field">
      <div class="input-group">
        <ElInput v-model="phone" type="tel" placeholder="请输入新手机号" class="custom-input" />
        <ElButton type="primary" class="update-btn" :loading="phoneLoading" @click="handleUpdatePhone">
          更新
        </ElButton>
      </div>
      <p class="field-hint">更新后将用于登录和接收通知</p>
    </ElFormItem>

    <ElFormItem label="邮箱" class="form-field">
      <div class="input-group">
        <ElInput v-model="newEmail" type="email" placeholder="请输入新邮箱" class="custom-input" />
        <ElButton class="update-btn update-btn--secondary" :loading="emailCodeLoading" @click="handleSendEmailCode">
          发送验证码
        </ElButton>
      </div>
      <div class="input-group email-code-group">
        <ElInput v-model="emailCode" placeholder="请输入验证码" class="custom-input" />
        <ElButton type="primary" class="update-btn" :loading="emailBindingLoading" @click="handleBindEmail">
          绑定
        </ElButton>
      </div>
      <p class="field-hint">绑定后使用新邮箱登录和接收通知邮件</p>
    </ElFormItem>

    <ElFormItem label="密码" class="form-field">
      <div class="input-group">
        <ElInput v-model="oldPassword" type="password" show-password
          placeholder="请输入旧密码（未设置可留空）" class="custom-input" />
      </div>
      <div class="input-group">
        <ElInput v-model="newPassword" type="password" show-password
          placeholder="请输入新密码（8-64 位，含字母和数字）" class="custom-input" />
        <ElButton type="primary" class="update-btn" :loading="passwordLoading" @click="handleUpdatePassword">
          更新
        </ElButton>
      </div>
      <p class="field-hint">更新后将用于登录</p>
    </ElFormItem>
  </ElForm>
</template>

<style scoped lang="scss">
.account-settings-form {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
    font-weight: 500;
    color: #171717;
    padding-bottom: 8px;
    line-height: 20px;
  }
}

/* 输入框 + 按钮组合 */
.input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.email-code-group {
  margin-top: 12px;
}

.custom-input {
  flex: 1;
  --el-input-bg-color: #ffffff;
  --el-input-border-color: #ebebeb;
  --el-input-border-radius: 6px;
  --el-input-height: 40px;

  &:focus {
    --el-input-border-color: #171717;
    box-shadow: 0 0 0 3px rgba(23, 23, 23, 0.1);
  }
}

.update-btn {
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  white-space: nowrap;
  background-color: #171717;
  border-color: #171717;
  border-radius: 100px;

  &:hover {
    background-color: #171717;
    border-color: #171717;
    opacity: 0.9;
  }

  &--secondary {
    background-color: #ffffff;
    border-color: #171717;
    color: #171717;

    &:hover {
      background-color: #f5f5f5;
      border-color: #171717;
      color: #171717;
      opacity: 1;
    }
  }
}

.field-hint {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #888888;
  line-height: 16px;
}

.account-settings-form {
  padding: 0;
}
</style>
