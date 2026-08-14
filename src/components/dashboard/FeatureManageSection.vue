<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import { featureApi } from '@/api'
import type { FeatureItem } from '@/types'

interface FeatureForm {
  icon: string
  title: string
  description: string
  sortOrder: number
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const list = ref<FeatureItem[]>([])

const form = reactive<FeatureForm>({
  icon: '',
  title: '',
  description: '',
  sortOrder: 0,
})

const rules: FormRules<FeatureForm> = {
  icon: [
    { required: true, message: '请输入图标标识', trigger: 'blur' },
    { max: 20, message: '图标标识不能超过 20 字符', trigger: 'blur' },
  ],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 50, message: '标题不能超过 50 字符', trigger: 'blur' },
  ],
  description: [{ max: 255, message: '描述不能超过 255 字符', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入排序', trigger: 'change' }],
}

const isEdit = computed(() => editingId.value !== null)

const fetchList = async () => {
  loading.value = true
  try {
    const res = await featureApi.list()
    list.value = res.data ?? []
  } catch {
    ElMessage.error('加载特性失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  editingId.value = null
  form.icon = ''
  form.title = ''
  form.description = ''
  form.sortOrder = 0
  formRef.value?.clearValidate()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: FeatureItem) => {
  editingId.value = row.id ?? null
  form.icon = row.icon ?? ''
  form.title = row.title
  form.description = row.description ?? ''
  form.sortOrder = row.sortOrder ?? 0
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const payload = {
      icon: form.icon,
      title: form.title,
      description: form.description || undefined,
      sortOrder: form.sortOrder,
    }

    if (editingId.value !== null) {
      await featureApi.update(editingId.value, payload)
      ElMessage.success('特性已更新')
    } else {
      await featureApi.create(payload)
      ElMessage.success('特性已创建')
    }

    dialogVisible.value = false
    await fetchList()
  } catch {
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const remove = async (row: FeatureItem) => {
  if (row.id === undefined) return

  try {
    await ElMessageBox.confirm(`确定删除「${row.title}」吗？删除后不可恢复。`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await featureApi.deleteById(row.id)
    ElMessage.success('特性已删除')
    await fetchList()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

onMounted(fetchList)
</script>

<template>
  <section class="manage-panel">
    <header class="manage-panel__header">
      <div>
        <h2 class="manage-panel__title">特性管理</h2>
        <p class="manage-panel__subtitle">首页特性卡片内容维护</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="openCreate">新增特性</el-button>
    </header>

    <div class="manage-panel__table-wrap">
      <el-table v-if="!loading || list.length" :data="list" border stripe class="manage-panel__table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图标" width="110">
          <template #default="{ row }">
            <el-tag effect="plain" class="manage-panel__icon-tag">{{ row.icon || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" min-width="280" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="90" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="EditPen" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" :icon="Delete" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-skeleton v-else-if="loading" :rows="5" animated class="manage-panel__skeleton" />

      <el-empty v-else description="暂无特性" />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑特性' : '新增特性'"
      width="min(560px, 92vw)"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="图标标识" prop="icon">
          <el-input v-model="form.icon" maxlength="20" placeholder="01 / star / 火" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="50" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">保存</el-button>
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

.manage-panel__icon-tag {
  max-width: 100%;
}

@media (max-width: 760px) {
  .manage-panel__header {
    flex-direction: column;
  }
}
</style>
