<script setup lang="ts">
import { onMounted } from 'vue'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import { useGalleryManage } from '@/modules/user/composables'

const {
    loading,
    submitting,
    dialogVisible,
    formRef,
    list,
    fileList,
    pageNum,
    pageSize,
    total,
    form,
    isEdit,
    fetchList,
    handlePageChange,
    handleSizeChange,
    openCreate,
    openEdit,
    handleFileChange,
    handleFileRemove,
    submit,
    remove,
} = useGalleryManage()

onMounted(fetchList)
</script>

<template>
    <div class="gallery-manage-section">
        <div class="gallery-manage-section__header">
            <h2 class="gallery-manage-section__title">画廊内容管理</h2>
            <el-button type="primary" :icon="Plus" @click="openCreate">
                新增画廊项目
            </el-button>
        </div>

        <div class="gallery-manage-section__table-wrap">
            <el-table v-if="!loading || list.length" :data="list" class="gallery-manage-section__table">
                <el-table-column label="封面" width="120">
                    <template #default="{ row }">
                        <el-image class="gallery-manage-section__thumb" :src="row.thumbnailUrl" fit="cover"
                            :preview-src-list="[row.imageUrl]" preview-teleported />
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
                <el-table-column prop="description" label="描述" min-width="240" show-overflow-tooltip />
                <el-table-column prop="sortOrder" label="排序" width="90" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" :icon="EditPen" @click="openEdit(row)">
                            编辑
                        </el-button>
                        <el-button link type="danger" :icon="Delete" @click="remove(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-skeleton v-else-if="loading" :rows="5" animated class="gallery-manage-section__skeleton" />

            <el-empty v-else description="暂无画廊内容" />
        </div>

        <div class="gallery-manage-section__pagination">
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :total="total"
                :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
                @current-change="handlePageChange" @size-change="handleSizeChange" />
        </div>

        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑画廊项目' : '新增画廊项目'" width="min(640px, 92vw)"
            destroy-on-close>
            <el-form ref="formRef" :model="form" label-width="96px">
                <el-form-item label="标题" required>
                    <el-input v-model="form.title" maxlength="100" show-word-limit />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" type="textarea" :rows="4" maxlength="500" show-word-limit />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="form.sortOrder" :min="0" :max="9999" controls-position="right" />
                </el-form-item>
                <el-form-item label="封面图片">
                    <el-upload v-model:file-list="fileList" :auto-upload="false" :limit="1"
                        accept="image/jpeg,image/png,image/webp" list-type="picture-card" :on-change="handleFileChange"
                        :on-remove="handleFileRemove">
                        <el-icon :size="20">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitting" @click="submit">
                    保存
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.gallery-manage-section {
    padding: 24px;
}

.gallery-manage-section__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.gallery-manage-section__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1d2129;
}

.gallery-manage-section__table-wrap {
    overflow-x: auto;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.gallery-manage-section__table {
    width: 100%;
}

.gallery-manage-section__thumb {
    width: 80px;
    height: 60px;
    border-radius: 4px;
    object-fit: cover;
}

.gallery-manage-section__skeleton {
    padding: 20px;
}

.gallery-manage-section__pagination {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
}
</style>