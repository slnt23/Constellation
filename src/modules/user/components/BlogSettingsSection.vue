<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { useBlogSettings } from '@/modules/user/composables'

const {
    loading,
    submitting,
    aboutFormRef,
    aboutForm,
    educations,
    skills,
    newEducation,
    newSkill,
    loadSettings,
    saveAbout,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
    removeSkillItem,
} = useBlogSettings()

const activeCollapse = ref(['about', 'education', 'skills'])

onMounted(loadSettings)
</script>

<template>
    <div class="blog-settings-section">
        <div class="blog-settings-section__header">
            <h2 class="blog-settings-section__title">博客内容设置</h2>
        </div>

        <el-skeleton v-if="loading" :rows="8" animated class="blog-settings-section__skeleton" />

        <el-collapse v-else v-model="activeCollapse" class="blog-settings-section__collapse">
            <!-- About 设置 -->
            <el-collapse-item name="about" title="About 信息">
                <el-form ref="aboutFormRef" :model="aboutForm" label-width="100px" label-position="top">
                    <el-form-item label="标签行">
                        <el-input v-model="aboutForm.tagLine" placeholder="如：Developer / Designer" />
                    </el-form-item>
                    <el-form-item label="个人简介">
                        <el-input v-model="aboutForm.bio" type="textarea" :rows="6"
                            placeholder="每行一段，支持 HTML 标签如 <del>" />
                    </el-form-item>
                    <el-form-item label="位置">
                        <el-input v-model="aboutForm.location" placeholder="如：China / Beijing" />
                    </el-form-item>
                    <el-form-item label="GitHub 链接">
                        <el-input v-model="aboutForm.githubUrl" placeholder="https://github.com/xxx" />
                    </el-form-item>
                    <el-form-item label="CodeTime Badge URL">
                        <el-input v-model="aboutForm.codetimeUrl" placeholder="CodeTime 统计链接" />
                    </el-form-item>
                    <el-form-item label="诗句">
                        <el-input v-model="aboutForm.poem" placeholder="一句喜欢的诗" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="submitting" @click="saveAbout">
                            保存 About 设置
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>

            <!-- 教育经历 -->
            <el-collapse-item name="education" title="教育经历">
                <div class="blog-settings-section__list">
                    <div v-for="(edu, index) in educations" :key="index" class="blog-settings-section__list-item">
                        <div class="blog-settings-section__list-item-content">
                            <span class="blog-settings-section__list-item-label">学校：</span>
                            <span>{{ edu.school }}</span>
                        </div>
                        <div class="blog-settings-section__list-item-content">
                            <span class="blog-settings-section__list-item-label">学位：</span>
                            <span>{{ edu.degree }}</span>
                        </div>
                        <div class="blog-settings-section__list-item-content">
                            <span class="blog-settings-section__list-item-label">时间：</span>
                            <span>{{ edu.period }}</span>
                        </div>
                        <el-button link type="danger" :icon="Delete" size="small" @click="removeEducation(index)">
                            删除
                        </el-button>
                    </div>

                    <el-empty v-if="!educations.length" description="暂无教育经历" :image-size="60" />

                    <div class="blog-settings-section__add-form">
                        <h4 class="blog-settings-section__add-title">添加教育经历</h4>
                        <el-form :model="newEducation" label-width="80px" label-position="top">
                            <el-form-item label="学校">
                                <el-input v-model="newEducation.school" placeholder="学校名称" />
                            </el-form-item>
                            <el-form-item label="学位/专业">
                                <el-input v-model="newEducation.degree" placeholder="学位或专业" />
                            </el-form-item>
                            <el-form-item label="时间">
                                <el-input v-model="newEducation.period" placeholder="如：August 2021 - Present" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :icon="Plus" @click="addEducation">
                                    添加
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-collapse-item>

            <!-- 技能 -->
            <el-collapse-item name="skills" title="技能">
                <div class="blog-settings-section__list">
                    <div v-for="(skill, index) in skills" :key="index" class="blog-settings-section__skill-category">
                        <div class="blog-settings-section__skill-header">
                            <h4 class="blog-settings-section__skill-name">{{ skill.category }}</h4>
                            <el-button link type="danger" :icon="Delete" size="small" @click="removeSkill(index)">
                                删除分类
                            </el-button>
                        </div>
                        <div class="blog-settings-section__skill-tags">
                            <el-tag v-for="(item, itemIndex) in skill.items" :key="item" closable size="small"
                                class="blog-settings-section__skill-tag" @close="removeSkillItem(index, itemIndex)">
                                {{ item }}
                            </el-tag>
                        </div>
                    </div>

                    <el-empty v-if="!skills.length" description="暂无技能" :image-size="60" />

                    <div class="blog-settings-section__add-form">
                        <h4 class="blog-settings-section__add-title">添加技能</h4>
                        <el-form :model="newSkill" label-width="80px" label-position="top">
                            <el-form-item label="分类名称">
                                <el-input v-model="newSkill.category" placeholder="如：Web、Programming" />
                            </el-form-item>
                            <el-form-item label="技能项">
                                <el-input v-model="newSkill.items" placeholder="多个技能用逗号分隔" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :icon="Plus" @click="addSkill">
                                    添加
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<style scoped lang="scss">
.blog-settings-section {
    padding: 24px;
}

.blog-settings-section__header {
    margin-bottom: 20px;
}

.blog-settings-section__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1d2129;
}

.blog-settings-section__skeleton {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
}

.blog-settings-section__collapse {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    :deep(.el-collapse-item__header) {
        padding: 0 20px;
        font-weight: 500;
    }

    :deep(.el-collapse-item__content) {
        padding: 16px 20px 20px;
    }
}

.blog-settings-section__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.blog-settings-section__list-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    background: #f7f8fa;
    border-radius: 8px;
    position: relative;

    .el-button {
        position: absolute;
        top: 8px;
        right: 8px;
    }
}

.blog-settings-section__list-item-content {
    display: flex;
    gap: 8px;
    font-size: 0.9rem;
    color: #4e5969;
}

.blog-settings-section__list-item-label {
    color: #86909c;
    min-width: 48px;
}

.blog-settings-section__skill-category {
    padding: 12px 16px;
    background: #f7f8fa;
    border-radius: 8px;
}

.blog-settings-section__skill-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.blog-settings-section__skill-name {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1d2129;
}

.blog-settings-section__skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.blog-settings-section__skill-tag {
    margin: 0;
}

.blog-settings-section__add-form {
    padding: 16px;
    background: #f2f3f5;
    border-radius: 8px;
    border: 1px dashed #c9cdd4;
}

.blog-settings-section__add-title {
    margin: 0 0 12px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #4e5969;
}
</style>