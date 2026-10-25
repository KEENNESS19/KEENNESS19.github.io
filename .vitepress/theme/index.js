import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HomePage from './HomePage.vue'
import ArticleList from './ArticleList.vue'
import TagCloud from './TagCloud.vue'
import ArticleMeta from './ArticleMeta.vue'
import SiteFooter from './SiteFooter.vue'
import ReactHost from './ReactHost.vue'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => h(HomePage),
      'doc-before': () => h(ArticleMeta),
      'layout-bottom': () => h(SiteFooter),
    })
  },
  enhanceApp({ app }) {
    app.component('ArticleList', ArticleList)
    app.component('TagCloud', TagCloud)
    app.component('ReactHost', ReactHost)
  },
}
