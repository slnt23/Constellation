import type {NavSection} from '@/types'

/** 管理后台侧栏导航（图标由 Element Plus 映射解析） */
export const ADMIN_DASHBOARD_NAV_SECTIONS: NavSection[] = [
    {
        items: [
            {id: 'overview', label: '控制台总览', icon: 'monitor', navigable: true},
            {id: 'content', label: '内容管理', icon: 'folder', navigable: true},
            {id: 'settings', label: '系统设置', icon: 'setting', navigable: true},
        ],
    },
    {
        title: '用户管理',
        items: [
            {id: 'user', label: '用户', icon: 'user', navigable: true},
            {id: 'role', label: '角色', icon: 'user', navigable: true},
        ]
    },
    {
        title: '前台管理',
        items: [
            {id: 'spotlight', label: '焦点项目', icon: 'view', navigable: true},
            {id: 'feature', label: '特性管理', icon: 'box', navigable: true},
        ]
    },
    {}
]
