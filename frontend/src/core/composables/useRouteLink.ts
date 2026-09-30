import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

export interface UseRouteLinkOptions {
    to: RouteLocationRaw
}

export interface UseRouteLinkReturn {
    href: string
    target: '_blank' | '_self'
    rel?: string
}

/**
 * 根据路由配置自动判断是否在新窗口打开
 * 如果路由 meta 中设置了 openInNewTab: true，则返回 target="_blank"
 */
export function useRouteLink(options: UseRouteLinkOptions): UseRouteLinkReturn {
    const router = useRouter()
    const resolved = router.resolve(options.to)
    const openInNewTab = resolved.meta?.openInNewTab === true

    return {
        href: resolved.href,
        target: openInNewTab ? '_blank' : '_self',
        rel: openInNewTab ? 'noopener noreferrer' : undefined,
    }
}