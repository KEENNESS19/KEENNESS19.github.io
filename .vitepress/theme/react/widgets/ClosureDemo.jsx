import React, { useRef, useState } from 'react'

/**
 * 闭包知识插件：同一工厂 makeCounter(step) 的多个实例，
 * 每个实例捕获独立的 count 变量——可亲手验证"每次调用工厂都生成新的作用域"。
 */

function makeCounter(step) {
  let count = 0 // ← 被返回的函数"封闭"的环境变量
  return function increment() {
    count += step
    return count
  }
}

function CounterRow({ id, step, onRemove }) {
  const counterRef = useRef(makeCounter(step))
  const [value, setValue] = useState(0)
  const [calls, setCalls] = useState(0)

  const increment = () => {
    setValue(counterRef.current())
    setCalls((n) => n + 1)
  }
  const reset = () => {
    counterRef.current = makeCounter(step) // 新工厂调用 → 全新的 count
    setValue(0)
    setCalls(0)
  }

  return (
    <div className="kw-row">
      <code className="kw-label">
        counter{id} = makeCounter({step})
      </code>
      <button className="kw-btn" onClick={increment}>
        +{step}
      </button>
      <span className="kw-value">{value}</span>
      <span className="kw-caption">已调用 {calls} 次</span>
      <button className="kw-btn-ghost" onClick={reset} title="重新调用工厂，生成全新的 count">
        重造实例
      </button>
      {onRemove ? (
        <button className="kw-btn-ghost" onClick={onRemove}>
          删除
        </button>
      ) : null}
    </div>
  )
}

export default function ClosureDemo() {
  const [rows, setRows] = useState([
    { id: 1, step: 1 },
    { id: 2, step: 3 },
    { id: 3, step: 10 },
  ])
  const nextId = useRef(4)

  const addRow = () => {
    const step = 2 + Math.floor(Math.random() * 9)
    setRows((r) => [...r, { id: nextId.current++, step }])
  }
  const removeRow = (id) => setRows((r) => r.filter((row) => row.id !== id))

  return (
    <div className="kw-card">
      <div className="kw-head">
        <span className="kw-title">makeCounter — 闭包即"函数 + 它捕获的环境"</span>
        <button className="kw-btn-ghost" onClick={addRow}>
          + 再造一个计数器
        </button>
      </div>

      <pre className="kw-code">
        {`function makeCounter(step) {
  let count = 0              // 每次调用工厂，都是一个新的 count
  return function increment() {
    count += step            // 只有这个函数能访问它
    return count
  }
}`}
      </pre>

      <div className="kw-body">
        {rows.map((row) => (
          <CounterRow
            key={row.id}
            {...row}
            onRemove={rows.length > 1 ? () => removeRow(row.id) : null}
          />
        ))}
      </div>

      <p className="kw-caption">
        三个计数器共享同一段函数代码，却各自封闭了一份独立的 count——点击
        「重造实例」重新调用工厂，会得到一个全新的作用域，旧值不被带走。
      </p>
    </div>
  )
}
