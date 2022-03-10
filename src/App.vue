<script setup>
import { ref } from 'vue'
const count = ref(0)
const increment = () => ++count.value
</script>

<template>
  <h1 class="p-4 text-2xl">Vite Starter Template</h1>
  <div class="p-4">
    <div class="mb-2 text-xl">
      Edit me!
    </div>
    <button class="px-2 py-0.5 rounded text-gray-300 bg-gray-600" @click="increment">
      {{ count }} clicks
    </button>
  </div>
</template>
