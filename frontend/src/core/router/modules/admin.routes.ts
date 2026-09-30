import AdminLayout from '@/layouts/AdminLayout.vue'

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      // requiresAuth: true,
      // requiresAdmin: true,
    },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard/overview',
      },
      {
        path: 'dashboard',
        component: () => import('@/modules/admin/pages/AdminDashboardPage.vue'),
        children: [
          {
            path: '',
            redirect: 'overview',
          },
          {
            path: 'overview',
            name: 'admin-home-dashboard',
            component: () => import('@/modules/admin/pages/DashboardOverviewPage.vue'),
          },
          {
            path: 'content',
            name: 'admin-content',
            component: () => import('@/modules/admin/pages/ContentPage.vue'),
          },
          {
            path: 'users',
            name: 'admin-users',
            component: () => import('@/modules/admin/pages/UsersPage.vue'),
          },
          {
            path: 'roles',
            name: 'admin-roles',
            component: () => import('@/modules/admin/pages/RolesPage.vue'),
          },
          {
            path: 'spotlight',
            name: 'admin-spotlight',
            component: () => import('@/modules/admin/pages/SpotlightPage.vue'),
          },
          {
            path: 'features',
            name: 'admin-features',
            component: () => import('@/modules/admin/pages/FeaturesPage.vue'),
          },
          {
            path: 'settings',
            name: 'admin-settings',
            component: () => import('@/modules/admin/pages/SettingsPage.vue'),
          },
        ],
      },
    ],
  },
]

export default adminRoutes