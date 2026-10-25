---
title: Redis 缓存设计最佳实践
date: 2026-09-01
tags:
  - Redis
  - 后端
  - 缓存
category: notes
description: 深入了解 Redis 缓存策略、常见问题及解决方案
sidebar: false
---

# Redis 缓存设计最佳实践

## 缓存策略选型

### Cache-Aside Pattern（旁路缓存）

最常用的缓存策略，读操作流程：

```
1. 先读缓存，命中则返回
2. 缓存未命中，读数据库
3. 数据库数据写入缓存
4. 返回数据
```

写操作流程：

```
1. 先更新数据库
2. 再删除缓存（不是更新缓存）
```

```go
// Go 示例：Cache-Aside 读取
func GetUser(id int64) (*User, error) {
    key := fmt.Sprintf("user:%d", id)
    
    // 1. 尝试从缓存读取
    data, err := rdb.Get(ctx, key).Result()
    if err == nil {
        user := &User{}
        if err := json.Unmarshal([]byte(data), user); err == nil {
            return user, nil
        }
    }
    
    // 2. 缓存未命中，读数据库
    user, err := db.QueryUser(id)
    if err != nil {
        return nil, err
    }
    
    // 3. 写入缓存
    jsonData, _ := json.Marshal(user)
    rdb.SetEX(ctx, key, jsonData, 5*time.Minute)
    
    return user, nil
}
```

## 三大经典问题

### 1. 缓存穿透

**问题**：查询一条不存在的数据，缓存和数据库都没有，每次请求都会打到数据库。

**解决方案**：

```java
// 方案一：缓存空值
public User getUser(Long id) {
    String key = "user:" + id;
    String value = redis.get(key);
    
    if (value != null) {
        if ("EMPTY".equals(value)) {
            return null; // 缓存的空值
        }
        return JSON.parseObject(value, User.class);
    }
    
    User user = db.selectById(id);
    if (user == null) {
        // 缓存空值，设置较短过期时间
        redis.setex(key, 60, "EMPTY");
    } else {
        redis.setex(key, 3600, JSON.toJSONString(user));
    }
    return user;
}

// 方案二：布隆过滤器（Bloom Filter）
// 在访问缓存前，先用布隆过滤器判断 key 是否可能存在
```

### 2. 缓存击穿

**问题**：某个热点 key 过期的瞬间，大量并发请求同时访问，全部打到数据库。

**解决方案**：

- 热点数据永不过期（逻辑过期）
- 使用互斥锁（Mutex Lock）

```java
// 互斥锁方案
public String getData(String key) {
    String value = redis.get(key);
    if (value != null) {
        return value;
    }
    
    String lockKey = "lock:" + key;
    String lockValue = UUID.randomUUID().toString();
    
    try {
        // 尝试获取锁
        if (redis.set(lockKey, lockValue, "NX", "PX", 3000)) {
            value = db.query(key);
            if (value != null) {
                redis.setex(key, 3600, value);
            }
        } else {
            // 等待重试
            Thread.sleep(50);
            return getData(key);
        }
    } finally {
        // 释放锁（Lua 脚本保证原子性）
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
        redis.eval(script, Collections.singletonList(lockKey), lockValue);
    }
    return value;
}
```

### 3. 缓存雪崩

**问题**：大量缓存 key 在同一时间过期，或 Redis 宕机，导致数据库压力剧增。

**解决方案**：

- 过期时间加随机值，避免同时过期
- 搭建 Redis 高可用集群（哨兵/集群模式）
- 服务降级和熔断

```python
# 随机过期时间
import random
import time

def set_with_random_ttl(key, value, base_ttl=3600):
    """在基础过期时间上增加 0~10 分钟的随机偏移"""
    random_ttl = base_ttl + random.randint(0, 600)
    redis.setex(key, random_ttl, value)
```

## 数据一致性

### 先更新数据库，再删除缓存

这是最推荐的方案，配合延时双删：

```java
public void updateUser(Long id, UserDTO dto) {
    // 1. 先更新数据库
    db.updateUser(id, dto);
    
    // 2. 删除缓存
    redis.del("user:" + id);
    
    // 3. 延时再次删除（解决并发导致的不一致）
    threadPool.schedule(() -> {
        redis.del("user:" + id);
    }, 500, TimeUnit.MILLISECONDS);
}
```

## 总结

| 问题 | 原因 | 解决方案 |
| --- | --- | --- |
| 缓存穿透 | 查询不存在的数据 | 缓存空值、布隆过滤器 |
| 缓存击穿 | 热点 key 过期 | 永不过期、互斥锁 |
| 缓存雪崩 | 大量 key 同时过期 | 随机过期时间、高可用、降级 |
