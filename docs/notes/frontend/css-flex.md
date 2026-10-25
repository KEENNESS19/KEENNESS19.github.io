---
title: CSS Flex 布局完全指南
date: 2026-09-10
tags:
  - CSS
  - 前端
  - 布局
category: notes
description: 掌握 Flexbox 布局的所有属性和技巧
sidebar: false
---

# CSS Flex 布局完全指南

## 基础概念

Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

```css
.container {
  display: flex; /* 或 inline-flex */
}
```

::: info 容器和项目
- 采用 Flex 布局的元素，称为 **Flex 容器**（flex container）
- 它的所有子元素自动成为容器成员，称为 **Flex 项目**（flex item）
:::

## 容器属性

### 1. flex-direction

决定主轴的方向（即项目的排列方向）。

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

| 值 | 说明 |
| --- | --- |
| row（默认） | 主轴为水平方向，起点在左端 |
| row-reverse | 主轴为水平方向，起点在右端 |
| column | 主轴为垂直方向，起点在上沿 |
| column-reverse | 主轴为垂直方向，起点在下沿 |

### 2. justify-content

定义了项目在主轴上的对齐方式。

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```

### 3. align-items

定义项目在交叉轴上如何对齐。

```css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

## 项目属性

### flex-grow

定义项目的放大比例，默认为 0。

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

### flex-shrink

定义了项目的缩小比例，默认为 1。

```css
.item {
  flex-shrink: <number>; /* default 1 */
}
```

### flex 简写

```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ];
}
```

## 常用布局示例

### 水平垂直居中

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 圣杯布局

```css
.holy-grail {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.holy-grail-body {
  display: flex;
  flex: 1;
}

.holy-grail-content {
  flex: 1;
}

.holy-grail-nav,
.holy-grail-aside {
  flex: 0 0 12em;
}
```
