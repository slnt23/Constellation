<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import { adminRoleApi } from '@/modules/admin/api'
import type { RoleCreateDTO, RoleUpdateDTO, RoleVO } from '@/modules/admin/types'

interface RoleForm {
  roleName: string
  description: string
  enabled: boolean
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const list = ref<RoleVO[]>([])

const form = reactive<RoleForm>({
  roleName: '',
  description: '',
  enabled: true,
})

const rules: FormRules<RoleForm> = {
  roleName: [
    { required: true, message: '请输入角色名', trigger: 'blur' },
    { max: 100, message: '角色名不能超过 100 字符', trigger: 'blur' },
  ],
  description: [{ max: 255, message: '描述不能超过 255 字符', trigger: 'blur' }],
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await adminRoleApi.list()
    list.value = res.data ?? []
  } catch (error) {
    ElMessage.error((error as Error).message || '加载角色列表失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  editingId.value = null
  form.roleName = ''
  form.description = ''
  form.enabled = true
  formRef.value?.clearValidate()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: RoleVO) => {
  editingId.value = row.id
  form.roleName = row.roleName
  form.description = row.description ?? ''
  form.enabled = row.enabled
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    if (editingId.value !== null) {
      const payload: RoleUpdateDTO = {
        roleName: form.roleName,
        description: form.description || undefined,
        enabled: form.enabled,
      }
      await adminRoleApi.update(editingId.value, payload)
      ElMessage.success('角色已更新')
    } else {
      const payload: RoleCreateDTO = {
        roleName: form.roleName,
        description: form.description || undefined,
        enabled: form.enabled,
      }
      await adminRoleApi.create(payload)
      ElMessage.success('角色已创建')
    }
    dialogVisible.value = false
    await fetchList()
  } catch (error) {
    ElMessage.error((error as Error).message || '保存失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const toggleEnabled = async (row: RoleVO) => {
  try {
    await adminRoleApi.updateEnabled(row.id, !row.enabled)
    ElMessage.success(row.enabled ? '角色已禁用' : '角色已启用')
    await fetchList()
  } catch (error) {
    ElMessage.error((error as Error).message || '操作失败，请稍后重试')
  }
}

const remove = async (row: RoleVO) => {
  try {
    await ElMessageBox.confirm(`确定删除角色「${row.roleName}」吗？删除后不可恢复。`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await adminRoleApi.deleteById(row.id)
    ElMessage.success('角色已删除')
    await fetchList()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error((error as Error).message || '删除失败，请稍后重试')
    }
  }
}

onMounted(fetchList)
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px">
        <div>
          <el-text size="large" tag="b">角色管理</el-text>
          <br />
          <el-text type="info" size="small">后台角色维护与启停控制</el-text>
        </div>
        <el-button type="primary" :icon="Plus" @click="openCreate">新增角色</el-button>
      </div>
    </template>

    <div class="manage-panel__table-wrap">
      <el-table v-if="!loading || list.length" :data="list" border stripe class="manage-panel__table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="roleName" label="角色名" min-width="180" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" min-width="280" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="170" show-overflow-tooltip />
        <el-table-column prop="updateTime" label="更新时间" min-width="170" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="EditPen" @click="openEdit(row)">编辑</el-button>
            <el-button link :type="row.enabled ? 'warning' : 'success'" @click="toggleEnabled(row)">
              {{ row.enabled ? '禁用' : '启用' }}
            </el-button>
            <el-button link type="danger" :icon="Delete" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-skeleton v-else-if="loading" :rows="5" animated class="manage-panel__skeleton" />

      <el-empty v-else description="暂无角色" />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="editingId !== null ? '编辑角色' : '新增角色'"
      width="min(560px, 92vw)"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="form.roleName" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="启用" prop="enabled">
          <el-switch v-model="form.enabled" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>


