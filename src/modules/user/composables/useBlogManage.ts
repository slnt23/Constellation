import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, UploadFile, UploadUserFile } from 'element-plus'
import { blogApi } from '@/modules/blog/api'
import type { BlogPostVO, BlogPostCreateDTO, BlogPostUpdateDTO } from '@/modules/blog/types'

interface BlogForm {
    title: string
    excerpt: string
    content: string
    tags: string
    sortOrder: number
}

export function useBlogManage() {
    const loading = ref(false)
    const submitting = ref(false)
    const dialogVisible = ref(false)
    const editingId = ref<number | null>(null)
    const formRef = ref<FormInstance>()
    const list = ref<BlogPostVO[]>([])
    const fileList = ref<UploadUserFile[]>([])
    const uploadFile = ref<File | null>(null)
    const pageNum = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const form = reactive<BlogForm>({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        sortOrder: 0,
    })

    const isEdit = computed(() => editingId.value !== null)

    const fetchList = async () => {
        loading.value = true
        try {
            const res = await blogApi.page(pageNum.value, pageSize.value)
            const records = res.data?.records ?? []
            list.value = records.map(item => ({
                ...item,
                coverUrl: item.coverUrl?.replace(/^`|`$/g, '') ?? '',
            }))
            total.value = res.data?.total ?? 0
        } catch {
            ElMessage.error('加载博客列表失败，请稍后重试')
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
        form.excerpt = ''
        form.content = ''
        form.tags = ''
        form.sortOrder = 0
        uploadFile.value = null
        fileList.value = []
        formRef.value?.clearValidate()
    }

    const openCreate = () => {
        resetForm()
        dialogVisible.value = true
    }

    const openEdit = (row: BlogPostVO) => {
        editingId.value = row.id
        form.title = row.title
        form.excerpt = row.excerpt ?? ''
        form.content = row.content
        form.tags = row.tags?.join(', ') ?? ''
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

        submitting.value = true
        try {
            const tagsArray = form.tags
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)

            const payload = {
                title: form.title,
                excerpt: form.excerpt || undefined,
                content: form.content,
                tags: tagsArray.length > 0 ? tagsArray : undefined,
                sortOrder: form.sortOrder,
            }

            if (editingId.value !== null) {
                const updatePayload: BlogPostUpdateDTO = {
                    ...payload,
                }
                if (uploadFile.value) {
                    updatePayload.cover = uploadFile.value
                }
                await blogApi.update(editingId.value, updatePayload)
                ElMessage.success('博客已更新')
            } else {
                const createPayload: BlogPostCreateDTO = {
                    ...payload,
                    cover: uploadFile.value || undefined,
                }
                await blogApi.create(createPayload)
                ElMessage.success('博客已创建')
            }

            dialogVisible.value = false
            await fetchList()
        } catch {
            ElMessage.error('保存失败，请稍后重试')
        } finally {
            submitting.value = false
        }
    }

    const remove = async (row: BlogPostVO) => {
        try {
            await ElMessageBox.confirm(`确定删除「${row.title}」吗？删除后不可恢复。`, '删除确认', {
                type: 'warning',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
            })
            await blogApi.deleteById(row.id)
            ElMessage.success('博客已删除')
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