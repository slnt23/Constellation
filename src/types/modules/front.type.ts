// import type {IconKey, ProfileSectionId} from "@/types";


export interface MenuItem {
    title: string
    subtitle: string
    path: string
    image: string
    size?: 'large' | 'normal' | 'small'
}


export interface SpotlightItem {
    /** 主键 */
    id: number
    /** 眉题 */
    eyebrow: string
    /** 主标题 */
    title: string
    /** 描述 */
    description?: string
    /** 图片 URL */
    imageUrl: string
    /** 排序，值越小越靠前 */
    sortOrder: number
    /** 跳转链接 */
    link?: string
    /** 打开方式，如 _blank */
    target?: string
}

export interface FeatureItem {
    /** 图标标识（必填），示例：'01'、'🔥'、'star' */
    icon?: string;

    /** 标题（必填），建议7字以内 */
    title: string;

    /** 描述文案（必填），建议50字以内 */
    description: string;

    /** 排序序号（必填），数值越小越靠前 */
    sortOrder?: number;

    /** 数据主键，新增时不传，修改时必传 */
    id?: number;
}






export interface SectionIntroData {
    eyebrow: string
    title: string
    description: string
}

export interface StatItem {
    value: number
    label: string
    prefix?: string
    suffix?: string
}


export interface StoryGalleryItem {
    title: string
    description: string
    image: string
    thumbnail: string
}


export interface ProfileSelectOption {
    value: string
    label: string
}

export interface ProfileInfoExample {
    label: string
    value: string
}

export interface ProfileCardExample {
    title: string
    description: string
}



export interface ModuleGroup {
    key: string
    title: string
    description: string
    modules: AppModule[]
}

export interface AppModule {
    key: string
    portal: 'front' | 'admin'
    title: string
    description: string
    scope: string
    nextStep: string
    status: 'online' | 'planning' | 'building'
    statusLabel: string
    group: {
        key: string
        title: string
        description: string
    }
}



// 用户profile栏，
// export interface ProfileSettingsNavSection {
//     title?: string
//     items?: ProfileSettingsNavItem[]
// }
//
// export interface ProfileSettingsNavItem {
//     id: ProfileSectionId
//     label: string
//     icon: IconKey
//     badge?: string
//     expandable?: boolean
//     /** 为 false 时仅展示，不更新当前选中项（占位或后续再接路由） */
//     navigable?: boolean
//     disabled?: boolean
// }
