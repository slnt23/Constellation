import request from '@/core/api/request'
import type { PageResult, Result } from '@/shared/types'
import type { GalleryCreateDTO, GalleryItemVO, GalleryUpdateDTO } from '@/modules/gallery/types'

const GALLERY_BASE_URL = '/gallery'

export const galleryApi = {
    list(): Promise<Result<GalleryItemVO[]>> {
        return request.get(GALLERY_BASE_URL)
    },

    page(pageNum = 1, pageSize = 10): Promise<Result<PageResult<GalleryItemVO>>> {
        return request.get(`${GALLERY_BASE_URL}/page`, { params: { pageNum, pageSize } })
    },

    getById(id: number): Promise<Result<GalleryItemVO>> {
        return request.get(`${GALLERY_BASE_URL}/${id}`)
    },

    create(data: GalleryCreateDTO): Promise<Result<number>> {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob)
            }
        })
        return request.post(GALLERY_BASE_URL, formData)
    },

    update(id: number, data: GalleryUpdateDTO): Promise<Result<null>> {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob)
            }
        })
        return request.put(`${GALLERY_BASE_URL}/${id}`, formData)
    },

    deleteById(id: number): Promise<Result<null>> {
        return request.delete(`${GALLERY_BASE_URL}/${id}`)
    },
}