---
title: 二叉树的遍历
date: 2026-08-30
tags:
  - 二叉树
  - 递归
  - 栈
  - DFS
  - 简单
difficulty: easy
category: leetcode
description: 系统总结二叉树的前序、中序、后序、层序遍历的递归与迭代写法
sidebar: false
---

# 二叉树的遍历

## 二叉树定义

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

```
示例二叉树：
        1
       / \
      2   3
     / \
    4   5
```

## 一、前序遍历（根-左-右）

顺序：`1 → 2 → 4 → 5 → 3`

### 递归写法

```python
def preorderTraversal(root: TreeNode) -> list[int]:
    res = []
    
    def dfs(node):
        if not node:
            return
        res.append(node.val)    # 根
        dfs(node.left)          # 左
        dfs(node.right)         # 右
    
    dfs(root)
    return res
```

### 迭代写法（栈）

```python
def preorderTraversal(root: TreeNode) -> list[int]:
    if not root:
        return []
    
    res = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        res.append(node.val)
        # 注意：右先入栈，左后入栈（因为栈是后进先出）
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return res
```

## 二、中序遍历（左-根-右）

顺序：`4 → 2 → 5 → 1 → 3`

### 递归写法

```python
def inorderTraversal(root: TreeNode) -> list[int]:
    res = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)          # 左
        res.append(node.val)    # 根
        dfs(node.right)         # 右
    
    dfs(root)
    return res
```

### 迭代写法

```python
def inorderTraversal(root: TreeNode) -> list[int]:
    res = []
    stack = []
    cur = root
    
    while cur or stack:
        # 一路向左，压入栈
        while cur:
            stack.append(cur)
            cur = cur.left
        
        # 弹出最左边的节点
        cur = stack.pop()
        res.append(cur.val)
        
        # 处理右子树
        cur = cur.right
    
    return res
```

## 三、后序遍历（左-右-根）

顺序：`4 → 5 → 2 → 3 → 1`

### 递归写法

```python
def postorderTraversal(root: TreeNode) -> list[int]:
    res = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)          # 左
        dfs(node.right)         # 右
        res.append(node.val)    # 根
    
    dfs(root)
    return res
```

### 迭代写法（技巧：反转前序）

前序是 `根-左-右`，修改顺序为 `根-右-左`，再反转结果就是 `左-右-根`。

```python
def postorderTraversal(root: TreeNode) -> list[int]:
    if not root:
        return []
    
    res = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        res.append(node.val)
        # 左先入栈，右后入栈 → 弹出顺序：根 → 右 → 左
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    
    # 反转得到：左 → 右 → 根
    return res[::-1]
```

## 四、层序遍历（BFS）

顺序：
```
第 0 层: [1]
第 1 层: [2, 3]
第 2 层: [4, 5]
```

### 标准写法（队列）

```python
from collections import deque

def levelOrder(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    
    res = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        res.append(current_level)
    
    return res
```

## 统一迭代模板（颜色标记法）

用颜色标记节点是否访问过，可以写出统一风格的三种遍历：

```python
def preorderTraversal(root: TreeNode) -> list[int]:
    WHITE, GRAY = 0, 1
    res = []
    stack = [(WHITE, root)]
    
    while stack:
        color, node = stack.pop()
        if not node:
            continue
        if color == WHITE:
            # 前序：右 → 左 → 根（入栈逆序）
            stack.append((WHITE, node.right))
            stack.append((WHITE, node.left))
            stack.append((GRAY, node))
            #
            # 中序只需改成：右 → 根 → 左
            # 后序只需改成：根 → 右 → 左
        else:
            res.append(node.val)
    
    return res
```

## 总结速查

| 遍历方式 | 顺序 | 数据结构 | 典型应用 |
| --- | --- | --- | --- |
| 前序 | 根-左-右 | 栈 | 复制二叉树、前缀表达式 |
| 中序 | 左-根-右 | 栈 | BST 排序输出 |
| 后序 | 左-右-根 | 栈 | 删除二叉树、后缀表达式 |
| 层序 | 逐层 | 队列 | 求最小深度、打印每层 |
