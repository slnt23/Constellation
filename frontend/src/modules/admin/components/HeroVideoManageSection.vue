<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadFile, UploadUserFile } from 'element-plus'
import { Delete, EditPen, Plus, VideoCamera } from '@element-plus/icons-vue'
import AdminPageHeader from '@/modules/admin/components/AdminPageHeader.vue'
import { heroVideoApi } from '@/modules/admin/api'
import type { HeroVideoItem } from '@/shared/types'

interface HeroVideoForm {
  title: string
  sortOrder: number
  status: number
  remark: string
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const list = ref<HeroVideoItem[]>([])
const videoFileList = ref<UploadUserFile[]>([])
const posterFileList = ref<UploadUserFile[]>([])
const videoFile = ref<File | null>(null)
const posterFile = ref<File | null>(null)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive<HeroVideoForm>({
  title: '',
  sortOrder: 0,
  status: 1,
  remark: '',
})

const rules: FormRules<HeroVideoForm> = {
  title: [
    { required: true, message: '请输入视频标题', trigger: 'blur' },
    { max: 200, message: '视频标题不能超过 200 字符', trigger: 'blur' },
  ],
  remark: [{ max: 500, message: '备注不能超过 500 字符', trigger: 'blur' }],
}

const isEdit = computed(() => editingId.value !== null)

const fetchList = async () => {
  loading.value = true
  try {
    const res = await heroVideoApi.page(pageNum.value, pageSize.value)
    list.value = res.data?.records ?? []
    total.value = res.data?.total ?? 0
  } catch (error) {
    ElMessage.error((error as Error).message || '加载 Hero 视频失败，请稍后重试')
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
  form.sortOrder = 0
  form.status = 1
  form.remark = ''
  videoFile.value = null
  posterFile.value = null
  videoFileList.value = []
  posterFileList.value = []
  formRef.value?.clearValidate()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: HeroVideoItem) => {
  editingId.value = row.id
  form.title = row.title
  form.sortOrder = row.sortOrder
  form.status = row.status
  form.remark = row.remark ?? ''
  videoFile.value = null
  posterFile.value = null
  videoFileList.value = []
  posterFileList.value = []
  formRef.value?.clearValidate()
  dialogVisible.value = true
}

const handleVideoChange = (file: UploadFile) => {
  videoFile.value = file.raw ?? null
}

const handleVideoRemove = () => {
  videoFile.value = null
}

const handlePosterChange = (file: UploadFile) => {
  posterFile.value = file.raw ?? null
}

const handlePosterRemove = () => {
  posterFile.value = null
}

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (!isEdit.value && !videoFile.value) {
    ElMessage.warning('请上传视频文件')
    return
  }

  submitting.value = true
  try {
    const payload = {
      title: form.title,
      sortOrder: form.sortOrder,
      status: form.status,
      // 传空串而非 undefined，否则后端会跳过该字段，导致已填写的备注无法清空
      remark: form.remark,
    }

    if (editingId.value !== null) {
      // 不传 video 表示保留原视频，仅更新其余字段
      await heroVideoApi.update(editingId.value, {
        ...payload,
        video: videoFile.value ?? undefined,
        poster: posterFile.value ?? undefined,
      })
      ElMessage.success('Hero 视频已更新')
    } else {
      await heroVideoApi.create({
        ...payload,
        video: videoFile.value as File,
        poster: posterFile.value ?? undefined,
      })
      ElMessage.success('Hero 视频已创建')
    }

    dialogVisible.value = false
    await fetchList()
  } catch (error) {
    ElMessage.error((error as Error).message || '保存失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const remove = async (row: HeroVideoItem) => {
  try {
    await ElMessageBox.confirm(
      `确定删除「${row.title}」吗？视频文件会一并删除，且不可恢复。`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
      },
    )
    await heroVideoApi.deleteById(row.id)
    ElMessage.success('Hero 视频已删除')
    await fetchList()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error((error as Error).message || '删除失败，请稍后重试')
    }
  }
}

const handleStatusChange = async (row: HeroVideoItem, value: string | number | boolean) => {
  const status = Number(value)
  try {
    await heroVideoApi.updateStatus(row.id, status)
    row.status = status
    ElMessage.success(status === 1 ? '已启用' : '已禁用')
  } catch (error) {
    ElMessage.error((error as Error).message || '状态更新失败，请稍后重试')
  }
}

const previewVideo = (row: HeroVideoItem) => {
  window.open(row.videoUrl, '_blank', 'noopener')
}

onMounted(fetchList)
</script>

<template>
  <div class="manage-panel">
    <AdminPageHeader
      title="Hero 视频管理"
      subtitle="首页主视觉视频维护；启用中排序最靠前的一条会在首页自动播放"
      action-label="新增 Hero 视频"
      @action="openCreate"
    />

    <div class="manage-panel__card">
      <div class="manage-panel__table-wrap">
        <el-table v-if="!loading || list.length" :data="list" class="manage-panel__table">
          <el-table-column label="预览" width="120">
            <template #default="{ row }">
              <el-image
                v-if="row.posterUrl"
                class="hero-video-thumb"
                :src="row.posterUrl"
                fit="cover"
                :preview-src-list="[row.posterUrl]"
                preview-teleported
              />
              <el-tag v-else type="info" effect="plain">视频</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="标题" min-width="160" />
          <el-table-column prop="sortOrder" label="排序" width="90" />
          <el-table-column label="状态" width="110">
            <template #default="{ row }">
              <el-switch
                :model-value="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="(val) => handleStatusChange(row, val)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip />
          <el-table-column label="操作" width="210" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="previewVideo(row)">预览</el-button>
              <el-button link type="primary" :icon="EditPen" @click="openEdit(row)">编辑</el-button>
              <el-button link type="danger" :icon="Delete" @click="remove(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-skeleton v-else-if="loading" :rows="5" animated />
        <el-empty v-else description="暂无 Hero 视频" />
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
      :title="isEdit ? '编辑 Hero 视频' : '新增 Hero 视频'"
      width="min(640px, 92vw)"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="例如：首页主视觉"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="视频文件">
          <el-upload
            v-model:file-list="videoFileList"
            :auto-upload="false"
            :limit="1"
            accept="video/mp4,video/webm,video/quicktime"
            list-type="text"
            :on-change="handleVideoChange"
            :on-remove="handleVideoRemove"
          >
            <el-button type="primary" plain :icon="VideoCamera">选择视频文件</el-button>
            <template #tip>
              <div class="manage-panel__muted">
                仅支持 mp4 / webm，单个不超过 50MB{{ isEdit ? '；不选择则保留原视频' : '' }}
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="封面图">
          <el-upload
            v-model:file-list="posterFileList"
            :auto-upload="false"
            :limit="1"
            accept="image/jpeg,image/png,image/webp"
            list-type="picture-card"
            :on-change="handlePosterChange"
            :on-remove="handlePosterRemove"
          >
            <el-icon :size="20"><Plus /></el-icon>
          </el-upload>
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
