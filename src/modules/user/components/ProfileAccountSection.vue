<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { sendCodeApi } from '@/modules/user/api/auth'
import { bindEmailApi, getUserInfoApi, updatePasswordApi, updateUserInfoApi } from '@/modules/user/api/profile'
import { setCurrentUser } from '@/core/permission'

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
    <el-card class="account-settings" shadow="never">
        <template #header>
            <h3 class="account-settings__title">账户设置</h3>
        </template>

        <el-form class="account-settings__form" label-position="top">
            <el-form-item label="手机号">
                <div class="account-settings__input-group">
                    <el-input v-model="phone" type="tel" placeholder="请输入新手机号" class="account-settings__input" />
                    <el-button type="primary" :loading="phoneLoading" @click="handleUpdatePhone">
                        更新
                    </el-button>
                </div>
                <div class="account-settings__hint">更新后将用于登录和接收通知</div>
            </el-form-item>

            <el-form-item label="邮箱">
                <div class="account-settings__input-group">
                    <el-input v-model="newEmail" type="email" placeholder="请输入新邮箱" class="account-settings__input" />
                    <el-button :loading="emailCodeLoading" @click="handleSendEmailCode">
                        发送验证码
                    </el-button>
                </div>
                <div class="account-settings__input-group">
                    <el-input v-model="emailCode" placeholder="请输入验证码" class="account-settings__input" />
                    <el-button type="primary" :loading="emailBindingLoading" @click="handleBindEmail">
                        绑定
                    </el-button>
                </div>
                <div class="account-settings__hint">绑定后使用新邮箱登录和接收通知邮件</div>
            </el-form-item>

            <el-form-item label="密码">
                <div class="account-settings__input-group">
                    <el-input v-model="oldPassword" type="password" show-password placeholder="请输入旧密码（未设置可留空）"
                        class="account-settings__input" />
                </div>
                <div class="account-settings__input-group">
                    <el-input v-model="newPassword" type="password" show-password placeholder="请输入新密码（8-64 位，含字母和数字）"
                        class="account-settings__input" />
                    <el-button type="primary" :loading="passwordLoading" @click="handleUpdatePassword">
                        更新
                    </el-button>
                </div>
                <div class="account-settings__hint">更新后将用于登录</div>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<style scoped lang="scss">
.account-settings {
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

.account-settings__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--el-text-color-primary);
}

.account-settings__form {
    display: flex;
    flex-direction: column;
    gap: 24px;

    :deep(.el-form-item) {
        margin-bottom: 0;
    }

    :deep(.el-form-item__label) {
        font-weight: 500;
    }
}

.account-settings__input-group {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    &:not(:last-child) {
        margin-bottom: 12px;
    }
}

.account-settings__input {
    flex: 1;
}

.account-settings__hint {
    margin-top: 8px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
}
</style>