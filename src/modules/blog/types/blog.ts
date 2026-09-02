export interface BlogPostVO {
    id: number
    title: string
    excerpt: string
    content: string
    coverUrl: string
    tags: string[]
    status: number
    sortOrder: number
    createTime: string
    updateTime: string
}

export interface BlogPostCreateDTO {
    title: string
    excerpt?: string
    content: string
    cover?: File
    tags?: string[]
    sortOrder?: number
}

export interface BlogPostUpdateDTO {
    title?: string
    excerpt?: string
    content?: string
    cover?: File
    tags?: string[]
    sortOrder?: number
}

export interface BlogSettingsVO {
    about: {
        tagLine: string
        bio: string[]
        location: string
        githubUrl: string
        codetimeUrl: string
        poem: string
    }
    educations: {
        school: string
        degree: string
        period: string
    }[]
    skills: {
        category: string
        items: string[]
    }[]
}

export interface BlogSettingsDTO {
    about?: {
        tagLine?: string
        bio?: string[]
        location?: string
        githubUrl?: string
        codetimeUrl?: string
        poem?: string
    }
    educations?: {
        school: string
        degree: string
        period: string
    }[]
    skills?: {
        category: string
        items: string[]
    }[]
}