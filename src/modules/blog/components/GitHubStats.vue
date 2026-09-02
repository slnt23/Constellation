<script setup lang="ts">
import { onMounted } from 'vue'
import { useGitHubStats } from '../composables/useGitHubStats'

const props = defineProps<{
    username: string
}>()

const { userData, loading, error, memberSince, totalContributions, fetchStats } = useGitHubStats(props.username)

onMounted(fetchStats)
</script>

<template>
    <div v-if="loading" class="github-stats-loading">
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
    </div>

    <div v-else-if="error" class="github-stats-error">
        <span>{{ error }}</span>
    </div>

    <div v-else-if="userData" class="github-stats">
        <div class="stat-item">
            <span class="stat-value">{{ userData.public_repos }}</span>
            <span class="stat-label">Repositories</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
            <span class="stat-value">{{ userData.followers }}</span>
            <span class="stat-label">Followers</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
            <span class="stat-value">{{ totalContributions }}</span>
            <span class="stat-label">Contributions</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
            <span class="stat-value">{{ memberSince }}</span>
            <span class="stat-label">Member Since</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.github-stats {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 16px 0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.stat-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-primary);
}

.stat-label {
    font-size: 12px;
    color: var(--color-text-muted);
    letter-spacing: 0.02em;
}

.stat-divider {
    width: 1px;
    height: 32px;
    background-color: var(--color-border);
}

.github-stats-loading {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 0;
}

.loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-text-muted);
    animation: pulse 1.4s ease-in-out infinite;

    &:nth-child(2) {
        animation-delay: 0.2s;
    }

    &:nth-child(3) {
        animation-delay: 0.4s;
    }
}

.github-stats-error {
    padding: 16px 0;
    font-size: 12px;
    color: var(--color-text-muted);
}

@keyframes pulse {

    0%,
    80%,
    100% {
        opacity: 0.3;
        transform: scale(0.8);
    }

    40% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>