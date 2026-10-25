---
title: Vue 3 响应式原理
date: 2026-09-05
tags:
  - Vue
  - 前端
  - 源码
category: notes
description: 深入理解 Vue 3 的 Proxy 响应式系统
sidebar: false
---

# Vue 3 响应式原理

## 从 Object.defineProperty 到 Proxy

Vue 2 使用 `Object.defineProperty` 实现响应式，而 Vue 3 改用了 `Proxy`，解决了以下问题：

- 无法监听对象属性的新增和删除
- 无法监听数组下标变化
- 性能提升：无需递归遍历所有属性

## 核心实现

### 1. reactive 基础版本

```typescript
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key) // 收集依赖
      const res = Reflect.get(target, key, receiver)
      if (isObject(res)) {
        return reactive(res) // 深度代理
      }
      return res
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const res = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        trigger(target, key) // 触发更新
      }
      return res
    },
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (hadKey && res) {
        trigger(target, key)
      }
      return res
    },
  })
}
```

### 2. 依赖收集（track）

```typescript
const targetMap = new WeakMap() // 存储所有对象的依赖

function track(target, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}
```

### 3. 触发更新（trigger）

```typescript
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const effects = depsMap.get(key)
  if (effects) {
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        effect()
      }
    })
  }
}
```

## 数据结构图示

```
targetMap (WeakMap)
  ├── target1 (Map)
  │     ├── key1: Set [effect1, effect2]
  │     └── key2: Set [effect3]
  └── target2 (Map)
        └── key1: Set [effect4]
```

## ref vs reactive

| 特性 | ref | reactive |
| --- | --- | --- |
| 支持类型 | 基本类型 + 对象 | 仅对象 |
| 访问值 | 需要 `.value` | 直接访问 |
| 替换对象 | 可直接赋值 | 需要展开或 Object.assign |
