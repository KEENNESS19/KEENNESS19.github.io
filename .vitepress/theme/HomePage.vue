<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { data } from './articles.data'
import type { ArticleInfo } from './articles.data'
import ArticleTable from './ArticleTable.vue'

const articles = ref<ArticleInfo[]>([])
const activeChannel = ref('全部')

/* 只统计真实文章，排除目录索引页 */
const posts = computed(() => articles.value.filter((a) => a.category))

onMounted(() => {
  articles.value = data as ArticleInfo[]

  let lastKey = ''
  const onKey = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    if (lastKey === 'g' && e.key.toLowerCase() === 'h') {
      window.location.href = '/'
    }
    lastKey = e.key.toLowerCase()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})

const CHANNELS = ['前端', '后端', '工具', '算法']

const channelCount = computed(() => {
  const map: Record<string, number> = {}
  CHANNELS.forEach((c) => { map[c] = 0 })
  posts.value.forEach((a) => { if (map[a.channel] !== undefined) map[a.channel]++ })
  return map
})

const list = computed(() => {
  if (activeChannel.value === '全部') return posts.value
  return posts.value.filter((a) => a.channel === activeChannel.value)
})

const latest = computed(() => posts.value[0])

const lastDate = computed(() => {
  const d = latest.value?.date
  return d ? d.replace(/-/g, '.') : '—'
})

const tagRank = computed(() => {
  const map = new Map<string, number>()
  posts.value.forEach((a) => a.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)))
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const topTags = computed(() => tagRank.value.slice(0, 6))

const meter = computed(() => {
  const total = posts.value.length || 1
  return CHANNELS.map((c) => ({
    name: c,
    ratio: (channelCount.value[c] || 0) / total,
  }))
})
</script>

<template>
  <section class="home">
    <div class="hero">
      <div class="hero-main">
        <p class="eyebrow">PERSONAL KNOWLEDGE BASE · {{ posts.length }} NOTES</p>
        <h1 class="hero-title">把学过的，<br />整理成能查的东西</h1>
        <p class="hero-lede">
          前端、后端与算法。笔记按主题归档，支持代码块、流程图与思维导图，随时能回来查。
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/notes/">浏览全部笔记</a>
          <a class="btn btn-ghost" href="/feed.rss">RSS 订阅</a>
        </div>
      </div>

      <aside class="status card">
        <div class="status-head">
          <span class="status-label">当前状态</span>
          <span class="live"><i class="live-dot"></i>LIVE</span>
        </div>
        <div class="status-row">
          <span class="status-key">最新笔记</span>
          <span class="status-value">{{ latest?.title || '—' }}</span>
        </div>
        <div class="status-row">
          <span class="status-key">上次更新</span>
          <span class="status-value">{{ lastDate }} · 共 {{ posts.length }} 篇</span>
        </div>
        <div class="status-row">
          <span class="status-key">覆盖主题</span>
          <div class="meter">
            <span
              v-for="m in meter"
              :key="m.name"
              class="meter-seg"
              :style="{ flexGrow: Math.max(m.ratio, 0.12), opacity: m.ratio > 0 ? 1 : 0.25 }"
            ></span>
          </div>
        </div>
      </aside>
    </div>

    <div class="filters">
      <div class="chips">
        <button
          class="chip"
          :class="{ active: activeChannel === '全部' }"
          @click="activeChannel = '全部'"
        >
          全部 <b>{{ posts.length }}</b>
        </button>
        <button
          v-for="c in CHANNELS"
          :key="c"
          class="chip"
          :class="{ active: activeChannel === c }"
          @click="activeChannel = c"
        >
          {{ c }} <b>{{ channelCount[c] }}</b>
        </button>
      </div>
      <span class="sort">按更新时间 ↓</span>
    </div>

    <div class="home-body">
      <ArticleTable
        :items="list.slice(0, 4)"
        :total="list.length"
        footer-href="/notes/"
        footer-label="查看全部"
      />

      <aside class="rail">
        <div class="card rail-card">
          <div class="rail-head">
            <span>分类</span>
            <span class="rail-count">{{ CHANNELS.length }}</span>
          </div>
          <button
            v-for="c in CHANNELS"
            :key="c"
            class="rail-row"
            :class="{ active: activeChannel === c }"
            @click="activeChannel = c"
          >
            <span>{{ c }}</span>
            <span class="rail-num">{{ channelCount[c] }}</span>
          </button>
        </div>

        <div class="card rail-card">
          <div class="rail-head">
            <span>常用标签</span>
            <span class="rail-count">{{ tagRank.length }}</span>
          </div>
          <div class="tag-cloud">
            <a
              v-for="t in topTags"
              :key="t.name"
              class="tag"
              :href="`/tags#${t.name}`"
            >
              {{ t.name }} <span>{{ t.count }}</span>
            </a>
          </div>
        </div>

        <div class="card rail-card">
          <div class="rail-head"><span>快捷键</span></div>
          <div class="shortcut">
            <span>全局搜索</span><kbd>⌘K</kbd>
          </div>
          <div class="shortcut">
            <span>回到首页</span><kbd>G H</kbd>
          </div>
          <div class="shortcut">
            <span>浏览标签</span><kbd>T</kbd>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.home {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 64px 96px;
  animation: home-in 280ms ease both;
}

@keyframes home-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- Hero ---------- */

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 64px;
  align-items: start;
  padding: 64px 0 56px;
}

.eyebrow { margin: 0 0 20px; }

.hero-title {
  margin: 0;
  font-size: 40px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.hero-lede {
  margin: 20px 0 0;
  max-width: 460px;
  font-size: 16px;
  line-height: 1.75;
  color: var(--text-2);
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid transparent;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease;
}

.btn-primary {
  background: var(--ink);
  color: #fff;
  border-color: var(--ink);
}

.btn-primary:hover {
  background: #000;
  border-color: #000;
}

.btn-ghost {
  background: var(--surface);
  color: var(--ink);
  border-color: var(--line);
}

.btn-ghost:hover { border-color: #CDD3D9; }

/* ---------- 状态卡 ---------- */

.status {
  padding: 20px;
}

.status-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.status-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}

.live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.live-dot {
  width: 5px;
  height: 5px;
  background: var(--accent);
  border-radius: 1px;
}

.status-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line-soft);
}

.status-row:last-child { border-bottom: 0; padding-bottom: 2px; }

.status-key {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--text-3);
}

.status-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--ink);
}

.meter {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  height: 4px;
}

.meter-seg {
  display: block;
  height: 4px;
  background: var(--accent);
  border-radius: 1px;
}

/* ---------- 筛选 ---------- */

.filters {
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

.sort {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--text-3);
  white-space: nowrap;
}

/* ---------- 主体 ---------- */

.home-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 24px;
  align-items: start;
}

.rail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rail-card { padding: 16px 20px 20px; }

.rail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}

.rail-count {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--text-3);
}

.rail-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 9px 0 9px 0;
  background: transparent;
  border: 0;
  font-family: var(--sans);
  font-size: 14px;
  color: var(--text-2);
  cursor: pointer;
  transition: color 180ms ease;
}

.rail-row:hover { color: var(--ink); }

.rail-row.active {
  padding-left: 12px;
  color: var(--ink);
  font-weight: 500;
}

.rail-row.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 16px;
  background: var(--accent);
  border-radius: 1px;
}

.rail-num {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 12px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: var(--surface-soft);
  border-radius: var(--radius);
  font-size: 12px;
  color: var(--ink-2);
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease;
}

.tag span {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
}

.tag:hover { background: #E7EAEE; color: var(--ink); }

.shortcut {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 0;
  font-size: 13px;
  color: var(--text-2);
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 6px;
  background: var(--surface-soft);
  border-radius: 6px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-2);
}

/* ---------- 响应式 ---------- */

@media (max-width: 1200px) {
  .hero { grid-template-columns: minmax(0, 1fr) 320px; gap: 40px; }
  .home-body { grid-template-columns: minmax(0, 1fr) 260px; }
}

@media (max-width: 1024px) {
  .home { padding: 0 32px 80px; }
  .hero { grid-template-columns: 1fr; gap: 32px; padding: 48px 0 40px; }
  .home-body { grid-template-columns: 1fr; }
  .rail { flex-direction: row; flex-wrap: wrap; }
  .rail-card { flex: 1 1 240px; }
}

@media (max-width: 768px) {
  .home { padding: 0 20px 64px; }
  .hero-title { font-size: 30px; }
  .hero-lede { font-size: 15px; }
  .filters { flex-direction: column; align-items: flex-start; gap: 12px; }
  .rail { flex-direction: column; }
}
</style>
