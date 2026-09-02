import request from '@/core/api/request'
import type { PageResult, Result } from '@/shared/types'

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

const BLOG_BASE_URL = '/blog'

export const blogApi = {
    list(): Promise<Result<BlogPostVO[]>> {
        return request.get(BLOG_BASE_URL)
    },

    page(pageNum = 1, pageSize = 10): Promise<Result<PageResult<BlogPostVO>>> {
        return request.get(`${BLOG_BASE_URL}/page`, { params: { pageNum, pageSize } })
    },

    allPage(pageNum = 1, pageSize = 10): Promise<Result<PageResult<BlogPostVO>>> {
        return request.get(`${BLOG_BASE_URL}/all/page`, { params: { pageNum, pageSize } })
    },

    getById(id: number): Promise<Result<BlogPostVO>> {
        return request.get(`${BLOG_BASE_URL}/${id}`)
    },

    create(data: BlogPostCreateDTO): Promise<Result<number>> {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'tags' && Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value))
                } else {
                    formData.append(key, value as string | Blob)
                }
            }
        })
        return request.post(BLOG_BASE_URL, formData)
    },

    update(id: number, data: BlogPostUpdateDTO): Promise<Result<null>> {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'id' && value !== undefined && value !== null) {
                if (key === 'tags' && Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value))
                } else {
                    formData.append(key, value as string | Blob)
                }
            }
        })
        return request.put(`${BLOG_BASE_URL}/${id}`, formData)
    },

    deleteById(id: number): Promise<Result<null>> {
        return request.delete(`${BLOG_BASE_URL}/${id}`)
    },
}