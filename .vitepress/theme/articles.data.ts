import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface ArticleInfo {
  url: string
  title: string
  date: string
  tags: string[]
  category: string
  description: string
  difficulty?: string
  channel: string
  readingTime: number
  codeBlocks: number
}

const CHANNEL_MAP: Record<string, string> = {
  frontend: '前端',
  backend: '后端',
  tools: '工具',
  leetcode: '算法',
}

function resolveChannel(url: string, category: string) {
  const seg = url.split('/').filter(Boolean)
  if (seg[0] === 'leetcode') return CHANNEL_MAP.leetcode
  const sub = seg[1]
  return CHANNEL_MAP[sub] || (category === 'leetcode' ? CHANNEL_MAP.leetcode : '笔记')
}

function estimateReadingTime(body: string) {
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) || []).length
  const words = (body.match(/[A-Za-z0-9_]+/g) || []).length
  return Math.max(1, Math.round(cjk / 400 + words / 220))
}

function countCodeBlocks(body: string) {
  return Math.floor((body.match(/^```/gm) || []).length / 2)
}

export default {
  load(): ArticleInfo[] {
    const docsDir = path.resolve(__dirname, '../../docs')
    const articles: ArticleInfo[] = []

    function walk(dir: string, baseUrl: string = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relPath = baseUrl ? `${baseUrl}/${entry.name}` : entry.name

        if (entry.isDirectory()) {
          if (entry.name === 'public' || entry.name === 'tags') continue
          walk(fullPath, relPath)
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const content = fs.readFileSync(fullPath, 'utf-8')
          const { data, content: body } = matter(content)

          if (data.layout === 'home') continue
          // 知识库大纲是元页面：不进侧栏/RSS，也不进文章列表（只从笔记页顶部的链接进入）
          if (relPath.replace(/\\/g, '/') === 'notes/大纲.md') continue

          let title = data.title
          if (!title) {
            const match = body.match(/^#\s+(.+)$/m)
            if (match) title = match[1]
          }
          if (!title) continue

          let url = '/' + relPath.replace(/\\/g, '/').replace(/\.md$/, '')
          url = url.replace(/\/index$/, '/')
          if (url === '/index') url = '/'

          const dateStr = data.date
            ? new Date(data.date).toISOString().slice(0, 10)
            : ''

          const category = data.category ? String(data.category) : ''

          articles.push({
            url,
            title: String(title),
            date: dateStr,
            tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
            category,
            description: data.description ? String(data.description) : '',
            difficulty: data.difficulty ? String(data.difficulty) : undefined,
            channel: resolveChannel(url, category),
            readingTime: estimateReadingTime(body),
            codeBlocks: countCodeBlocks(body),
          })
        }
      }
    }

    walk(docsDir)

    articles.sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return b.date.localeCompare(a.date)
    })

    return articles
  },
}
