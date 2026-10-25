import type MarkdownIt from 'markdown-it'
import { glossary } from '../glossary'

/**
 * 站内术语链接插件。
 *
 * 语法：[[术语]] 或 [[术语|别名]]
 * 术语必须在 .vitepress/glossary.ts 中注册；未注册的 [[xx]] 原样保留，
 * 构建产物里肉眼可见，方便发现漏登的术语。
 */
export function termLinks(md: MarkdownIt): void {
  md.inline.ruler.before('link', 'term_links', (state, silent) => {
    const src = state.src
    const pos = state.pos

    if (src.charCodeAt(pos) !== 0x5b || src.charCodeAt(pos + 1) !== 0x5b) return false

    const end = src.indexOf(']]', pos + 2)
    if (end === -1) return false

    const raw = src.slice(pos + 2, end)
    // 嵌套方括号或换行都视为普通文本，避免误吞
    if (raw.includes('[') || raw.includes(']') || raw.includes('\n')) return false

    const sep = raw.indexOf('|')
    const term = (sep === -1 ? raw : raw.slice(0, sep)).trim()
    const alias = sep === -1 ? '' : raw.slice(sep + 1).trim()

    const entry = glossary[term]
    if (!entry) return false

    if (!silent) {
      const open = state.push('link_open', 'a', 1)
      open.attrs = [
        ['href', entry.href],
        ['class', 'term-link'],
      ]
      if (entry.desc) open.attrs.push(['title', entry.desc])

      const text = state.push('text', '', 0)
      text.content = alias || term

      state.push('link_close', 'a', -1)
    }

    state.pos = end + 2
    return true
  })
}
