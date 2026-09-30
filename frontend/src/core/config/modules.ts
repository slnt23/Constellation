import { dashboardModule } from './modules/admin/dashboard.module.ts'
import { contentModule } from './modules/admin/content.module.ts'
import { settingsModule } from './modules/admin/settings.module.ts'
import { aboutModule } from './modules/front/about.module.ts'
import { blogModule } from './modules/front/blog.module.ts'
import { projectsModule } from './modules/front/projects.module.ts'

import type { AppModule, ModuleGroup } from '@/shared/types'

const registry: AppModule[] = [
  aboutModule,
  blogModule,
  projectsModule,
  dashboardModule,
  contentModule,
  settingsModule,
]

export const portalModules = registry.reduce(
  (acc: { front: AppModule[]; admin: AppModule[] }, module: AppModule) => {
    acc[module.portal].push(module)
    return acc
  },
  {
    front: [],
    admin: [],
  },
)

export const groupedModules = Object.fromEntries(
  Object.entries(portalModules).map(([portal, modules]) => [
    portal,
    modules.reduce((groups: ModuleGroup[], module: AppModule) => {
      const existing = groups.find((item) => item.key === module.group.key)

      if (existing) {
        existing.modules.push(module)
      } else {
        groups.push({
          ...module.group,
          modules: [module],
        })
      }

      return groups
    }, []),
  ]),
)

export const moduleStats = {
  total: registry.length,
  front: portalModules.front.length,
  admin: portalModules.admin.length,
  status: {
    online: registry.filter((module) => module.status === 'online').length,
    planning: registry.filter((module) => module.status === 'planning').length,
    building: registry.filter((module) => module.status === 'building').length,
  },
}
