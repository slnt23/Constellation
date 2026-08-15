import type { MenuItem } from '@/shared/types'
import menuImagePriceQuery from '@/shared/assets/front/MENU_PRICE_SEARCH.png'
import menuImageView from '@/shared/assets/front/MENU_VIEW.png'
import menuImageAiChat from '@/shared/assets/front/MENU_AI_CHAT.png'
import menuImageBlog from '@/shared/assets/front/MENU_BLOG.png'

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
