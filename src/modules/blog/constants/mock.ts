import type { EducationItem, SkillCategory } from '@/modules/blog/types'

export interface BlogAboutData {
    tagLine: string
    bio: string[]
    location: string
    githubUrl: string
    codetimeUrl: string
    poem: string
}

export interface BlogSettingsData {
    about: BlogAboutData
    educations: EducationItem[]
    skills: SkillCategory[]
}

export const MOCK_BLOG_SETTINGS: BlogSettingsData = {
    about: {
        tagLine: 'Developer / Designer / <del>Medical student</del>',
        bio: [
            '你好，我叫 Arthals，是一个兴趣使然、热爱编程的医学生。',
            '目前就读于北京大学医学部，同时修读计算机科学技术双学位。一边被 <del>病理病生药理</del> 内外妇儿折磨，一边在 <del>ICS 的 Lab 作业</del> PyTorch 中 debug 到头秃。',
            '我即将在北京大学先进制造与机器人学院攻读博士学位。',
            '我的兴趣主要在 Large Language Model / Embodied AI 方向。',
            '我喜欢 Minecraft。',
        ],
        location: 'China / Beijing',
        githubUrl: 'https://github.com',
        codetimeUrl: 'https://shields.jannchie.com/endpoint?style=flat&color=222&url=https%3A%2F%2Fapi.codetime.dev%2Fv3%2Fusers%2Fshield%3Fuid%3D20455',
        poem: '春潮带雨晚来急，野渡无人舟自横。',
    },
    educations: [
        {
            school: '北京大学',
            degree: '预防医学 & 计算机科学技术双学位',
            period: 'August 2021 - Present',
        },
        {
            school: '中国人民大学附属中学',
            degree: '早培班 & 人工智能实验班',
            period: 'August 2014 - July 2021',
        },
    ],
    skills: [
        {
            category: 'Web',
            items: ['Vue.js', 'Nuxt.js', 'Node.js', 'React.js', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
        },
        {
            category: 'Programming',
            items: ['Python', 'PyTorch', 'C', 'C++', 'C#', 'R', 'MySQL', 'PostgreSQL'],
        },
        {
            category: 'Tools',
            items: ['VSCode', 'Vim', 'Git', 'Linux', 'Docker', 'Nginx'],
        },
        {
            category: 'Design',
            items: ['Figma', 'Photoshop', 'Illustrator'],
        },
        {
            category: 'Other',
            items: ['Markdown', 'LaTeX'],
        },
    ],
}