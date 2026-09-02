export interface GalleryItemVO {
    id: number
    userId: number
    title: string
    description: string
    imageUrl: string
    thumbnailUrl: string
    sortOrder: number
}

export interface GalleryItemDTO {
    id?: number
    title: string
    description?: string
    image?: File
    thumbnail?: File
    sortOrder: number
}

export type GalleryCreateDTO = Omit<GalleryItemDTO, 'id'>

export type GalleryUpdateDTO = GalleryItemDTO