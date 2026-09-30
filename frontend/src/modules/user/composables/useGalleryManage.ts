import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, UploadFile, UploadUserFile } from 'element-plus'
import { galleryApi } from '@/modules/gallery/api'
import type { GalleryItemVO, GalleryCreateDTO, GalleryUpdateDTO } from '@/modules/gallery/types'

interface GalleryForm {
    title: string
    description: string
    sortOrder: number
}

export function useGalleryManage() {
    const loading = ref(false)
    const submitting = ref(false)
    const dialogVisible = ref(false)
    const editingId = ref<number | null>(null)
    const formRef = ref<FormInstance>()
    const list = ref<GalleryItemVO[]>([])
    const fileList = ref<UploadUserFile[]>([])
    const uploadFile = ref<File | null>(null)
    const pageNum = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const form = reactive<GalleryForm>({
        title: '',
        description: '',
        sortOrder: 0,
    })

    const isEdit = computed(() => editingId.value !== null)

    const fetchList = async () => {
        loading.value = true
        try {
            const res = await galleryApi.page(pageNum.value, pageSize.value)
            const records = res.data?.records ?? []
            list.value = records.map(item => ({
                ...item,
                imageUrl: item.imageUrl?.replace(/^`|`$/g, '') ?? '',
                thumbnailUrl: item.thumbnailUrl?.replace(/^`|`$/g, '') ?? '',
            }))
            total.value = res.data?.total ?? 0
        } catch {
            ElMessage.error('加载画廊列表失败，请稍后重试')
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
        form.description = ''
        form.sortOrder = 0
        uploadFile.value = null
        fileList.value = []
        formRef.value?.clearValidate()
    }

    const openCreate = () => {
        resetForm()
        dialogVisible.value = true
    }

    const openEdit = (row: GalleryItemVO) => {
        editingId.value = row.id
        form.title = row.title
        form.description = row.description ?? ''
        form.sortOrder = row.sortOrder
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

        if (!uploadFile.value && !isEdit.value) {
            ElMessage.warning('请上传封面图片')
            return
        }

        submitting.value = true
        try {
            const payload = {
                title: form.title,
                description: form.description || undefined,
                sortOrder: form.sortOrder,
            }

            if (editingId.value !== null) {
                const updatePayload: GalleryUpdateDTO = {
                    ...payload,
                    id: editingId.value,
                }
                if (uploadFile.value) {
                    updatePayload.image = uploadFile.value
                }
                await galleryApi.update(editingId.value, updatePayload)
                ElMessage.success('画廊项目已更新')
            } else {
                const createPayload: GalleryCreateDTO = {
                    ...payload,
                    image: uploadFile.value as File,
                }
                await galleryApi.create(createPayload)
                ElMessage.success('画廊项目已创建')
            }

            dialogVisible.value = false
            await fetchList()
        } catch {
            ElMessage.error('保存失败，请稍后重试')
        } finally {
            submitting.value = false
        }
    }

    const remove = async (row: GalleryItemVO) => {
        try {
            await ElMessageBox.confirm(`确定删除「${row.title}」吗？删除后不可恢复。`, '删除确认', {
                type: 'warning',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
            })
            await galleryApi.deleteById(row.id)
            ElMessage.success('画廊项目已删除')
            await fetchList()
        } catch (error) {
            if (error !== 'cancel' && error !== 'close') {
                ElMessage.error('删除失败，请稍后重试')
            }
        }
    }

    return {
        loading,
        submitting,
        dialogVisible,
        editingId,
        formRef,
        list,
        fileList,
        uploadFile,
        pageNum,
        pageSize,
        total,
        form,
        isEdit,
        fetchList,
        handlePageChange,
        handleSizeChange,
        resetForm,
        openCreate,
        openEdit,
        handleFileChange,
        handleFileRemove,
        submit,
        remove,
    }
}