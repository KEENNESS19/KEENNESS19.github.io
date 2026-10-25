import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'
import { RssPlugin, RSSOptions } from 'vitepress-plugin-rss'
import { termLinks } from './markdown/term-links'

const baseUrl = 'https://KEENNESS19.github.io'

const RSS: RSSOptions = {
  title: 'KEENNESS19',
  baseUrl,
  copyright: 'Copyright © 2026 KEENNESS19',
  // 目录/列表页、标签页与大纲不进订阅源
  filter: (post) => !/[/\\](index|tags|大纲)\.md$/i.test(post.filepath),
}

const vitePressConfig = {
  title: 'KEENNESS19',
  description: '知识库 · 笔记 · 题解',
  lang: 'zh-CN',
  appearance: false,
  srcDir: 'docs',
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#F6F7F9' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  markdown: {
    theme: 'github-dark',
    lineNumbers: true,
    config: (md) => {
      md.use(termLinks)
    },
  },

  vite: {
    plugins: [RssPlugin(RSS)],
    // 让 Vite 用 React 的 automatic JSX runtime 编译知识插件（.jsx）
    esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
  },

  themeConfig: {
    siteTitle: 'KEENNESS19',
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
      { text: '题解', link: '/leetcode/' },
      { text: '标签', link: '/tags' },
    ],
    outline: { level: [2, 3], label: '目录' },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索笔记', buttonAriaLabel: '搜索笔记' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
}

export default defineConfig(
  withSidebar(vitePressConfig, {
    documentRootPath: '/',
    scanStartPath: 'docs',
    resolvePath: '/',
    useTitleFromFrontmatter: true,
    useTitleFromFileHeading: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    collapsed: true,
    collapseDepth: 2,
    sortMenusByFrontmatterOrder: true,
    sortMenusOrderByDescending: false,
    excludeFiles: [
      '/tags*',
      '/tag*',
      '/index*',
      '/notes/大纲*',
      '/api-examples*',
      '/markdown-examples*',
      '/readme*',
      '*.md',
      '/public/**',
    ],
    mapTitles: {
      backend: '后端',
      frontend: '前端',
      tools: '工具',
    },
  })
)
