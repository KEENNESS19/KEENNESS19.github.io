import React from 'react'
import { createRoot } from 'react-dom/client'
import ClosureDemo from './widgets/ClosureDemo'
import QuaternionDemo from './widgets/QuaternionDemo'

/**
 * React 知识插件注册表。
 *
 * 新增插件：在 widgets/ 下写一个 .jsx 默认导出组件，在这里登记名字即可，
 * markdown 中就能用 <ReactHost name="..." /> 调用。
 */
const widgets = {
  ClosureDemo,
  QuaternionDemo,
}

export function mountWidget(el, name, widgetProps = {}) {
  const Widget = widgets[name]
  el.innerHTML = ''
  if (!Widget) {
    const msg = document.createElement('p')
    msg.className = 'kw-caption'
    msg.textContent = `未知知识插件: ${name}（检查 registry.jsx 的注册名）`
    el.appendChild(msg)
    return null
  }
  const root = createRoot(el)
  root.render(React.createElement(Widget, widgetProps))
  return root
}
