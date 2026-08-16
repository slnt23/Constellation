<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadFile, UploadUserFile } from 'element-plus'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import AdminPageHeader from '@/modules/admin/components/AdminPageHeader.vue'
import { spotlightApi } from '@/modules/admin/api'
import type { SpotlightItem } from '@/shared/types'

interface SpotlightForm {
  eyebrow: string
  title: string
  description: string
  sortOrder: number
  link: string
  target: string
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const list = ref<SpotlightItem[]>([])
const fileList = ref<UploadUserFile[]>([])
const uploadFile = ref<File | null>(null)

const form = reactive<SpotlightForm>({
  eyebrow: '',
  title: '',
  description: '',
  sortOrder: 0,
  link: '',
  target: '_self',
})

const rules: FormRules<SpotlightForm> = {
  eyebrow: [
    { required: true, message: '请输入眉题', trigger: 'blur' },
    { max: 50, message: '眉题不能超过 50 字符', trigger: 'blur' },
  ],
  title: [
    { required: true, message: '请输入主标题', trigger: 'blur' },
    { max: 100, message: '主标题不能超过 100 字符', trigger: 'blur' },
  ],
  description: [{ max: 500, message: '描述不能超过 500 字符', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入排序', trigger: 'change' }],
  link: [{ max: 255, message: '链接不能超过 255 字符', trigger: 'blur' }],
}

const isEdit = computed(() => editingId.value !== null)

const fetchList = async () => {
  loading.value = true
  try {
    const res = await spotlightApi.list()
    list.value = res.data ?? []
  } catch {
    ElMessage.error('加载焦点项目失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  editingId.value = null
  form.eyebrow = ''
  form.title = ''
  form.description = ''
  form.sortOrder = 0
  form.link = ''
  form.target = '_self'
  uploadFile.value = null
  fileList.value = []
  formRef.value?.clearValidate()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: SpotlightItem) => {
  editingId.value = row.id
  form.eyebrow = row.eyebrow ?? ''
  form.title = row.title
  form.description = row.description ?? ''
  form.sortOrder = row.sortOrder
  form.link = row.link ?? ''
  form.target = row.target ?? '_self'
  uploadFile.value = null
  fileList.value = []
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

const handleFileChange = (file: UploadFile) => {
  uploadFile.value = file.raw ?? null
}

const handleFileRemove = () => {
  uploadFile.value = null
}

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (!isEdit.value && !uploadFile.value) {
    ElMessage.warning('请上传封面图片')
    return
  }

  submitting.value = true
  try {
    const payload = {
      eyebrow: form.eyebrow,
      title: form.title,
      description: form.description || undefined,
      sortOrder: form.sortOrder,
      link: form.link || undefined,
      target: form.target,
    }

    if (editingId.value !== null) {
      await spotlightApi.update(editingId.value, { ...payload, id: editingId.value })
      ElMessage.success('焦点项目已更新')
    } else {
      await spotlightApi.create({ ...payload, image: uploadFile.value as File })
      ElMessage.success('焦点项目已创建')
    }

    dialogVisible.value = false
    await fetchList()
  } catch {
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const remove = async (row: SpotlightItem) => {
  try {
    await ElMessageBox.confirm(`确定删除「${row.title}」吗？删除后不可恢复。`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await spotlightApi.deleteById(row.id)
    ElMessage.success('焦点项目已删除')
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
  <div class="manage-panel">
    <AdminPageHeader
      title="焦点项目管理"
      subtitle="首页焦点项目内容维护"
      action-label="新增焦点项目"
      @action="openCreate"
    />

    <div class="manage-panel__card">
    <div class="manage-panel__table-wrap">
      <el-table v-if="!loading || list.length" :data="list" class="manage-panel__table">
        <el-table-column label="封面" width="110">
          <template #default="{ row }">
            <el-image
              class="spotlight-thumb"
              :src="row.imageUrl"
              fit="cover"
              :preview-src-list="[row.imageUrl]"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="eyebrow" label="眉题" min-width="140" show-overflow-tooltip />
        <el-table-column prop="title" label="主标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" min-width="240" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="90" />
        <el-table-column label="链接" min-width="200">
          <template #default="{ row }">
            <el-link v-if="row.link" type="primary" :href="row.link" :target="row.target || '_blank'" :underline="false">
              {{ row.link }}
            </el-link>
            <span v-else class="manage-panel__muted">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="EditPen" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" :icon="Delete" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-skeleton v-else-if="loading" :rows="5" animated class="manage-panel__skeleton" />

      <el-empty v-else description="暂无焦点项目" />
    </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑焦点项目' : '新增焦点项目'"
      width="min(640px, 92vw)"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="眉题" prop="eyebrow">
          <el-input v-model="form.eyebrow" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="主标题" prop="title">
          <el-input v-model="form.title" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" controls-position="right" />
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="form.link" maxlength="255" placeholder="https://" />
        </el-form-item>
        <el-form-item label="打开方式" prop="target">
          <el-select v-model="form.target" class="manage-panel__select">
            <el-option label="当前窗口" value="_self" />
            <el-option label="新窗口" value="_blank" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="封面图片">
          <el-upload
            v-model:file-list="fileList"
            :auto-upload="false"
            :limit="1"
            accept="image/jpeg,image/png,image/webp"
            list-type="picture-card"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
          >
            <el-icon :size="20"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item v-else label="封面图片">
          <span class="manage-panel__muted">编辑暂不支持更换图片</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>


