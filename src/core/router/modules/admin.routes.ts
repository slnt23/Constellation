import AdminLayout from '@/layouts/AdminLayout.vue'
import {
  AdminDashboardPage,
  ContentPage,
  DashboardOverviewPage,
  FeaturesPage,
  RolesPage,
  SettingsPage,
  SpotlightPage,
  UsersPage,
} from '@/modules/admin'

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
        component: AdminDashboardPage,
        children: [
          {
            path: '',
            redirect: 'overview',
          },
          {
            path: 'overview',
            name: 'admin-home-dashboard',
            component: DashboardOverviewPage,
          },
          {
            path: 'content',
            name: 'admin-content',
            component: ContentPage,
          },
          {
            path: 'users',
            name: 'admin-users',
            component: UsersPage,
          },
          {
            path: 'roles',
            name: 'admin-roles',
            component: RolesPage,
          },
          {
            path: 'spotlight',
            name: 'admin-spotlight',
            component: SpotlightPage,
          },
          {
            path: 'features',
            name: 'admin-features',
            component: FeaturesPage,
          },
          {
            path: 'settings',
            name: 'admin-settings',
            component: SettingsPage,
          },
        ],
      },
    ],
  },
]

export default adminRoutes
