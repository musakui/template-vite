<script setup>
import { ref } from 'vue'
const count = ref(0)
const increment = () => ++count.value
</script>

<template>
  <div class="p-4">
    <button class="px-2 py-0.5 rounded text-gray-300 bg-gray-600" @click="increment">
      {{ count }} clicks
    </button>
  </div>
</template>
