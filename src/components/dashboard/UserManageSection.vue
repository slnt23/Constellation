<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Delete, EditPen, Key, Plus, Search } from '@element-plus/icons-vue'
import { adminRoleApi, adminUserApi } from '@/api'
import type { AdminUserQuery, AdminUserStatus, AdminUserVO, RoleVO, UserCreateDTO, UserUpdateDTO } from '@/types'

interface UserForm {
  username: string
  email: string
  phone: string
  password: string
  nickname: string
  roleName: string
  status: AdminUserStatus
  remark: string
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const list = ref<AdminUserVO[]>([])
const roles = ref<RoleVO[]>([])
const total = ref(0)

const query = reactive<AdminUserQuery>({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  status: undefined,
  roleName: '',
})

const form = reactive<UserForm>({
  username: '',
  email: '',
  phone: '',
  password: '',
  nickname: '',
  roleName: '',
  status: 0,
  remark: '',
})

const rules: FormRules<UserForm> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 50, message: '用户名不能超过 50 字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { max: 50, message: '邮箱不能超过 50 字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 64, message: '密码长度为 8-64 位', trigger: 'blur' },
  ],
  roleName: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

const loadRoles = async () => {
  try {
    const res = await adminRoleApi.list()
    roles.value = res.data ?? []
  } catch (error) {
    ElMessage.error((error as Error).message || '加载角色失败')
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const params: AdminUserQuery = { ...query }
    if (!params.keyword) delete params.keyword
    if (!params.roleName) delete params.roleName
    if (params.status === undefined) delete params.status
    const res = await adminUserApi.list(params)
    list.value = res.data?.records ?? []
    total.value = res.data?.total ?? 0
  } catch (error) {
    ElMessage.error((error as Error).message || '加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.pageNum = 1
  fetchList()
}

const handlePageChange = (page: number) => {
  query.pageNum = page
  fetchList()
}

const handleSizeChange = (size: number) => {
  query.pageSize = size
  query.pageNum = 1
  fetchList()
}

const resetForm = () => {
  editingId.value = null
  form.username = ''
  form.email = ''
  form.phone = ''
  form.password = ''
  form.nickname = ''
  form.roleName = ''
  form.status = 0
  form.remark = ''
  formRef.value?.clearValidate()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: AdminUserVO) => {
  editingId.value = row.id
  form.username = row.username
  form.email = row.email
  form.phone = row.phone ?? ''
  form.password = ''
  form.nickname = row.nickname ?? ''
  form.roleName = row.roleName
  form.status = row.status
  form.remark = row.remark ?? ''
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    if (editingId.value !== null) {
      const payload: UserUpdateDTO = {
        username: form.username,
        email: form.email,
        phone: form.phone || undefined,
        nickname: form.nickname || undefined,
        roleName: form.roleName,
        status: form.status,
        remark: form.remark || undefined,
      }
      await adminUserApi.update(editingId.value, payload)
      ElMessage.success('用户已更新')
    } else {
      const payload: UserCreateDTO = {
        username: form.username,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        nickname: form.nickname || undefined,
        roleName: form.roleName,
        status: form.status,
        remark: form.remark || undefined,
      }
      await adminUserApi.create(payload)
      ElMessage.success('用户已创建')
    }
    dialogVisible.value = false
    await fetchList()
  } catch (error) {
    ElMessage.error((error as Error).message || '保存失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const toggleStatus = async (row: AdminUserVO) => {
  const next: AdminUserStatus = row.status === 0 ? 1 : 0
  try {
    await adminUserApi.updateStatus(row.id, next)
    ElMessage.success(next === 0 ? '用户已启用' : '用户已封禁')
    await fetchList()
  } catch (error) {
    ElMessage.error((error as Error).message || '操作失败，请稍后重试')
  }
}

const remove = async (row: AdminUserVO) => {
  try {
    await ElMessageBox.confirm(`确定删除用户「${row.username}」吗？删除后不可恢复。`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await adminUserApi.deleteById(row.id)
    ElMessage.success('用户已删除')
    await fetchList()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error((error as Error).message || '删除失败，请稍后重试')
    }
  }
}

const passwordDialogVisible = ref(false)
const passwordUserId = ref<number | null>(null)
const passwordSubmitting = ref(false)
const passwordForm = reactive({ newPassword: '' })

const openResetPassword = (row: AdminUserVO) => {
  passwordUserId.value = row.id
  passwordForm.newPassword = ''
  passwordDialogVisible.value = true
}

const submitResetPassword = async () => {
  if (!passwordForm.newPassword) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (passwordUserId.value === null) return

  passwordSubmitting.value = true
  try {
    await adminUserApi.resetPassword(passwordUserId.value, { newPassword: passwordForm.newPassword })
    ElMessage.success('密码已重置')
    passwordDialogVisible.value = false
  } catch (error) {
    ElMessage.error((error as Error).message || '重置密码失败，请稍后重试')
  } finally {
    passwordSubmitting.value = false
  }
}

onMounted(() => {
  fetchList()
  loadRoles()
})
</script>

<template>
  <section class="manage-panel">
    <header class="manage-panel__header">
      <div>
        <h2 class="manage-panel__title">用户管理</h2>
        <p class="manage-panel__subtitle">后台用户查询、创建与状态维护</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="openCreate">新增用户</el-button>
    </header>

    <div class="manage-panel__filters">
      <el-input v-model="query.keyword" placeholder="用户名 / 昵称 / 手机号 / 邮箱" clearable class="manage-panel__keyword"
        @keyup.enter="handleSearch">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="query.status" placeholder="状态" clearable class="manage-panel__filter">
        <el-option label="正常" :value="0" />
        <el-option label="封禁" :value="1" />
      </el-select>
      <el-select v-model="query.roleName" placeholder="角色" clearable class="manage-panel__filter">
        <el-option v-for="role in roles" :key="role.id" :label="role.roleName" :value="role.roleName" />
      </el-select>
      <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
    </div>

    <div class="manage-panel__table-wrap">
      <el-table v-if="!loading || list.length" :data="list" border stripe class="manage-panel__table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userCode" label="编号" min-width="130" show-overflow-tooltip />
        <el-table-column prop="username" label="用户名" min-width="120" show-overflow-tooltip />
        <el-table-column prop="nickname" label="昵称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" min-width="130" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="roleName" label="角色" min-width="120" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">
              {{ row.status === 0 ? '正常' : '封禁' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="170" show-overflow-tooltip />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="EditPen" @click="openEdit(row)">编辑</el-button>
            <el-button link :icon="Key" @click="openResetPassword(row)">重置密码</el-button>
            <el-button link :type="row.status === 0 ? 'warning' : 'success'" @click="toggleStatus(row)">
              {{ row.status === 0 ? '封禁' : '启用' }}
            </el-button>
            <el-button link type="danger" :icon="Delete" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-skeleton v-else-if="loading" :rows="5" animated class="manage-panel__skeleton" />

      <el-empty v-else description="暂无用户" />
    </div>

    <div class="manage-panel__pagination">
      <el-pagination
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="editingId !== null ? '编辑用户' : '新增用户'"
      width="min(640px, 92vw)"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" maxlength="20" />
        </el-form-item>
        <el-form-item v-if="editingId === null" label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password maxlength="64" show-word-limit
            placeholder="8-64 位，含字母和数字" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" maxlength="50" />
        </el-form-item>
        <el-form-item label="角色" prop="roleName">
          <el-select v-model="form.roleName" class="manage-panel__select">
            <el-option v-for="role in roles" :key="role.id" :label="role.roleName" :value="role.roleName" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" class="manage-panel__select">
            <el-option label="正常" :value="0" />
            <el-option label="封禁" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" maxlength="255" show-word-limit />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="passwordDialogVisible"
      title="重置密码"
      width="min(480px, 92vw)"
      destroy-on-close
    >
      <el-form label-width="96px">
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password maxlength="64" show-word-limit
            placeholder="8-64 位，含字母和数字" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="passwordSubmitting" @click="submitResetPassword">确认重置</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped lang="scss">
.manage-panel {
  min-width: 0;
}

.manage-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.manage-panel__title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
  color: var(--vercel-ink);
}

.manage-panel__subtitle {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vercel-mute);
}

.manage-panel__filters {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.manage-panel__keyword {
  width: 280px;
}

.manage-panel__filter {
  width: 140px;
}

.manage-panel__table-wrap {
  overflow: hidden;
  border: 1px solid var(--vercel-hairline);
  border-radius: 8px;
  background: var(--vercel-canvas);
}

.manage-panel__table {
  width: 100%;
}

.manage-panel__skeleton {
  padding: 20px;
}

.manage-panel__pagination {
  display: flex;
  justify-content: flex-end;
  padding: 14px 0 0;
}

.manage-panel__select {
  width: 100%;
}

@media (max-width: 760px) {
  .manage-panel__header {
    flex-direction: column;
  }

  .manage-panel__keyword {
    width: 100%;
  }

  .manage-panel__pagination {
    justify-content: flex-start;
    overflow-x: auto;
  }
}
</style>
