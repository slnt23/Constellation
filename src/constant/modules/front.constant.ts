import type { UserInfoVO } from '@/types'
import type { NavSection } from '@/types'
import type { MenuItem } from '@/types'
import type { SectionIntroData } from '@/types'
import menuImagePriceQuery from '@/assets/front/MENU_PRICE_SEARCH.png'
import menuImageView from '@/assets/front/MENU_VIEW.png'
import menuImageAiChat from '@/assets/front/MENU_AI_CHAT.png'
import menuImageBlog from '@/assets/front/MENU_BLOG.png'
import projectImageOne from '@/assets/example/default_avatar.png'


// 默认用户信息，用于未登录状态下的展示
export const EXAMPLE_PUBLIC_PROFILE_DEFAULTS: UserInfoVO = {
    id: 0,
    userCode: '',
    userName: '默认用户A',           // 用户名（小写）
    nickname: '默认昵称A',           // 昵称/显示名
    email: '123@qq.comA',
    phone: '110A',
    remark: '默认备注A',
    role: 'UserA',            // 角色
    avatarUrl: projectImageOne as string,
    createTime: '',
}

// GitHub 风格设置侧栏：用户，
export const PROFILE_SETTINGS_NAV_SECTIONS: NavSection[] = [
    {
        items: [
            { id: 'public', label: '公开资料', icon: 'user', navigable: true, },
            { id: 'account', label: '账户', icon: 'setting', navigable: true, },
            // { id: 'appearance', label: '外观', icon: 'brush', navigable: true, },
        ]
    },
    {
        title: '访问',
        items: [
            { id: 'access-billing', label: '账单与许可', icon: 'creditCard', expandable: true, navigable: false, },
        ],
    },
    {
        // 用来与退出登陆分隔
    }
]


// 每个菜单项包含标题、副标题、路径、图片和大小信息
export const FRONT_MENU_ITEMS: MenuItem[] = [
    {
        title: '价格行情',
        subtitle: '查看最新价格与走势，趋势一览',
        path: '/price-query',
        image: menuImagePriceQuery,
        size: 'large',
    },
    {
        title: '沿途纪事',
        subtitle: '每一页，都是一段旅程',
        path: '/story',
        image: menuImageView,
        size: 'normal',
    },
    {
        title: 'AI伴聊',
        subtitle: ' 聊聊界面，试试手感',
        path: '/ai-ai',
        image: menuImageAiChat,
        size: 'small',
    },
    {
        title: '写点什么(博客)',
        subtitle: '记录日常与思考',
        path: '/blog',
        image: menuImageBlog,
        size: 'small',
    },
]

// 首页内容区的介绍数据，每个对象包含眉头、标题和描述
export const HOME_SECTION_INTROS: SectionIntroData[] = [
    {
        eyebrow: '内容精选',
        title: 'Curated Highlights',
        description: '值得浏览的内容与最新呈现',
    },
    {
        eyebrow: '探索发现',
        title: 'Creative Discoveries',
        description: '围绕兴趣、创作与体验的核心内容集合',
    },
    {
        eyebrow: '了解更多',
        title: 'Explore More',
        description: '进入各个功能模块，发现更多有趣的内容与服务',
    },
]
