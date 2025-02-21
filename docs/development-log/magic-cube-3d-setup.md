# 魔方 3D 模型开发

## 任务目标

- 在 **frontend** 项目中集成 Three.js，实现交互式 3D 魔方模型。
- 支持手动拖拽旋转，扩展为真实的 3x3x3 魔方结构，避免渲染问题。
- 确保功能与 CI/CD 流程兼容，推送至 GitHub `dev` 分支。

## 步骤 1：安装 Three.js 依赖

> **目的**：为前端项目添加 Three.js 支持。

- 安装依赖：

  ```bash
  cd frontend
  yarn add three
  cd ..
  ```

  > **说明**：自动更新 **frontend/yarn.lock**，无需手动修改。

## 步骤 2：创建 Three.js 模块化工具

> **目的**：封装 Three.js 初始化代码，提升复用性并简化渲染。

- 创建 **frontend/src/utils/threeSetup.js**，内容如下：

  ```javascript
  import * as THREE from 'three'

  // 初始化场景、相机和渲染器
  export function createScene(container, width = 400, height = 400) {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // 设置相机位置，稍微倾斜以更好展示魔方
    camera.position.set(5, 5, 5)
    camera.lookAt(0, 0, 0)

    // 添加环境光和平行光，提升材质质感
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    return { scene, camera, renderer }
  }

  // 添加拖拽控制，整体旋转魔方
  export function addDragControls(object, renderer) {
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    const onMouseDown = (event) => {
      isDragging = true
      previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const onMouseMove = (event) => {
      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        }
        object.rotation.y += deltaMove.x * 0.01
        object.rotation.x += deltaMove.y * 0.01
        previousMousePosition = { x: event.clientX, y: event.clientY }
      }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('mouseup', onMouseUp)

    // 返回清理函数，移除事件监听器
    return () => {
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('mouseup', onMouseUp)
    }
  }
  ```

  > **说明**：封装场景初始化（含灯光）和拖拽控制，灯光提升材质质感。

## 步骤 3：实现真实 3D 魔方模型

> **目的**：创建 3x3x3 魔方，支持标准配色和高质量材质。

- 修改 **frontend/src/App.vue**，内容如下：

  ```vue
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import * as THREE from 'three'
  import { createScene, addDragControls } from './utils/threeSetup'

  const cubeContainer = ref(null)
  let scene, camera, renderer, cubeGroup, animateId

  onMounted(() => {
    // 初始化场景
    const { scene: s, camera: c, renderer: r } = createScene(cubeContainer.value)
    scene = s
    camera = c
    renderer = r

    // 创建魔方组，包含 26 个小立方体（跳过中心）
    cubeGroup = new THREE.Group()
    const cubeSize = 0.95 // 小立方体大小，留出间隙
    const cubeSpacing = 1.05 // 间距系数，避免重叠

    // 标准魔方配色：上黄、下白、前绿、后蓝、左红、右橙
    const colors = {
      U: 0xffff00, // 上 - 黄
      D: 0xffffff, // 下 - 白
      F: 0x00ff00, // 前 - 绿
      B: 0x0000ff, // 后 - 蓝
      L: 0xff0000, // 左 - 红
      R: 0xffa500  // 右 - 橙
    }

    // 定义材质，使用 MeshStandardMaterial 提升质感
    const materials = Object.fromEntries(
      Object.entries(colors).map(([face, color]) => [
        face,
        new THREE.MeshStandardMaterial({ color })
      ])
    )

    // 创建 3x3x3 魔方，每个小立方体有 6 面材质
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue // 跳过中心不可见部分
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)

          // 为每个小立方体分配材质，外部面使用对应颜色，内部面默认灰色
          const cubeMaterials = [
            x === 1 ? materials.R : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 右
            x === -1 ? materials.L : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 左
            y === 1 ? materials.U : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 上
            y === -1 ? materials.D : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 下
            z === 1 ? materials.F : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 前
            z === -1 ? materials.B : new THREE.MeshStandardMaterial({ color: 0x808080 }) // 后
          ]

          const cube = new THREE.Mesh(geometry, cubeMaterials)
          cube.position.set(x * cubeSpacing, y * cubeSpacing, z * cubeSpacing)
          cubeGroup.add(cube)
        }
      }
    }
    scene.add(cubeGroup)

    // 动画循环，自动旋转魔方
    const animate = () => {
      animateId = requestAnimationFrame(animate)
      cubeGroup.rotation.x += 0.005
      cubeGroup.rotation.y += 0.005
      renderer.render(scene, camera)
    }
    animate()

    // 添加拖拽控制，整体旋转魔方
    const cleanupDrag = addDragControls(cubeGroup, renderer)

    // 清理资源
    onUnmounted(() => {
      cleanupDrag()
      cancelAnimationFrame(animateId)
      renderer.dispose()
      scene = null
      camera = null
      cubeGroup = null
    })
  })
  </script>

  <template>
    <div>
      <h1>Magic Cube</h1>
      <div ref="cubeContainer" style="width: 400px; height: 400px"></div>
    </div>
  </template>

  <style>
  /* 可选样式，后续扩展 */
  </style>
  ```

  > **说明**：实现 3x3x3 魔方，标准配色和高质感材质，支持整体拖拽旋转。

## 步骤 4：验证功能

> **目的**：确保 3D 魔方在本地运行正常。

- 运行前端开发服务器：

  ```bash
  yarn dev:frontend
  ```

  > **说明**：访问 `http://localhost:5173`，应显示 3x3x3 彩色魔方，可拖拽旋转。

- 运行格式化和检查：

  ```bash
  yarn format
  yarn lint
  ```

  > **说明**：确保代码规范一致。

## 步骤 5：提交代码至 GitHub

> **目的**：将 3D 模型功能推送至 `dev` 分支，验证 CI。

- 提交更改：

  ```bash
  git add frontend/yarn.lock frontend/src/App.vue frontend/src/utils/threeSetup.js
  git commit -m "feat(frontend): implement 3x3x3 magic cube with standard colors and materials"
  git push origin dev
  ```

  > **说明**：提交更新，触发 GitHub Actions。

## 验证清单

- [ ] 本地运行 `yarn dev:frontend`，显示交互式 3x3x3 魔方。
- [ ] 本地运行 `yarn format`，仅格式化 **frontend** 和 **backend** 文件。
- [ ] 本地运行 `yarn lint`，无代码规范错误或警告。
- [ ] 本地运行 `yarn test`，**frontend** 和 **backend** 测试通过。
- [ ] 本地运行 `docker compose up -d --build`，访问 <http://localhost:3000/health> 返回正常。
- [ ] 推送至 `dev` 分支后，GitHub Actions 工作流成功运行。
