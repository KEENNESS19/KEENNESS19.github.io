---
title: 两数之和
date: 2026-09-08
tags:
  - 数组
  - 哈希表
  - 简单
difficulty: easy
leetcode: https://leetcode.cn/problems/two-sum/
category: leetcode
description: 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。
sidebar: false
---

# 两数之和

## 题目描述

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出**和为目标值** `target` 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

### 示例 1

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1]
```

### 示例 2

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

## 解法一：暴力枚举

### 思路

两层循环，枚举所有可能的两个数的组合，判断和是否等于 target。

### 代码

```python
def twoSum(nums: list[int], target: int) -> list[int]:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
```

### 复杂度分析

| 项目 | 复杂度 |
| --- | --- |
| 时间复杂度 | $O(n^2)$，两层循环 |
| 空间复杂度 | $O(1)$ |

## 解法二：哈希表（最优）

### 思路

使用哈希表存储已经遍历过的数字及其下标。对于每个数 `nums[i]`，检查 `target - nums[i]` 是否存在于哈希表中：

- 如果存在，说明找到了答案，返回 `[hashMap[target-nums[i]], i]`
- 如果不存在，将当前数字和下标存入哈希表

```
遍历 nums = [2, 7, 11, 15], target = 9

i=0, nums[i]=2:  9-2=7 不在表中 → 表: {2: 0}
i=1, nums[i]=7:  9-7=2 在表中! → 返回 [0, 1] ✓
```

### 代码

```python
def twoSum(nums: list[int], target: int) -> list[int]:
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []
```

```typescript
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) {
      return [map.get(complement)!, i]
    }
    map.set(nums[i], i)
  }
  return []
}
```

```go
func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, num := range nums {
        if j, ok := m[target-num]; ok {
            return []int{j, i}
        }
        m[num] = i
    }
    return nil
}
```

### 复杂度分析

| 项目 | 复杂度 |
| --- | --- |
| 时间复杂度 | $O(n)$，只需遍历一次 |
| 空间复杂度 | $O(n)$，哈希表存储 |

## 总结

- **暴力法**：简单但效率低，适合数据量小的场景
- **哈希表**：空间换时间，最优解法，面试必写
