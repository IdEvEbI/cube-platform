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
        y: event.clientY - previousMousePosition.y,
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
