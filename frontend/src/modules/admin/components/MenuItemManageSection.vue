<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadFile, UploadUserFile } from 'element-plus'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import AdminPageHeader from '@/modules/admin/components/AdminPageHeader.vue'
import { menuItemApi } from '@/modules/admin/api'
import { CARD_SIZE_OPTIONS, FRONT_ROUTE_OPTIONS } from '@/modules/admin/constants'
import type { MenuItemVO } from '@/shared/types'

interface MenuItemForm {
  title: string
  subtitle: string
  path: string
  cardSize: 'large' | 'normal' | 'small'
  sortOrder: number
  status: number
  remark: string
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const list = ref<MenuItemVO[]>([])
const imageFileList = ref<UploadUserFile[]>([])
const imageFile = ref<File | null>(null)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive<MenuItemForm>({
  title: '',
  subtitle: '',
  path: '',
  cardSize: 'normal',
  sortOrder: 0,
  status: 1,
  remark: '',
})

const rules: FormRules<MenuItemForm> = {
  title: [
    { required: true, message: '请输入菜单标题', trigger: 'blur' },
    { max: 100, message: '菜单标题不能超过 100 字符', trigger: 'blur' },
  ],
  subtitle: [{ max: 200, message: '副标题不能超过 200 字符', trigger: 'blur' }],
  path: [{ required: true, message: '请选择跳转路由', trigger: 'change' }],
  remark: [{ max: 500, message: '备注不能超过 500 字符', trigger: 'blur' }],
}

const isEdit = computed(() => editingId.value !== null)

const fetchList = async () => {
  loading.value = true
  try {
    const res = await menuItemApi.page(pageNum.value, pageSize.value)
    list.value = res.data?.records ?? []
    total.value = res.data?.total ?? 0
  } catch (error) {
    ElMessage.error((error as Error).message || '加载菜单项失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pageNum.value = page
  fetchList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  pageNum.value = 1
  fetchList()
}

const resetForm = () => {
  editingId.value = null
  form.title = ''
  form.subtitle = ''
  form.path = ''
  form.cardSize = 'normal'
  form.sortOrder = 0
  form.status = 1
  form.remark = ''
  imageFile.value = null
  imageFileList.value = []
  formRef.value?.clearValidate()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: MenuItemVO) => {
  editingId.value = row.id
  form.title = row.title
  form.subtitle = row.subtitle ?? ''
  form.path = row.path
  form.cardSize = row.cardSize
  form.sortOrder = row.sortOrder
  form.status = row.status
  form.remark = row.remark ?? ''
  imageFile.value = null
  imageFileList.value = []
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

const handleImageChange = (file: UploadFile) => {
  imageFile.value = file.raw ?? null
}

const handleImageRemove = () => {
  imageFile.value = null
}

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (!isEdit.value && !imageFile.value) {
    ElMessage.warning('请上传菜单配图')
    return
  }

  submitting.value = true
  try {
    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      path: form.path,
      cardSize: form.cardSize,
      sortOrder: form.sortOrder,
      status: form.status,
      // 传空串而非 undefined，否则后端会跳过该字段，导致已填写的备注无法清空
      remark: form.remark,
    }

    if (editingId.value !== null) {
      // 不传 image 表示保留原配图，仅更新其余字段
      await menuItemApi.update(editingId.value, {
        ...payload,
        image: imageFile.value ?? undefined,
      })
      ElMessage.success('菜单项已更新')
    } else {
      await menuItemApi.create({
        ...payload,
        image: imageFile.value as File,
      })
      ElMessage.success('菜单项已创建')
    }

    dialogVisible.value = false
    await fetchList()
  } catch (error) {
    ElMessage.error((error as Error).message || '保存失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const remove = async (row: MenuItemVO) => {
  try {
    await ElMessageBox.confirm(
      `确定删除「${row.title}」吗？配图会一并删除，且不可恢复。`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
      },
    )
    await menuItemApi.deleteById(row.id)
    ElMessage.success('菜单项已删除')
    await fetchList()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error((error as Error).message || '删除失败，请稍后重试')
    }
  }
}

const handleStatusChange = async (row: MenuItemVO, value: string | number | boolean) => {
  const status = Number(value)
  try {
    await menuItemApi.updateStatus(row.id, status)
    row.status = status
    ElMessage.success(status === 1 ? '已启用' : '已禁用')
  } catch (error) {
    ElMessage.error((error as Error).message || '状态更新失败，请稍后重试')
  }
}

const previewImage = (row: MenuItemVO) => {
  window.open(row.imageUrl, '_blank', 'noopener')
}

onMounted(fetchList)
</script>

<template>
  <div class="manage-panel">
    <AdminPageHeader
      title="菜单管理"
      subtitle="前台「LET'S MENU」面板的菜单项；配图存 MinIO，不打包进前端产物"
      action-label="新增菜单项"
      @action="openCreate"
    />

    <div class="manage-panel__card">
      <div class="manage-panel__table-wrap">
        <el-table v-if="!loading || list.length" :data="list" class="manage-panel__table">
          <el-table-column label="配图" width="120">
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
          <el-table-column prop="id" label="ID" width="70" />
          <el-table-column prop="title" label="标题" min-width="140" />
          <el-table-column prop="subtitle" label="副标题" min-width="160" show-overflow-tooltip />
          <el-table-column prop="path" label="跳转路由" min-width="130" />
          <el-table-column prop="cardSize" label="尺寸" width="90" />
          <el-table-column prop="sortOrder" label="排序" width="80" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-switch
                :model-value="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="(val) => handleStatusChange(row, val)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="previewImage(row)">预览</el-button>
              <el-button link type="primary" :icon="EditPen" @click="openEdit(row)">编辑</el-button>
              <el-button link type="danger" :icon="Delete" @click="remove(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-skeleton v-else-if="loading" :rows="5" animated />
        <el-empty v-else description="暂无菜单项" />
      </div>

      <div class="manage-panel__pagination">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑菜单项' : '新增菜单项'"
      width="min(640px, 92vw)"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="例如：价格行情"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="副标题" prop="subtitle">
          <el-input
            v-model="form.subtitle"
            placeholder="例如：查看最新价格与走势"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="跳转路由" prop="path">
          <el-select v-model="form.path" placeholder="请选择" class="manage-panel__select">
            <el-option
              v-for="route in FRONT_ROUTE_OPTIONS"
              :key="route.value"
              :label="route.label"
              :value="route.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="配图">
          <el-upload
            v-model:file-list="imageFileList"
            :auto-upload="false"
            :limit="1"
            accept="image/jpeg,image/png,image/webp"
            list-type="picture-card"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
          >
            <el-icon :size="20"><Plus /></el-icon>
          </el-upload>
          <div class="manage-panel__muted">
            支持 jpg / png / webp，单个不超过 5MB{{ isEdit ? '；不选择则保留原配图' : '' }}
          </div>
        </el-form-item>

        <el-form-item label="卡片尺寸">
          <el-select v-model="form.cardSize" class="manage-panel__select">
            <el-option
              v-for="size in CARD_SIZE_OPTIONS"
              :key="size.value"
              :label="size.label"
              :value="size.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
