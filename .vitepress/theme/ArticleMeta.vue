<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const fm = computed(() => (page.value.frontmatter || {}) as Record<string, any>)

// 只有文章详情页（sidebar: false 且带日期/分类）渲染 meta 头，目录页跳过
const isArticle = computed(
  () => fm.value.sidebar === false && Boolean(fm.value.date || fm.value.category)
)

onMounted(() => {
  if (isArticle.value) {
    document.querySelector('.vp-doc')?.classList.add('no-h1')
  }
})

const category = computed(() => String(fm.value.category || 'notes').toUpperCase())

const channelMap: Record<string, string> = {
  frontend: '前端',
  backend: '后端',
  tools: '工具',
  leetcode: '算法',
}

const tags = computed(() =>
  Array.isArray(fm.value.tags) ? fm.value.tags.map(String) : []
)

const kicker = computed(() => {
  const seg = (page.value.relativePath || '').split('/')
  const sub = channelMap[seg[1]] || channelMap[seg[0]] || ''
  const parts = [sub, ...tags.value.filter((t) => t !== sub && t !== '前端')]
  return parts.join(' · ')
})

const dateStr = computed(() => {
  const d = fm.value.date
  return d ? new Date(d).toISOString().slice(0, 10).replace(/-/g, '.') : ''
})
</script>

<template>
  <div v-if="isArticle" class="doc-meta">
    <p class="kicker">
      <span>{{ category }}</span>
      <template v-if="kicker">
        <span class="sep">/</span>
        <span>{{ kicker }}</span>
      </template>
    </p>
    <h1 class="doc-title">{{ fm.title || page.title }}</h1>
    <p class="meta-row">
      <span class="author">KEENNESS19</span>
      <span class="dot">·</span>
      <span>{{ dateStr || '—' }}</span>
      <template v-if="tags.length">
        <span class="spacer"></span>
        <span class="meta-tags">
          <span v-for="t in tags" :key="t" class="meta-tag">#{{ t }}</span>
        </span>
      </template>
    </p>
  </div>
</template>

<style scoped>
.doc-meta { margin-bottom: 8px; }

.kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-3);
}

.kicker .sep { color: var(--line); }

.doc-title {
  margin: 0 0 12px !important;
  font-size: 40px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
  border: 0;
  padding: 0;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 48px !important;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.meta-row .author { color: var(--text-2); }

.spacer { flex: 1; }

.meta-tags { display: inline-flex; gap: 12px; }
</style>
