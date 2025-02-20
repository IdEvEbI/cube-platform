<script setup>
import { ref, onMounted } from 'vue'

const status = ref('Loading...')

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/health')
    const data = await response.json()
    status.value = data.status
  } catch (error) {
    status.value = 'Error: ' + error.message
  }
})
</script>

<template>
  <div>
    <h1>Cube Platform</h1>
    <p>Backend Status: {{ status }}</p>
  </div>
</template>

<style>
/* 可选样式，后续扩展 */
</style>