import React, { useMemo, useState } from 'react'

/**
 * 四元数知识插件：拖动转轴与角度，实时看到
 *   1) 单位四元数的四个分量（半角公式）；
 *   2) v' = q v q⁻¹ 作用在坐标系与立方体上的结果（等距投影）。
 * 灰色虚线 = 旋转前的原始姿态，钢蓝实线 = 旋转后的姿态。
 */

const C = Math.cos(Math.PI / 6)
const S = Math.sin(Math.PI / 6)
const SCALE = 92
const CX = 230
const CY = 168

function quatMul(a, b) {
  const [aw, ax, ay, az] = a
  const [bw, bx, by, bz] = b
  return [
    aw * bw - ax * bx - ay * by - az * bz,
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
  ]
}

function quatConj(q) {
  return [q[0], -q[1], -q[2], -q[3]]
}

function rotate(q, v) {
  const p = [0, v[0], v[1], v[2]]
  const r = quatMul(quatMul(q, p), quatConj(q))
  return [r[1], r[2], r[3]]
}

function project([x, y, z]) {
  return [CX + (x - z) * C * SCALE, CY + (x + z) * S * SCALE - y * SCALE]
}

function toLine([x1, y1], [x2, y2]) {
  return { x1, y1, x2, y2 }
}

const CUBE_CORNERS = []
for (const x of [-0.5, 0.5]) for (const y of [-0.5, 0.5]) for (const z of [-0.5, 0.5]) CUBE_CORNERS.push([x, y, z])
const CUBE_EDGES = [
  [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3],
  [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7],
]

const AXES = [
  { label: 'X', v: [1, 0, 0] },
  { label: 'Y', v: [0, 1, 0] },
  { label: 'Z', v: [0, 0, 1] },
]

export default function QuaternionDemo() {
  const [ax, setAx] = useState(0)
  const [ay, setAy] = useState(0)
  const [az, setAz] = useState(100)
  const [angle, setAngle] = useState(60)

  const { q, axis } = useMemo(() => {
    const len = Math.hypot(ax, ay, az)
    const u = len < 1e-6 ? [0, 0, 1] : [ax / len, ay / len, az / len]
    const half = (angle * Math.PI) / 180 / 2
    return { q: [Math.cos(half), u[0] * Math.sin(half), u[1] * Math.sin(half), u[2] * Math.sin(half)], axis: u }
  }, [ax, ay, az, angle])

  const sliders = [
    { label: '轴 x', value: ax, set: setAx },
    { label: '轴 y', value: ay, set: setAy },
    { label: '轴 z', value: az, set: setAz },
    { label: '角 θ', value: angle, set: setAngle, min: 0, max: 180, unit: '°' },
  ]

  const rotAxis = (v) => project(rotate(q, v))
  const zero = project([0, 0, 0])

  return (
    <div className="kw-card">
      <div className="kw-head">
        <span className="kw-title">四元数旋转 — q = [cos(θ/2), u·sin(θ/2)]</span>
      </div>

      <div className="kw-split">
        <svg className="kw-svg" viewBox="0 0 460 336" role="img" aria-label="四元数旋转演示">
          {/* 原始立方体：灰色细实线 */}
          {CUBE_EDGES.map(([a, b]) => {
            const l = toLine(project(CUBE_CORNERS[a]), project(CUBE_CORNERS[b]))
            return <line key={`c${a}-${b}`} {...l} stroke="var(--line)" strokeWidth="1" />
          })}
          {/* 旋转后的立方体：钢蓝 */}
          {CUBE_EDGES.map(([a, b]) => {
            const l = toLine(rotAxis(CUBE_CORNERS[a]), rotAxis(CUBE_CORNERS[b]))
            return <line key={`r${a}-${b}`} {...l} stroke="var(--accent)" strokeWidth="1.4" />
          })}

          {/* 原始坐标轴：灰色虚线 */}
          {AXES.map(({ label, v }) => {
            const end = project(v.map((c) => c * 1.25))
            return (
              <g key={`o-${label}`}>
                <line {...toLine(zero, end)} stroke="var(--text-3)" strokeWidth="1" strokeDasharray="4 4" />
                <text {...end} dx="4" dy="4" fontSize="11" fill="var(--text-3)" fontFamily="var(--mono)">
                  {label}
                </text>
              </g>
            )
          })}

          {/* 旋转后的坐标轴：钢蓝实线 */}
          {AXES.map(({ label, v }) => {
            const end = rotAxis(v.map((c) => c * 1.25))
            return (
              <g key={`r-${label}`}>
                <line {...toLine(zero, end)} stroke="var(--accent)" strokeWidth="1.8" />
                <circle {...end} r="3" fill="var(--accent)" />
                <text {...end} dx="6" dy="-4" fontSize="11" fill="var(--accent)" fontFamily="var(--mono)">
                  {label}
                </text>
              </g>
            )
          })}

          {/* 转轴：墨色点划线 */}
          <line
            {...toLine(project(axis.map((c) => c * -1.35)), project(axis.map((c) => c * 1.35)))}
            stroke="var(--ink)"
            strokeWidth="1"
            strokeDasharray="8 3 2 3"
          />
          <text x="12" y="324" fontSize="11" fill="var(--text-3)" fontFamily="var(--mono)">
            虚线 = 原始姿态 · 实线 = 旋转后 · 黑色点划线 = 转轴 u
          </text>
        </svg>

        <div className="kw-controls">
          {sliders.map(({ label, value, set, min = -100, max = 100, unit = '' }) => (
            <label key={label} className="kw-slider">
              <span className="kw-label">
                {label} = {value / (label === '角 θ' ? 1 : 100)}
                {unit}
              </span>
              <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
              />
            </label>
          ))}

          <div className="kw-quats">
            <code>w = {q[0].toFixed(3)}</code>
            <code>x = {q[1].toFixed(3)}</code>
            <code>y = {q[2].toFixed(3)}</code>
            <code>z = {q[3].toFixed(3)}</code>
          </div>
          <p className="kw-caption">|q| = 1 恒成立；w 变化的是 θ/2 的余弦——半角就写在分量里。</p>
        </div>
      </div>
    </div>
  )
}
