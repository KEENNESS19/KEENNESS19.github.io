---
title: JavaScript 闭包详解
date: 2026-09-12
tags:
  - JavaScript
  - 前端
  - 核心概念
category: notes
description: 深入理解 JavaScript 闭包的原理、应用场景和常见陷阱
sidebar: false
---

# JavaScript 闭包详解

## 什么是闭包？

闭包（Closure）是 JavaScript 中最强大的特性之一。简单来说，**闭包是指有权访问另一个函数作用域中变量的函数**。

```javascript
function outerFunction() {
  const outerVariable = '我是外部变量'

  function innerFunction() {
    console.log(outerVariable) // 可以访问外部变量
  }

  return innerFunction
}

const closure = outerFunction()
closure() // 输出: 我是外部变量
```

## 闭包的形成条件

1. 函数嵌套函数
2. 内部函数引用了外部函数的变量
3. 内部函数被返回或在外部被调用

## 应用场景

### 1. 数据私有化

```javascript
function createCounter() {
  let count = 0

  return {
    increment() {
      count++
      return count
    },
    decrement() {
      count--
      return count
    },
    getCount() {
      return count
    },
  }
}

const counter = createCounter()
console.log(counter.increment()) // 1
console.log(counter.increment()) // 2
console.log(counter.count) // undefined（私有变量无法直接访问）
```

### 2. 函数柯里化

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs])
    }
  }
}

const sum = curry((a, b, c) => a + b + c)
console.log(sum(1)(2)(3)) // 6
```

### 3. 防抖与节流

```javascript
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

## 交互演示：三个计数器，三份封闭的状态

下面的插件就是用 React 写的（博客内置的 React 知识插件系统）。点击按钮亲手验证：同一段工厂代码，每个实例捕获独立的 `count`；「重造实例」重新调用工厂，得到全新作用域。

<ReactHost name="ClosureDemo" />

## 注意事项

::: warning 内存泄漏
闭包会保留外部函数的作用域，如果使用不当会导致内存泄漏。记得在不需要时解除引用。
:::

::: tip 循环中的闭包
在循环中创建闭包时要特别注意变量共享问题，推荐使用 `let` 或立即执行函数（IIFE）。
:::
