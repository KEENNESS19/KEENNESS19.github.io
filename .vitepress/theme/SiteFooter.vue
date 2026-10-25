<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const shifted = computed(() => route.path !== '/')
</script>

<template>
  <footer class="site-footer" :class="{ shifted }">
    <div class="footer-inner">
      <div class="footer-left">
        <svg class="mark" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6 L5.6 2.2 L9.4 5.9" />
          <path d="M14.6 5.9 L18.4 2.2 L20 6" />
          <rect x="3.2" y="5.4" width="17.6" height="15.4" rx="2.4" />
          <rect class="eye" x="7.6" y="11" width="2.2" height="2.2" />
          <rect class="eye" x="14.2" y="11" width="2.2" height="2.2" />
        </svg>
        <span class="brand">KEENNESS19</span>
        <span class="copy">2026 · KEENNESS19</span>
      </div>

      <nav class="footer-links">
        <a href="/notes/">笔记</a>
        <a href="/leetcode/">题解</a>
        <a href="/tags">标签</a>
        <a href="/feed.rss">RSS</a>
        <a href="https://github.com/KEENNESS19" target="_blank" rel="noreferrer">GitHub</a>
        <span class="build">构建 2026.10.17</span>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--line);
  background: var(--bg);
}

.shifted {
  padding-left: var(--vp-sidebar-width);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: var(--container);
  height: 72px;
  margin: 0 auto;
  padding: 0 64px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mark {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.6;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.mark .eye {
  fill: var(--accent);
  stroke: none;
}

.brand {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--ink);
}

.copy {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer-links a {
  font-size: 13px;
  color: var(--text-2);
  text-decoration: none;
  transition: color 180ms ease;
}

.footer-links a:hover { color: var(--ink); }

.build {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

@media (max-width: 1024px) {
  .footer-inner { padding: 0 32px; }
}

@media (max-width: 960px) {
  .shifted { padding-left: 0; }
}

@media (max-width: 768px) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    gap: 12px;
    padding: 20px;
  }
  .footer-links { flex-wrap: wrap; gap: 16px; }
}
</style>
