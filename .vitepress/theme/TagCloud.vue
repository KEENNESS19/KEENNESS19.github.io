<script setup lang="ts">
import { computed, ref } from 'vue'
import { data } from './articles.data'
import type { ArticleInfo } from './articles.data'
import ArticleTable from './ArticleTable.vue'

const articles = data as ArticleInfo[]
const selected = ref('')

const tagRank = computed(() => {
  const map = new Map<string, number>()
  articles.forEach((a) => a.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)))
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const filtered = computed(() =>
  selected.value ? articles.filter((a) => a.tags.includes(selected.value)) : []
)
</script>

<template>
  <div class="tag-page">
    <div class="tag-head">
      <span class="tag-eyebrow">所有标签</span>
      <span class="tag-total">{{ tagRank.length }}</span>
    </div>

    <div class="tag-list">
      <button
        v-for="t in tagRank"
        :key="t.name"
        class="tag"
        :class="{ active: selected === t.name }"
        @click="selected = selected === t.name ? '' : t.name"
      >
        {{ t.name }} <span>{{ t.count }}</span>
      </button>
    </div>

    <Transition name="fade">
      <div v-if="selected" class="tag-result">
        <div class="result-head">
          <span class="tag-eyebrow">标签 · {{ selected }}</span>
          <span class="tag-total">{{ filtered.length }}</span>
          <button class="clear" @click="selected = ''">清除</button>
        </div>
        <ArticleTable
          :items="filtered"
          :total="filtered.length"
          footer-href="/notes/"
          footer-label="全部笔记"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tag-page { margin-top: 24px; }

.tag-head,
.result-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 20px;
}

.tag-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
}

.tag-total {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 48px;
}

.tag {
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

.tag span {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
}

.tag:hover { border-color: #CDD3D9; color: var(--ink); }

.tag.active {
  background: var(--ink);
  border-color: var(--ink);
  color: #fff;
}

.tag.active span { color: rgba(255, 255, 255, 0.6); }

.result-head { margin-top: 0; }

.clear {
  margin-left: auto;
  padding: 0;
  background: transparent;
  border: 0;
  font-family: var(--sans);
  font-size: 13px;
  color: var(--text-3);
  cursor: pointer;
  transition: color 180ms ease;
}

.clear:hover { color: var(--ink); }

.tag-result { margin-bottom: 24px; }

.fade-enter-active,
.fade-leave-active { transition: opacity 180ms ease, transform 180ms ease; }

.fade-enter-from,
.fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
