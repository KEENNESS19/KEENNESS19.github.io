<script setup lang="ts">
import type { ArticleInfo } from './articles.data'

withDefaults(
  defineProps<{
    items: ArticleInfo[]
    total?: number
    footerHref?: string
    footerLabel?: string
  }>(),
  { total: 0, footerHref: '/notes/', footerLabel: '查看全部' }
)

function fmtDate(d: string) {
  return d ? d.replace(/-/g, '.') : '—'
}
</script>

<template>
  <div class="table-card">
    <div class="thead">
      <span>Date</span>
      <span>Title</span>
      <span>Tags</span>
      <span>Read</span>
    </div>

    <p v-if="items.length === 0" class="empty">暂无笔记</p>

    <a v-for="a in items" :key="a.url" class="row" :href="a.url">
      <span class="cell-date">{{ fmtDate(a.date) }}</span>
      <span class="cell-main">
        <span class="cell-title">{{ a.title }}</span>
        <span v-if="a.description" class="cell-desc">{{ a.description }}</span>
      </span>
      <span class="cell-tags">
        <span v-for="t in a.tags.slice(0, 2)" :key="t" class="cell-tag">#{{ t }}</span>
      </span>
      <span class="cell-read">{{ a.readingTime }} 分</span>
    </a>

    <div class="tfoot">
      <span>显示 {{ items.length }} / {{ total || items.length }}</span>
      <a :href="footerHref" class="more">{{ footerLabel }} →</a>
    </div>
  </div>
</template>

<style scoped>
.table-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
}

.thead,
.row {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 180px 56px;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
}

.thead {
  height: 40px;
  border-bottom: 1px solid var(--line);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-3);
}

.row {
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--line-soft);
  text-decoration: none;
  transition: background-color 180ms ease;
}

.row:last-of-type { border-bottom: 0; }

.row:hover { background: var(--surface-sunk); }

.cell-date {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
  letter-spacing: 0.02em;
}

.cell-main {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.cell-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--ink);
  transition: color 180ms ease;
}

.row:hover .cell-title { color: var(--accent); }

.cell-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cell-tag {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  white-space: nowrap;
}

.cell-read {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
  text-align: right;
  white-space: nowrap;
}

.empty {
  margin: 0;
  padding: 48px 20px;
  text-align: center;
  font-size: 14px;
  color: var(--text-3);
}

.tfoot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 20px;
  border-top: 1px solid var(--line);
  background: var(--surface);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.more {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  text-decoration: none;
  transition: color 180ms ease;
}

.more:hover { color: var(--accent); }

@media (max-width: 900px) {
  .thead, .row { grid-template-columns: 88px minmax(0, 1fr) 56px; gap: 12px; }
  .cell-tags { display: none; }
}

@media (max-width: 640px) {
  .thead, .row { grid-template-columns: minmax(0, 1fr) 56px; padding: 0 16px; }
  .thead span:first-child { display: none; }
  .cell-date { display: none; }
  .cell-title { font-size: 14px; }
  .cell-desc { white-space: normal; }
}
</style>
