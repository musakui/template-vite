<script setup>
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
const text = ref('hello world')
const count = ref(0)
const increment = () => ++count.value
</script>

<template>
	<div class="h-screen flex items-center justify-center">
		<div class="w-full max-w-sm flex flex-col gap-4">
			<div class="grid gap-2">
				<Label for="test">Text</Label>
				<Input id="test" v-model="text" />
			</div>
			<Button @click="increment">
				{{ count }} clicks
			</Button>
		</div>
	</div>
</template>
