---
title: 最长回文子串
date: 2026-09-03
tags:
  - 字符串
  - 动态规划
  - 双指针
  - 中等
difficulty: medium
leetcode: https://leetcode.cn/problems/longest-palindromic-substring/
category: leetcode
description: 给你一个字符串 s，找到 s 中最长的回文子串。
sidebar: false
---

# 最长回文子串

## 题目描述

给你一个字符串 `s`，找到 `s` 中最长的回文子串。

### 示例 1

```
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。
```

### 示例 2

```
输入：s = "cbbd"
输出："bb"
```

## 解法一：中心扩展法

### 思路

回文串是对称的，可以以每个字符（奇数长度）或每两个相邻字符（偶数长度）为中心，向两边扩展，寻找最长回文。

```
奇数长度：以 s[i] 为中心
    b a b a d
      ↑
     left=i, right=i

偶数长度：以 s[i] 和 s[i+1] 为中心
    c b b d
      ↑↑
     left=i, right=i+1
```

### 代码

```python
def longestPalindrome(s: str) -> str:
    def expand(left: int, right: int) -> str:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        # 退出循环时 [left+1, right-1] 是回文
        return s[left + 1:right]
    
    if len(s) < 2:
        return s
    
    longest = ""
    for i in range(len(s)):
        # 奇数长度回文
        palindrome1 = expand(i, i)
        # 偶数长度回文
        palindrome2 = expand(i, i + 1)
        
        if len(palindrome1) > len(longest):
            longest = palindrome1
        if len(palindrome2) > len(longest):
            longest = palindrome2
    
    return longest
```

### 复杂度分析

| 项目 | 复杂度 |
| --- | --- |
| 时间复杂度 | $O(n^2)$，共 $2n-1$ 个中心，每个最多扩展 $O(n)$ |
| 空间复杂度 | $O(1)$ |

## 解法二：动态规划

### 思路

定义 `dp[i][j]` 表示子串 `s[i..j]` 是否为回文串。

状态转移方程：

- 如果 `s[i] == s[j]` 且 `(j - i < 3 || dp[i+1][j-1] == true)`，则 `dp[i][j] = true`

初始化：
- 长度为 1：`dp[i][i] = true`
- 长度为 2：`dp[i][i+1] = (s[i] == s[i+1])`

### 代码

```typescript
function longestPalindrome(s: string): string {
  const n = s.length
  if (n < 2) return s

  const dp: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false))
  let maxLen = 1
  let start = 0

  // 长度为 1 的都是回文
  for (let i = 0; i < n; i++) {
    dp[i][i] = true
  }

  // 按子串长度递推
  for (let L = 2; L <= n; L++) {
    for (let i = 0; i <= n - L; i++) {
      const j = i + L - 1
      if (s[i] !== s[j]) {
        dp[i][j] = false
      } else {
        if (L <= 3) {
          dp[i][j] = true
        } else {
          dp[i][j] = dp[i + 1][j - 1]
        }
      }

      if (dp[i][j] && L > maxLen) {
        maxLen = L
        start = i
      }
    }
  }

  return s.substring(start, start + maxLen)
}
```

### 复杂度分析

| 项目 | 复杂度 |
| --- | --- |
| 时间复杂度 | $O(n^2)$ |
| 空间复杂度 | $O(n^2)$，需要二维 dp 数组 |

## 解法三：Manacher 算法（进阶）

时间复杂度 $O(n)$ 的算法，了解即可，面试一般不要求手写。

```python
def longestPalindrome(s: str) -> str:
    # 将 s 转换为 t，比如 "abc" -> "^#a#b#c#$"
    t = '^#' + '#'.join(s) + '#$'
    n = len(t)
    p = [0] * n  # p[i] 表示以 i 为中心的回文半径
    center = right = 0
    max_len = 0
    center_idx = 0
    
    for i in range(1, n - 1):
        # 利用对称性赋值
        mirror = 2 * center - i
        if i < right:
            p[i] = min(right - i, p[mirror])
        
        # 扩展
        while t[i + p[i] + 1] == t[i - p[i] - 1]:
            p[i] += 1
        
        # 更新 center 和 right
        if i + p[i] > right:
            center = i
            right = i + p[i]
        
        # 记录最大值
        if p[i] > max_len:
            max_len = p[i]
            center_idx = i
    
    # 原字符串起始位置
    start = (center_idx - max_len) // 2
    return s[start:start + max_len]
```

## 解法对比

| 解法 | 时间 | 空间 | 推荐场景 |
| --- | --- | --- | --- |
| 中心扩展 | $O(n^2)$ | $O(1)$ | 面试首选，好写好懂 |
| 动态规划 | $O(n^2)$ | $O(n^2)$ | 理解 DP 思想 |
| Manacher | $O(n)$ | $O(n)$ | 进阶，追求最优 |
