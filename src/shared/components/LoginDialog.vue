<script setup lang="ts">
import loginAdminImage from '@/shared/assets/modules/LOGIN/LOGIN_ADMIN.png'
import loginUserImage from '@/shared/assets/modules/LOGIN/LOGIN_USER.png'


import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginMailApi, loginPasswordApi, resetPasswordApi, sendCodeApi } from '@/modules/user/api/auth'
import { getUserInfoApi } from '@/modules/user/api/profile'
import { setCurrentUser, setToken } from '@/core/permission'
import { ElMessage } from 'element-plus'
import type { LoginOrRegisterParams, SendCodeParams } from '@/modules/user/types'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
// Emits
const emit = defineEmits(['update:modelValue'])
const showAdmin = ref(false)
const submitting = ref(false)
const showReset = ref(false)
const resetSubmitting = ref(false)
const router = useRouter()
const activeTab = ref('mail')

// 登录表单
const loginForm = reactive<LoginOrRegisterParams>({
  email: '',
  password: '',
  code: '',
  role: ''
})

const resetForm = reactive({
  email: '',
  code: '',
  newPassword: '',
})

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 切换登录模式
const toggleMode = () => {
  showAdmin.value = !showAdmin.value
}

// 提交登录或注册
const submitLoginOrRegister = async (type: 'login' | 'register') => {
  submitting.value = true

  try {
    // 邮箱验证码登录会自动注册，注册与登录统一走 login-email
    const result = type === 'register' || activeTab.value === 'mail'
      ? await loginMailApi({ email: loginForm.email, code: loginForm.code ?? '' })
      : await loginPasswordApi({ email: loginForm.email, password: loginForm.password ?? '' })

    if (result.code == 200) {
      visible.value = false

      loginForm.email = ''
      loginForm.password = ''
      loginForm.code = ''

      // 保存 token，后续需要在请求头中携带 token 进行认证
      setToken(result.data)
      const userInfoResult = await getUserInfoApi()

      if (userInfoResult.code == 200) {
        setCurrentUser(userInfoResult.data)
      }
      await router.push('/')
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

    if (result.code == 200) {
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
    if (result.code == 200) {
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
    if (result.code == 200) {
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
  showAdmin.value = false
  showReset.value = false
}
</script>

<template>
  <el-dialog v-model="visible" width="1000px" :show-close="false" @close="closeDialog" class="login-dialog">
    <button class="ui-icon-close-button ui-icon-close-button--close ui-icon-close-button--right" type="button"
      @click="closeDialog">
      <img src="/src/shared/assets/modules/ICON_CLOSE.svg" alt="关闭" width="20" height="20" />
    </button>

    <div class="dialog-content">
      <!-- 左边：如果 showAdmin 为 true 显示表单，否则显示图片   admin  -->
      <div class="main-panel" :class="{ 'user-mode': showAdmin, 'admin-mode': !showAdmin }"
        :style="{ width: showAdmin ? '60%' : '40%' }">
        <div v-if="showAdmin" class="form-panel">
          <div class="form-header">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="邮箱登录" name="mail"></el-tab-pane>
              <el-tab-pane label="密码登录" name="password"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="form-body">
            <el-form :model="loginForm">
              <el-form-item prop="mail">
                <div class="email-input-group">
                  <el-input v-model="loginForm.email" placeholder="请输入邮箱地址" clearable
                    class="el-input__inner"></el-input>
                  <el-button v-if="activeTab === 'mail'" @click="sendCode">发送验证码</el-button>
                </div>
              </el-form-item>
              <el-form-item prop="code" v-if="activeTab === 'mail'">
                <el-input v-model="loginForm.code" clearable placeholder="请输入验证码" class="el-input__inner" />
              </el-form-item>
              <el-form-item prop="password" v-else>
                <el-input v-model="loginForm.password" type="password" show-password clearable placeholder="请输入密码"
                  class="el-input__inner" />
              </el-form-item>
              <el-button class="form-button" type="primary" :loading="submitting"
                @click="submitLoginOrRegister('login')">登录
              </el-button>
            </el-form>
          </div>
        </div>
        <div v-else class="image-panel">
          <img :src="loginUserImage" alt="用户登录背景" />
        </div>
      </div>

      <!-- 右边：如果 showAdmin 为 false 显示表单，否则显示图片  user -->
      <div class="main-panel" :class="{ 'user-mode': showAdmin, 'admin-mode': !showAdmin }"
        :style="{ width: showAdmin ? '40%' : '60%' }">
        <div v-if="!showAdmin" class="form-panel">
          <div class="form-header">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="邮箱注册/登录" name="mail"></el-tab-pane>
              <el-tab-pane label="密码登录" name="password"></el-tab-pane>
            </el-tabs>
          </div>
          <div v-if="activeTab === 'mail'" class="form-body">
            <el-form>
              <el-form-item prop="mail">
                <div class="email-input-group">
                  <el-input v-model="loginForm.email" placeholder="请输入邮箱地址" clearable class="el-input__inner" />
                  <el-button @click="sendCode">发送验证码</el-button>
                </div>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.code" type="text" show-password clearable placeholder="请输入验证码"
                  class="el-input__inner" />
              </el-form-item>
              <div class="form-button-group">
                <el-button type="primary" @click="submitLoginOrRegister('register')" class="form-button">
                  注册
                </el-button>
                <el-button type="primary" :loading="submitting" @click="submitLoginOrRegister('login')"
                  class="form-button">
                  登录
                </el-button>
              </div>
            </el-form>
          </div>
          <div v-else-if="activeTab === 'password' && !showReset" class="form-body">
            <el-form>
              <el-form-item prop="mail">
                <el-input v-model="loginForm.email" placeholder="请输入邮箱地址" clearable class="el-input__inner" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" show-password clearable placeholder="请输入密码"
                  class="el-input__inner" />
              </el-form-item>
              <div class="form-button-group">
                <el-button type="primary" :loading="submitting" @click="submitLoginOrRegister('login')"
                  class="form-button">登录</el-button>
              </div>
              <el-button link type="primary" class="form-link" @click="switchToReset">忘记密码？</el-button>
            </el-form>
          </div>
          <div v-else-if="showReset" class="form-body">
            <el-form>
              <el-form-item prop="mail">
                <div class="email-input-group">
                  <el-input v-model="resetForm.email" placeholder="请输入邮箱地址" clearable class="el-input__inner" />
                  <el-button :loading="resetSubmitting" @click="sendResetCode">发送验证码</el-button>
                </div>
              </el-form-item>
              <el-form-item prop="code">
                <el-input v-model="resetForm.code" clearable placeholder="请输入验证码" class="el-input__inner" />
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
        </div>
        <div v-else class="image-panel">
          <img :src="loginAdminImage" alt="管理员登录背景" />
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      点击这里，切换为
      <el-button link type="primary" @click="toggleMode">{{ showAdmin ? '用户' : '管理员' }}</el-button>
      登录
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.login-dialog {
  border-radius: var(--border-radius-md);
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

    .main-panel {
      &:first-child {
        border-right: 1px solid #ccc;
      }

      &.user-mode {
        flex-direction: row;
      }

      &.admin-mode {
        flex-direction: row-reverse;
      }

      .form-panel {
        text-align: center;
        width: 100%;
        padding: 20px;

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
          border-radius: var(--radius-ui);
        }

        .el-button {
          height: 44px;
          font-size: 16px;
          border-radius: var(--radius-ui);
        }

        .error-message {
          color: #f56c6c;
          margin: 0 0 16px;
        }
      }

      .image-panel {
        text-align: center;
        width: 100%;
        padding: 75px;
        border-radius: var(--border-radius-md);

        img {
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }
      }
    }
  }

  .dialog-footer {
    text-align: center;
    margin-top: 10px;
  }

  .login_close_button {
    right: 20px;
    top: 20px;
  }
}
</style>
