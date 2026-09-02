import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { MOCK_BLOG_SETTINGS } from '@/modules/blog/constants/mock'
import type { BlogSettingsData, BlogAboutData } from '@/modules/blog/constants/mock'
import type { EducationItem, SkillCategory } from '@/modules/blog/types'

interface AboutForm {
    tagLine: string
    bio: string
    location: string
    githubUrl: string
    codetimeUrl: string
    poem: string
}

interface EducationForm {
    school: string
    degree: string
    period: string
}

interface SkillForm {
    category: string
    items: string
}

export function useBlogSettings() {
    const loading = ref(false)
    const submitting = ref(false)
    const aboutFormRef = ref<FormInstance>()
    const educationFormRef = ref<FormInstance>()
    const skillFormRef = ref<FormInstance>()

    const aboutForm = reactive<AboutForm>({
        tagLine: '',
        bio: '',
        location: '',
        githubUrl: '',
        codetimeUrl: '',
        poem: '',
    })

    const educations = ref<EducationItem[]>([])
    const skills = ref<SkillCategory[]>([])

    const newEducation = reactive<EducationForm>({
        school: '',
        degree: '',
        period: '',
    })

    const newSkill = reactive<SkillForm>({
        category: '',
        items: '',
    })

    const loadSettings = () => {
        loading.value = true
        try {
            const data = MOCK_BLOG_SETTINGS
            aboutForm.tagLine = data.about.tagLine
            aboutForm.bio = data.about.bio.join('\n')
            aboutForm.location = data.about.location
            aboutForm.githubUrl = data.about.githubUrl
            aboutForm.codetimeUrl = data.about.codetimeUrl
            aboutForm.poem = data.about.poem
            educations.value = [...data.educations]
            skills.value = data.skills.map(s => ({
                category: s.category,
                items: [...s.items],
            }))
        } catch {
            ElMessage.error('加载博客设置失败')
        } finally {
            loading.value = false
        }
    }

    const saveAbout = async () => {
        const valid = await aboutFormRef.value?.validate().catch(() => false)
        if (!valid) return

        submitting.value = true
        try {
            const bioArray = aboutForm.bio
                .split('\n')
                .map(line => line.trim())
                .filter(Boolean)

            const settings: BlogSettingsData = {
                about: {
                    tagLine: aboutForm.tagLine,
                    bio: bioArray,
                    location: aboutForm.location,
                    githubUrl: aboutForm.githubUrl,
                    codetimeUrl: aboutForm.codetimeUrl,
                    poem: aboutForm.poem,
                },
                educations: educations.value,
                skills: skills.value,
            }

            console.log('Save blog settings:', settings)
            ElMessage.success('博客设置已保存')
        } catch {
            ElMessage.error('保存失败，请稍后重试')
        } finally {
            submitting.value = false
        }
    }

    const addEducation = () => {
        if (!newEducation.school.trim()) {
            ElMessage.warning('请输入学校名称')
            return
        }
        educations.value.push({
            school: newEducation.school.trim(),
            degree: newEducation.degree.trim(),
            period: newEducation.period.trim(),
        })
        newEducation.school = ''
        newEducation.degree = ''
        newEducation.period = ''
    }

    const removeEducation = (index: number) => {
        educations.value.splice(index, 1)
    }

    const addSkill = () => {
        if (!newSkill.category.trim()) {
            ElMessage.warning('请输入技能分类名称')
            return
        }
        const itemsArray = newSkill.items
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)

        const existingIndex = skills.value.findIndex(s => s.category === newSkill.category.trim())
        if (existingIndex >= 0) {
            skills.value[existingIndex].items = [...new Set([...skills.value[existingIndex].items, ...itemsArray])]
        } else {
            skills.value.push({
                category: newSkill.category.trim(),
                items: itemsArray,
            })
        }
        newSkill.category = ''
        newSkill.items = ''
    }

    const removeSkill = (index: number) => {
        skills.value.splice(index, 1)
    }

    const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
        skills.value[categoryIndex].items.splice(itemIndex, 1)
    }

    return {
        loading,
        submitting,
        aboutFormRef,
        educationFormRef,
        skillFormRef,
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
    }
}