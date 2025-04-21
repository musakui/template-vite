<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
const count = ref(0)
const increment = () => ++count.value
</script>

<template>
	<div class="p-4 flex gap-2 align-center">
		<Button @click="increment">
			{{ count }} clicks
		</Button>
	</div>
</template>
