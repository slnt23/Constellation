import { ref, computed } from 'vue'

interface GitHubUser {
    name: string
    public_repos: number
    followers: number
    following: number
    public_gists: number
    created_at: string
}

interface GitHubEvent {
    id: string
    type: string
    created_at: string
    repo: { name: string }
}

export function useGitHubStats(username: string) {
    const userData = ref<GitHubUser | null>(null)
    const events = ref<GitHubEvent[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const memberSince = computed(() => {
        if (!userData.value) return ''
        const date = new Date(userData.value.created_at)
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    })

    const totalContributions = computed(() => {
        if (!events.value.length) return 0
        return events.value.length
    })

    async function fetchStats() {
        loading.value = true
        error.value = null

        try {
            const [userRes, eventsRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/events/public?per_page=100`),
            ])

            if (!userRes.ok) throw new Error('Failed to fetch user data')

            userData.value = await userRes.json()

            if (eventsRes.ok) {
                events.value = await eventsRes.json()
            }
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Unknown error'
        } finally {
            loading.value = false
        }
    }

    return {
        userData,
        events,
        loading,
        error,
        memberSince,
        totalContributions,
        fetchStats,
    }
}