import FrontLayout from '@/layouts/FrontLayout.vue'

const frontRoutes = [
  {
    path: '/',
    component: FrontLayout,
    children: [
      {
        path: '',
        name: 'front-home',
        component: () => import('@/modules/home/pages/HomePage.vue'),
      },
      {
        path: 'price-query',
        name: 'front-price-query',
        component: () => import('@/modules/price/pages/PriceMainPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'story',
        name: 'front-story',
        component: () => import('@/modules/gallery/pages/GalleryPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'ai-ai',
        name: 'front-ai-ai',
        component: () => import('@/modules/ai/pages/AiChatPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'blog',
        name: 'front-blog',
        component: () => import('@/modules/blog/pages/ResumePage.vue'),
        meta: {
          // requiresAuth: true,
        },
      },
      {
        path: 'blog/posts',
        name: 'front-blog-posts',
        component: () => import('@/modules/blog/pages/PostsPage.vue'),
        meta: {
          // requiresAuth: true,
        },
      },
      {
        path: 'blog/posts/:id',
        name: 'front-blog-post-detail',
        component: () => import('@/modules/blog/pages/PostDetailPage.vue'),
        meta: {
          openInNewTab: true,
        },
      },
      {
        path: 'meditations',
        name: 'front-meditations',
        component: () => import('@/modules/meditation/pages/MeditationPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'profile',
        name: 'front-profile',
        component: () => import('@/modules/user/pages/UserProfilePage.vue'),
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
]

export default frontRoutes