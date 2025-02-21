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
    R: 0xffa500, // 右 - 橙
  }

  // 定义材质，使用 MeshStandardMaterial 提升质感
  const materials = Object.fromEntries(
    Object.entries(colors).map(([face, color]) => [
      face,
      new THREE.MeshStandardMaterial({ color }),
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
          x === 1
            ? materials.R
            : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 右
          x === -1
            ? materials.L
            : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 左
          y === 1
            ? materials.U
            : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 上
          y === -1
            ? materials.D
            : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 下
          z === 1
            ? materials.F
            : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 前
          z === -1
            ? materials.B
            : new THREE.MeshStandardMaterial({ color: 0x808080 }), // 后
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
