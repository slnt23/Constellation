import FrontLayout from '@/layouts/FrontLayout.vue'
import { AiChatPage } from '@/modules/ai'
import { PriceMainPage } from '@/modules/price'
import { UserProfilePage } from '@/modules/user'
import { HomePage } from '@/modules/home'
import { GalleryPage } from '@/modules/gallery'
import { PostsPage, ResumePage, PostDetailPage } from '@/modules/blog'
import { MeditationPage } from '@/modules/meditation'


const frontRoutes = [
  {
    path: '/',
    component: FrontLayout,
    children: [
      {
        path: '',
        name: 'front-home',
        component: HomePage,
      },
      {
        path: 'price-query',
        name: 'front-price-query',
        component: PriceMainPage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'story',
        name: 'front-story',
        component: GalleryPage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'ai-ai',
        name: 'front-ai-ai',
        component: AiChatPage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'blog',  //虽然展示，但是界面并不完善，后续会继续完善
        name: 'front-blog',
        component: ResumePage,
        meta: {
          // requiresAuth: true,
        },
      },
      {
        path: 'blog/posts',  //虽然展示，但是界面并不完善，后续会继续完善
        name: 'front-blog-posts',
        component: PostsPage,
        meta: {
          // requiresAuth: true,
        },
      },
      {
        path: 'blog/posts/:id',
        name: 'front-blog-post-detail',
        component: PostDetailPage,
        meta: {
          // requiresAuth: true,
        },
      },
      {
        path: 'meditations', //暂时不展示
        name: 'front-meditations',
        component: MeditationPage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'profile',
        name: 'front-profile',
        component: UserProfilePage,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
]

export default frontRoutes