<script setup lang="ts">
import loginImage from '@/shared/assets/login/user.png'

import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginMailApi, loginPasswordApi, resetPasswordApi, sendCodeApi } from '@/modules/user/api/auth'
import { getUserInfoApi } from '@/modules/user/api/profile'
import { setCurrentUser, setToken } from '@/core/permission'
import { ElMessage } from 'element-plus'
import type { LoginOrRegisterParams, SendCodeParams } from '@/modules/user/types'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])

const submitting = ref(false)
const showReset = ref(false)
const resetSubmitting = ref(false)
const router = useRouter()
const activeTab = ref('mail')

const loginForm = reactive<LoginOrRegisterParams>({
    email: '',
    password: '',
    code: '',
    role: '',
})

const resetForm = reactive({
    email: '',
    code: '',
    newPassword: '',
})

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const submitLoginOrRegister = async (type: 'login' | 'register') => {
    submitting.value = true

    try {
        const result = type === 'register' || activeTab.value === 'mail'
            ? await loginMailApi({ email: loginForm.email, code: loginForm.code ?? '' })
            : await loginPasswordApi({ email: loginForm.email, password: loginForm.password ?? '' })

        if (result.code === 200) {
            visible.value = false

            loginForm.email = ''
            loginForm.password = ''
            loginForm.code = ''

            setToken(result.data)
            const userInfoResult = await getUserInfoApi()

            if (userInfoResult.code === 200) {
                setCurrentUser(userInfoResult.data)
                const isAdmin = userInfoResult.data.role?.toUpperCase() === 'ADMIN'
                await router.push(isAdmin ? { name: 'admin-home-dashboard' } : { name: 'front-home' })
            } else {
                await router.push('/')
            }
        } else {
            ElMessage.error(result.message || '登录失败，请重试')
        }
    } catch (error) {
        ElMessage.error((error as Error).message || '登录失败，请重试')
    } finally {
        submitting.value = false
    }
}

const sendCode = async () => {
    if (!loginForm.email) {
        ElMessage.error('请输入邮箱地址')
        return
    }

    submitting.value = true
    try {
        const sendCodeData = <SendCodeParams>{
            email: loginForm.email,
        }
        const result = await sendCodeApi(sendCodeData)

        if (result.code === 200) {
            ElMessage.success('验证码已发送，请检查邮箱')
        } else {
            ElMessage.error(result.message || '发送验证码失败，请重试')
        }
    } catch (error) {
        ElMessage.error((error as Error).message || '发送验证码失败，请重试')
    } finally {
        submitting.value = false
    }
}

const switchToReset = () => {
    showReset.value = true
    resetForm.email = loginForm.email
    resetSubmitting.value = false
}

const backToLogin = () => {
    showReset.value = false
    resetForm.code = ''
    resetForm.newPassword = ''
}

const sendResetCode = async () => {
    if (!resetForm.email) {
        ElMessage.error('请输入邮箱地址')
        return
    }

    resetSubmitting.value = true
    try {
        const result = await sendCodeApi({ email: resetForm.email })
        if (result.code === 200) {
            ElMessage.success('验证码已发送，请检查邮箱')
        } else {
            ElMessage.error(result.message || '发送验证码失败，请重试')
        }
    } catch (error) {
        ElMessage.error((error as Error).message || '发送验证码失败，请重试')
    } finally {
        resetSubmitting.value = false
    }
}

const submitResetPassword = async () => {
    if (!resetForm.email || !resetForm.code || !resetForm.newPassword) {
        ElMessage.error('请填写完整信息')
        return
    }

    resetSubmitting.value = true
    try {
        const result = await resetPasswordApi({
            email: resetForm.email,
            code: resetForm.code,
            newPassword: resetForm.newPassword,
        })
        if (result.code === 200) {
            ElMessage.success('密码已重置，请使用新密码登录')
            backToLogin()
            resetForm.email = ''
        } else {
            ElMessage.error(result.message || '重置密码失败，请重试')
        }
    } catch (error) {
        ElMessage.error((error as Error).message || '重置密码失败，请重试')
    } finally {
        resetSubmitting.value = false
    }
}

const closeDialog = () => {
    visible.value = false
    showReset.value = false
}
</script>

<template>
    <el-dialog v-model="visible" width="1000px" :show-close="false" @close="closeDialog" class="login-panel">
        <button class="ui-icon-close-button ui-icon-close-button--close ui-icon-close-button--right" type="button"
            @click="closeDialog">
            <img src="/src/shared/assets/icons/close.svg" alt="关闭" width="20" height="20" />
        </button>

        <div class="dialog-content">
            <div class="image-panel">
                <img :src="loginImage" alt="登录背景" />
            </div>

            <div class="form-panel">
                <template v-if="!showReset">
                    <div class="form-header">
                        <el-tabs v-model="activeTab">
                            <el-tab-pane label="邮箱登录" name="mail"></el-tab-pane>
                            <el-tab-pane label="密码登录" name="password"></el-tab-pane>
                        </el-tabs>
                    </div>

                    <div class="form-body">
                        <template v-if="activeTab === 'mail'">
                            <el-form :model="loginForm">
                                <el-form-item prop="mail">
                                    <div class="email-input-group">
                                        <el-input v-model="loginForm.email" placeholder="请输入邮箱地址" clearable
                                            autocomplete="email" class="el-input__inner"></el-input>
                                        <el-button @click="sendCode">发送验证码</el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item prop="code">
                                    <el-input v-model="loginForm.code" clearable placeholder="请输入验证码"
                                        class="el-input__inner" />
                                </el-form-item>
                                <div class="form-button-group">
                                    <el-button type="primary" @click="submitLoginOrRegister('register')"
                                        class="form-button">
                                        注册
                                    </el-button>
                                    <el-button type="primary" :loading="submitting"
                                        @click="submitLoginOrRegister('login')" class="form-button">
                                        登录
                                    </el-button>
                                </div>
                            </el-form>
                        </template>

                        <template v-else>
                            <el-form :model="loginForm">
                                <el-form-item prop="mail">
                                    <el-input v-model="loginForm.email" placeholder="请输入邮箱地址" clearable
                                        autocomplete="email" class="el-input__inner" />
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input v-model="loginForm.password" type="password" show-password clearable
                                        placeholder="请输入密码" autocomplete="current-password" class="el-input__inner" />
                                </el-form-item>
                                <div class="form-button-group">
                                    <el-button type="primary" :loading="submitting"
                                        @click="submitLoginOrRegister('login')" class="form-button">登录</el-button>
                                </div>
                            </el-form>
                        </template>
                    </div>
                </template>

                <template v-else>
                    <div class="form-header">
                        <h3>重置密码</h3>
                    </div>

                    <div class="form-body">
                        <el-form :model="resetForm">
                            <el-form-item prop="mail">
                                <div class="email-input-group">
                                    <el-input v-model="resetForm.email" placeholder="请输入邮箱地址" clearable
                                        autocomplete="email" class="el-input__inner" />
                                    <el-button :loading="resetSubmitting" @click="sendResetCode">发送验证码</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item prop="code">
                                <el-input v-model="resetForm.code" clearable placeholder="请输入验证码"
                                    class="el-input__inner" />
                            </el-form-item>
                            <el-form-item prop="newPassword">
                                <el-input v-model="resetForm.newPassword" type="password" show-password clearable
                                    placeholder="请输入新密码（8-64 位，含字母和数字）" class="el-input__inner" />
                            </el-form-item>
                            <div class="form-button-group">
                                <el-button type="primary" :loading="resetSubmitting" @click="submitResetPassword"
                                    class="form-button">重置密码</el-button>
                                <el-button @click="backToLogin" class="form-button">返回登录</el-button>
                            </div>
                        </el-form>
                    </div>
                </template>
            </div>
        </div>

        <div class="dialog-footer">
            <el-button link type="primary" @click="switchToReset">忘记密码？</el-button>
        </div>
    </el-dialog>
</template>

<style scoped lang="scss">
.login-panel {
    --el-color-primary: #409eff;
    --el-color-primary-dark-2: #337ecc;
    --el-color-primary-light-9: #ecf5ff;
    --el-border-radius-base: 10px;
    --el-border-radius-small: 10px;
    --el-border-radius-round: 24px;
    --el-text-color-primary: #303133;
    --el-text-color-regular: #606266;
    --el-border-color: #dcdfe6;
    --el-border-color-light: #e4e7ed;

    border-radius: 24px;
    overflow: hidden;
    padding: 50px;

    >.ui-close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 2;
    }

    .dialog-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;

        .image-panel {
            width: 40%;
            text-align: center;
            padding: 75px;
            border-radius: 24px;

            img {
                max-width: 100%;
                height: auto;
                object-fit: contain;
            }
        }

        .form-panel {
            width: 60%;
            text-align: center;
            padding: 20px;
            border-left: 1px solid #ccc;

            h3 {
                margin-bottom: 20px;
                color: #333;
            }

            .form-header {
                padding: 40px;
                text-align: center;
            }

            .form-body {
                padding: 5px 40px;
                text-align: center;
                font-size: 16px;

                .email-input-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;

                    .email-input {
                        flex: 1;
                    }
                }

                .form-button-group {
                    display: flex;
                    gap: 12px;
                    margin: 0;

                    .form-button {
                        flex: 1;
                    }
                }

                .form-button {
                    width: 100%;
                    margin: 0 auto 0;
                }
            }

            .el-form-item {
                margin-bottom: 16px;

                .el-input {
                    width: 100%;
                }

                .el-form-item__label {
                    font-size: 16px;
                    font-weight: 500;
                }
            }

            .el-input__inner {
                height: 44px;
                font-size: 16px;
                border-radius: 10px;
            }

            .el-button {
                height: 44px;
                font-size: 16px;
                border-radius: 10px;
            }

            .error-message {
                color: #f56c6c;
                margin: 0 0 16px;
            }
        }
    }

    .dialog-footer {
        text-align: center;
        margin-top: 10px;
    }
}
</style>