<script setup lang="ts">
import loginAdminImage from '@/assets/modules/LOGIN/LOGIN_ADMIN.png'
import loginUserImage from '@/assets/modules/LOGIN/LOGIN_USER.png'


import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfoApi, loginMailApi, loginPasswordApi, registerApi, sendCodeApi } from '@/api'
import { setCurrentUser, setToken } from '@/utils/auth.ts'
// import { AUTH_STORAGE_KEY } from "@/constant";
import { ElMessage } from 'element-plus'
import type { LoginOrRegisterParams, SendCodeParams } from '@/types'

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
const router = useRouter()
const activeTab = ref('mail')

// 登录表单
const loginForm = reactive<LoginOrRegisterParams>({
  email: '',
  password: '',
  code: '',
  role: ''
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

  const result = type === 'login'
    ? activeTab.value === 'mail'
      ? await loginMailApi({ email: loginForm.email, code: loginForm.code ?? '' })
      : await loginPasswordApi({ email: loginForm.email, password: loginForm.password ?? '' })
    : await registerApi({ email: loginForm.email, code: loginForm.code ?? '' })

  if (result.code == 200) {
    submitting.value = false
    visible.value = false

    loginForm.email = ''
    loginForm.password = ''
    loginForm.code = ''

    //保存token，后续需要在请求头中携带token进行认证
    setToken(result.data)
    const userInfoResult = await getUserInfoApi()

    if (userInfoResult.code == 200) {
      setCurrentUser(userInfoResult.data)
    }
    await router.push('/')
  } else {
    ElMessage.error(result.message || '登录失败，请重试')
    submitting.value = false
  }
}

const sendCode = async () => {
  if (!loginForm.email) {
    ElMessage.error('请输入邮箱地址')
    return
  }

  submitting.value = true

  const sendCodeData = <SendCodeParams>{
    email: loginForm.email,
  }
  const result = await sendCodeApi(sendCodeData)

  if (result.code == 200) {
    submitting.value = false
    ElMessage.success('验证码已发送，请检查邮箱')
  } else {
    ElMessage.error(result.message || '发送验证码失败，请重试')
    submitting.value = false
  }
}

const closeDialog = () => {
  visible.value = false
  showAdmin.value = false
}
</script>

<template>
  <el-dialog v-model="visible" width="1000px" :show-close="false" @close="closeDialog" class="login-dialog">
    <button class="ui-icon-close-button ui-icon-close-button--close ui-icon-close-button--right" type="button"
      @click="closeDialog">
      <img src="/src/assets/modules/ICON_CLOSE.svg" alt="关闭" width="20" height="20" />
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
          <div v-else-if="activeTab === 'password'" class="form-body">
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
