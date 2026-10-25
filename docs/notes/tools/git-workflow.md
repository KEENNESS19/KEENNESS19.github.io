---
title: Git 工作流与高级技巧
date: 2026-08-28
tags:
  - Git
  - 工具
  - 效率
category: notes
description: 掌握 Git 分支策略、变基、储藏等高级用法
sidebar: false
---

# Git 工作流与高级技巧

## 常见 Git 工作流

### Git Flow

适合有明确版本发布周期的项目：

```
main ───────────────────────────── 生产环境
  │
  └── develop ─────────────────── 开发环境
         │
         ├── feature/xxx ─────── 新功能分支
         ├── release/v1.0 ────── 发布准备
         └── hotfix/xxx ──────── 紧急修复
```

### GitHub Flow

简单高效，适合持续部署：

```
main ───────────────────────────── 始终可部署
  │
  └── feature/xxx ─────────────── 功能分支
         │
         └── Pull Request ────── Code Review + 合并
```

## 变基（rebase）高级用法

### 合并多个提交

```bash
# 合并最近 3 个提交
git rebase -i HEAD~3
```

在编辑器中修改：

```bash
pick abc123  feat: 添加用户登录
squash def456 fix: 修复登录逻辑
squash ghi789 style: 调整登录页面样式
```

### 将 feature 分支变基到 develop

```bash
git checkout feature/xxx
git rebase develop

# 如果有冲突，解决后执行
git add .
git rebase --continue

# 或取消变基
git rebase --abort
```

## 储藏（stash）技巧

```bash
# 保存当前修改（包含未追踪文件）
git stash push -u -m "临时保存功能A"

# 查看储藏列表
git stash list

# 应用并删除储藏
git stash pop stash@{0}

# 应用但不删除
git stash apply stash@{0}

# 删除指定储藏
git stash drop stash@{0}
```

## 后悔药：撤销操作

### 修改最后一次提交

```bash
# 修改提交信息或补充文件
git add forgotten_file
git commit --amend
```

### 撤销工作区修改

```bash
# 撤销单个文件
git checkout -- filename.txt

# 撤销所有修改
git checkout .
```

### 撤销暂存区

```bash
git reset HEAD filename.txt
```

### 回退版本

```bash
# 软回退：保留修改在暂存区
git reset --soft HEAD~1

# 混合回退（默认）：保留修改在工作区
git reset --mixed HEAD~1

# 硬回退：彻底丢弃修改
git reset --hard HEAD~1
```

## 常用 Alias 配置

```bash
# 编辑 git config
git config --global -e
```

添加以下别名：

```ini
[alias]
    st = status -sb
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative
    co = checkout
    br = branch
    cm = commit -m
    df = diff
    last = log -1 HEAD
    unstage = reset HEAD --
    undo = reset --soft HEAD~1
```

## 清理历史大文件

使用 `git-filter-repo`（推荐替代 `git filter-branch`）：

```bash
# 安装
pip install git-filter-repo

# 分析大文件
git filter-repo --analyze
cat .git/filter-repo/analysis/path-all-sizes.txt

# 删除指定文件并清理历史
git filter-repo --invert-paths --path path/to/large/file
```

## 常用速查表

| 场景 | 命令 |
| --- | --- |
| 查看修改内容 | `git diff` / `git diff --cached` |
| 查看谁写的 | `git blame filename` |
| 搜索提交历史 | `git log -S "关键词"` |
| 临时切换分支 | `git stash` → 切换 → `git stash pop` |
| 只取某个提交 | `git cherry-pick <commit-hash>` |
