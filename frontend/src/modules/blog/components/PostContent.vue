<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import type { BlogPostVO } from '@/modules/blog/types'
import { formatDate } from '@/modules/blog/utils/date'

const props = defineProps<{
    post: BlogPostVO
}>()

const renderedContent = computed(() => {
    return marked.parse(props.post.content || '') as string
})
</script>

<template>
    <article class="post-content">
        <!-- Header -->
        <header class="post-header">
            <time class="post-date" :datetime="post.createTime">
                {{ formatDate(post.createTime) }}
            </time>
            <h1 class="post-title">{{ post.title }}</h1>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
            </div>
        </header>

        <!-- Cover Image -->
        <div v-if="post.coverUrl" class="post-cover">
            <img :src="post.coverUrl" :alt="post.title" />
        </div>

        <!-- Markdown Content -->
        <div class="post-body markdown-content" v-html="renderedContent"></div>
    </article>
</template>

<style scoped lang="scss">
.post-content {
    max-width: 800px;
    margin: 0 auto;
}

.post-header {
    margin-bottom: 32px;
}

.post-date {
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 0.8rem;
    color: var(--color-muted-foreground);
}

.post-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 12px 0;
    color: var(--color-text-deep);
    line-height: 1.3;
}

.post-excerpt {
    font-size: 1.1rem;
    color: var(--color-muted-foreground);
    margin: 0 0 16px;
    line-height: 1.6;
}

.post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.post-tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.8rem;
    color: var(--color-muted-foreground);
}

.post-cover {
    margin-bottom: 32px;
    border-radius: 12px;
    overflow: hidden;

    img {
        width: 100%;
        height: auto;
        display: block;
    }
}

.post-body {
    line-height: 1.8;
    color: var(--color-text-deep);
}

/* Markdown content styles */
.markdown-content {
    :deep(h1) {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 32px 0 16px;
        color: var(--color-text-deep);
    }

    :deep(h2) {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 28px 0 12px;
        color: var(--color-text-deep);
    }

    :deep(h3) {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 24px 0 10px;
        color: var(--color-text-deep);
    }

    :deep(p) {
        margin: 0 0 16px;
        line-height: 1.8;
    }

    :deep(a) {
        color: var(--color-primary);
        text-decoration: underline;
        transition: opacity 0.2s ease;

        &:hover {
            opacity: 0.8;
        }
    }

    :deep(code) {
        padding: 2px 6px;
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 0.9em;
    }

    :deep(pre) {
        padding: 16px;
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        overflow-x: auto;
        margin: 16px 0;

        code {
            padding: 0;
            background: none;
            border: none;
        }
    }

    :deep(blockquote) {
        margin: 16px 0;
        padding: 12px 16px;
        border-left: 4px solid var(--color-primary);
        background: rgba(0, 0, 0, 0.02);
        border-radius: 0 8px 8px 0;
        color: var(--color-muted-foreground);
    }

    :deep(ul),
    :deep(ol) {
        margin: 16px 0;
        padding-left: 24px;
    }

    :deep(li) {
        margin: 8px 0;
        line-height: 1.6;
    }

    :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 16px 0;
    }

    :deep(hr) {
        margin: 32px 0;
        border: none;
        border-top: 1px solid var(--color-border);
    }

    :deep(table) {
        width: 100%;
        margin: 16px 0;
        border-collapse: collapse;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        overflow: hidden;
    }

    :deep(th),
    :deep(td) {
        padding: 10px 12px;
        border: 1px solid var(--color-border);
        text-align: left;
    }

    :deep(th) {
        background: var(--color-background);
        font-weight: 600;
    }
}

@media (max-width: 768px) {
    .post-title {
        font-size: 1.5rem;
    }

    .post-excerpt {
        font-size: 1rem;
    }

    .markdown-content {
        :deep(h1) {
            font-size: 1.5rem;
        }

        :deep(h2) {
            font-size: 1.3rem;
        }

        :deep(h3) {
            font-size: 1.1rem;
        }
    }
}
</style>