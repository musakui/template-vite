<script setup>
import { ref } from 'vue'
const text = ref('hello world')
const count = ref(0)
const increment = () => ++count.value
</script>

<template>
	<h1 class="p-4 text-2xl">Vite Starter Template</h1>
	<div class="p-4 text-xl text-center">Edit me!</div>
	<div class="p-4 flex gap-2 align-center">
		<button class="px-2 py-0.5 rounded text-gray-300 bg-gray-600" @click="increment">
			{{ count }} clicks
		</button>
		<input v-model="text" class="px-1 bg-gray-700 border rounded" />
	</div>
	<div class="p-4 truncate">{{ text }}</div>
</template>
