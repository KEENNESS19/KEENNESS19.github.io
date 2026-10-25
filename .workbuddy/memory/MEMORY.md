# 项目长期备忘

## 博客（VitePress 知识库）
- 站点：KEENNESS19.github.io，VitePress 2 alpha，栏目 notes（backend/frontend/tools/语言/机器人）+ leetcode，文章前置含 title/date/tags/category/description。
- 语言原理系列（docs/notes/语言/）：c++原理/rust原理/python原理，统一"设计动因"四问框架（约束→方案→为什么选它→代价与补救），篇间交叉引用。机器人系列（docs/notes/机器人/）已按 8 栏目分子目录：数学基础/结构与机构/硬件与电子/感知与估计/规划与决策/控制与运动生成/软件与中间件/系统与仿真（各带 index.md，order 1-8）；归属原则：单一归属+标签补充、按"回答的问题"分。现有：quaternion→数学基础，FSM/BT→规划与决策，DMP→控制与运动生成，DDS→软件与中间件。
- React 知识插件系统（2026-10-23）：依赖 react/react-dom；config.ts vite.esbuild 设 jsx:'automatic'+jsxImportSource:'react' 编译 .jsx；.vitepress/theme/ReactHost.vue 为通用挂载器（SSR 只出空容器，onMounted 动态 import react/registry，createRoot 挂载，onBeforeUnmount unmount）；新插件 = 在 .vitepress/theme/react/widgets/ 写 .jsx 默认导出 + registry.jsx 登记，markdown 用 <ReactHost name="Xxx" />；样式类前缀 kw-* 在 style.css。已有插件：ClosureDemo（js-closure.md）、QuaternionDemo（quaternion.md）。注意 markdown 内联代码外的尖括号会被 vue 编译器当 HTML。
- VitePress 踩坑：markdown 正文/标题里代码格式（反引号）之外的 `<xxx>` 会被 vue 编译器当 HTML 标签，构建报 "Element is missing end tag"——所有泛型尖括号必须包反引号。
- 术语跳转系统：[[术语]]/[[术语|别名]] → .term-link 链接；术语注册在 .vitepress/glossary.ts，插件 .vitepress/markdown/term-links.ts（markdown-it inline），未注册术语原样保留。知识库大纲 docs/notes/大纲.md 是元页面（三重排除：侧栏/RSS/articles.data，仅笔记页顶部链接进入），含 8 栏目知识点清单与"原理→数学基础、实现→对应栏目"分工规则；新文章动笔前到大纲认领位置。
- 用户 UI 偏好：极简但有设计感；微赛博朋克但明确不要光污染（禁发光/渐变/霓虹）；喜欢猫狗动物元素（做极简线稿符号，不做吉祥物）；不喜欢暖色调纸感。
- 定板方案「冷雾与石墨」V4：雾面冷灰 #F6F7F9 页面底（nav/页眉与底同色融合，用户否掉了更灰的 #EBEDEF/#EEF0F2）+ 纯白 #FFFFFF 面板靠 1px 描边 #E5E8EB 区分 + 墨 #14171A + 钢蓝信号 #35597D（≤5% 面积，替代冷青 #3F7A82）；深代码面板 #14171A；零发光零渐变；猫耳方块 logo（眼睛用钢蓝）。
- 设计文件（Ardot）：https://ardot.tencent.com/file/737435790417104
- UI 已按定板稿实现到 VitePress 主题（2026-10-17）：
  - 主题文件 .vitepress/theme/：style.css（设计系统变量+全套覆盖）、HomePage.vue（hero+状态卡+频道chips+表格+右栏）、ArticleTable.vue（DATE/TITLE/TAGS/READ 条目行）、ArticleList.vue（支持 category/prefix/tag 筛选）、TagCloud.vue、ArticleMeta.vue（doc-before 渲染 kicker+h1+meta，onMounted 给 .vp-doc 加 no-h1 隐藏 markdown 原生 h1）、SiteFooter.vue（layout-bottom，非首页 padding-left 偏移侧栏宽）、articles.data.ts（channel 由 url 推断 + readingTime/codeBlocks 估算）。
  - config：markdown.theme github-dark + lineNumbers，logo /logo.svg（docs/public），nav 无 socialLinks，appearance:false，侧栏 scanStartPath 'docs' + mapTitles 无效（vitepress-sidebar 无此选项，用子目录 index.md 提供中文标题）。
  - 踩坑：VitePress 2 alpha markdown 内容外多包一层 div（.vp-doc > div > h1）；RSS 插件会自动往 themeConfig.socialLinks 注入 rss 图标（CSS 隐藏）；doc-before 在 main.vp-doc 之外；侧栏页 layout-bottom footer 会被 fixed 侧栏遮挡需偏移。
  - 已删除脚手架示例（根与 docs 的 api-examples/markdown-examples/tag.md/index.md），文章 frontmatter 加 sidebar:false，目录页加 prev/next:false。
