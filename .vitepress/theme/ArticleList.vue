<script setup lang="ts">
import { computed, ref } from 'vue'
import { data } from './articles.data'
import type { ArticleInfo } from './articles.data'
import ArticleTable from './ArticleTable.vue'

const props = defineProps<{
  category?: string
  tag?: string
  prefix?: string
  limit?: number
}>()

const articles = (data as ArticleInfo[]).filter(
  (a) =>
    (a.category === props.category || !props.category) &&
    (!props.prefix || a.url.startsWith(props.prefix))
)

const activeChip = ref('全部')

const isLeetcode = computed(() => props.category === 'leetcode')

const chips = computed(() => {
  if (isLeetcode.value) {
    const set = new Set(articles.map((a) => a.difficulty).filter(Boolean) as string[])
    return ['全部', ...Array.from(set)]
  }
  const set = new Set(articles.map((a) => a.channel).filter(Boolean))
  return ['全部', ...Array.from(set)]
})

const difficultyLabel: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}

const list = computed(() => {
  let result = articles
  if (props.tag) result = result.filter((a) => a.tags.includes(props.tag as string))
  if (activeChip.value !== '全部') {
    result = result.filter((a) =>
      isLeetcode.value
        ? a.difficulty === activeChip.value
        : a.channel === activeChip.value
    )
  }
  return props.limit ? result.slice(0, props.limit) : result
})

const withLabels = computed(() =>
  list.value.map((a) => ({
    ...a,
    title: a.title,
    description: a.description,
  }))
)

function chipLabel(c: string) {
  return difficultyLabel[c] || c
}
</script>

<template>
  <div class="article-list">
    <div v-if="!props.prefix" class="list-head">
      <div class="chips">
        <button
          v-for="c in chips"
          :key="c"
          class="chip"
          :class="{ active: activeChip === c }"
          @click="activeChip = c"
        >
          {{ chipLabel(c) }}
          <b>{{ c === '全部' ? articles.length : articles.filter((a) => (isLeetcode ? a.difficulty : a.channel) === c).length }}</b>
        </button>
      </div>
      <span class="count">{{ list.length }} 篇 · 按更新时间</span>
    </div>

    <ArticleTable
      :items="withLabels"
      :total="list.length"
      footer-href="/tags"
      footer-label="按标签浏览"
    />
  </div>
</template>

<style scoped>
.article-list {
  margin-top: 32px;
}

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-family: var(--sans);
  font-size: 13px;
  color: var(--text-2);
  cursor: pointer;
  transition: border-color 180ms ease, color 180ms ease, background-color 180ms ease;
}

.chip b {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--text-3);
}

.chip:hover { border-color: #CDD3D9; color: var(--ink); }

.chip.active {
  background: var(--ink);
  border-color: var(--ink);
  color: #fff;
}

.chip.active b { color: rgba(255, 255, 255, 0.6); }

.count {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--text-3);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .list-head { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>
