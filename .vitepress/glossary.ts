/**
 * 站内术语表：[[术语]] 或 [[术语|别名]] 会被 markdown-it 插件
 * 替换成指向解释文档的链接（.term-link）。
 *
 * 规则：
 *  - 术语未收录时，[[xx]] 按普通文本原样保留（构建后肉眼可查）；
 *  - href 用 cleanUrls 形式（不带 .html）；锚点可后续按需补充 #标题id。
 */
export interface TermEntry {
  href: string
  /** hover 提示，一句话说明 */
  desc?: string
}

export const glossary: Record<string, TermEntry> = {
  四元数: {
    href: '/notes/机器人/数学基础/quaternion',
    desc: '三维旋转的四参数表示：S³ 双重覆盖 SO(3)，无奇异',
  },
  万向节死锁: {
    href: '/notes/机器人/数学基础/quaternion',
    desc: '欧拉角在中间角 ±90° 时丢失一个自由度的奇异现象',
  },
  SLERP: {
    href: '/notes/机器人/数学基础/quaternion',
    desc: '单位四元数在 S³ 球面上的测地插值',
  },
  李群李代数: {
    href: '/notes/机器人/数学基础/lie-groups',
    desc: '旋转流形与其切空间：指数映射连接，误差定义在切空间',
  },
  DMP: {
    href: '/notes/机器人/控制与运动生成/dmp',
    desc: '动态运动基元：把示教轨迹编码为动力学系统',
  },
  行为树: {
    href: '/notes/机器人/规划与决策/behavior-tree',
    desc: 'Tick 三态模型驱动的可组合决策架构',
  },
  状态机: {
    href: '/notes/机器人/规划与决策/finite-state-machine',
    desc: '有限互斥状态 + 显式转移的形式化决策模型',
  },
  DDS: {
    href: '/notes/机器人/软件与中间件/dds',
    desc: '以数据为中心的分布式通信中间件（ROS 2 底层）',
  },
  QoS: {
    href: '/notes/机器人/软件与中间件/dds',
    desc: 'DDS 的通信质量契约：可靠性/历史/持久性按流配置',
  },
  闭包: {
    href: '/notes/frontend/js-closure',
    desc: '函数与其捕获的外部变量环境的组合',
  },
  所有权: {
    href: '/notes/语言/rust原理',
    desc: 'Rust 用编译期唯一的拥有者消灭悬空与双重释放',
  },
  GIL: {
    href: '/notes/语言/python原理',
    desc: 'CPython 的全局解释器锁：引用计数线程安全的代价',
  },
  坐标变换与齐次矩阵: {
    href: '/notes/机器人/数学基础/transform-homogeneous',
    desc: '位姿=坐标系间关系；齐次矩阵统一旋转与平移，左右乘各有确定含义',
  },
  'TF 树': {
    href: '/notes/机器人/软件与中间件/ros2',
    desc: '坐标系组织成树，任意两系间变换自动链式求解并带时间戳',
  },
  李群李代数: {
    href: '/notes/机器人/数学基础/lie-groups',
    desc: '旋转流形与其切空间：指数映射连接，误差定义在切空间',
  },
  卡尔曼滤波: {
    href: '/notes/机器人/数学基础/kalman-filter',
    desc: '模型预测与观测按协方差加权的最优融合递推',
  },
  卡尔曼滤波应用: {
    href: '/notes/机器人/感知与估计/kalman-fusion',
    desc: 'EKF/ESKF 融合实战：状态向量 + 过程模型 + 观测模型三件套',
  },
  电机原理: {
    href: '/notes/机器人/硬件与电子/motor-principles',
    desc: '一切电机=洛伦兹力+换相机制；家族差异只在换相方式',
  },
  'FOC 与电流环': {
    href: '/notes/机器人/硬件与电子/foc',
    desc: 'dq 坐标系分解三相电流，力矩控制变成一个电流值',
  },
  编码器: {
    href: '/notes/机器人/硬件与电子/encoders',
    desc: '位置反馈的真值来源：增量式数脉冲，绝对式读码',
  },
  '嵌入式与 RTOS': {
    href: '/notes/机器人/硬件与电子/embedded-rtos',
    desc: '按优先级抢占调度，保证最坏情况响应时间而非吞吐',
  },
  关节模组: {
    href: '/notes/机器人/结构与机构/reducers',
    desc: '电机+减速器+双编码器+驱动器一体化，传动问题封装成选型参数',
  },
  减速器: {
    href: '/notes/机器人/结构与机构/reducers',
    desc: '功率守恒下力矩换转速；背隙与刚度是它的两个性格参数',
  },
  传感器标定: {
    href: '/notes/机器人/感知与估计/sensor-calibration',
    desc: '估计内参与外参使多源数据自洽；手眼标定 AX=XB',
  },
  'IMU 姿态解算': {
    href: '/notes/机器人/感知与估计/imu-attitude',
    desc: '陀螺走高频、加计走低频的频段分工融合',
  },
  混合决策架构: {
    href: '/notes/机器人/规划与决策/hybrid-decision',
    desc: 'FSM 管模式、行为树管行为、基元管动作的三层分工',
  },
  正逆运动学: {
    href: '/notes/机器人/控制与运动生成/kinematics',
    desc: '关节空间与笛卡尔空间的双向翻译；雅可比是速度翻译官',
  },
  '级联 PID': {
    href: '/notes/机器人/控制与运动生成/cascade-pid',
    desc: '电流环→速度环→位置环三环分层，带宽隔离原则',
  },
  'ROS 2 体系': {
    href: '/notes/机器人/软件与中间件/ros2',
    desc: '图模型（节点/话题/服务/动作）+ TF 树 + DDS 底座',
  },
  数据回放与时间同步: {
    href: '/notes/机器人/软件与中间件/time-sync-replay',
    desc: '时间戳在采集层打、全链路透传；录包把现场变成可重放数据',
  },
  软件架构模式: {
    href: '/notes/机器人/软件与中间件/architecture-patterns',
    desc: '状态归谁写、数据往哪流、故障在哪隔离——三个决策定架构',
  },
  整机联调流程: {
    href: '/notes/机器人/系统与仿真/integration',
    desc: '把模块间隐式假设（时钟/坐标系/单位/方向/时序）显式化验证',
  },
  测试方法论: {
    href: '/notes/机器人/系统与仿真/testing',
    desc: '逐层固化随机性：单测/仿真/HIL/整机金字塔与指标体系',
  },
}
