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
    sortOrder: number
}

export interface BlogPostUpdateDTO {
    id: number
    title: string
    excerpt?: string
    content: string
    cover?: File
    tags?: string[]
    sortOrder: number
}