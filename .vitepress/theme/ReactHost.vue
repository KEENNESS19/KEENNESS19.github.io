<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

/**
 * React 知识插件通用挂载器。
 *
 * 用法（在任意 markdown 中）：
 *   <ReactHost name="ClosureDemo" />
 *   <ReactHost name="QuaternionDemo" :widget-props="{ title: '自定义标题' }" />
 *
 * 服务端渲染时只输出空容器，客户端挂载后再由 React 接管，
 * 因此 SSR 构建与页面切换（SPA 导航）都是安全的。
 */
const props = defineProps({
  /** registry.jsx 中注册的插件名 */
  name: { type: String, required: true },
  /** 传给 React 组件的 props */
  widgetProps: { type: Object, default: () => ({}) },
})

const host = ref(null)
let root = null

onMounted(async () => {
  const { mountWidget } = await import('./react/registry')
  root = mountWidget(host.value, props.name, props.widgetProps)
})

onBeforeUnmount(() => {
  root?.unmount?.()
  root = null
})
</script>

<template>
  <div ref="host" class="react-host" />
</template>
