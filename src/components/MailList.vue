<script setup lang="ts">
import { cn } from '@/lib/utils'
import {
	ScrollAreaRoot,
	ScrollAreaThumb,
	ScrollAreaViewport,
	ScrollAreaScrollbar,
} from 'radix-vue'

import type { mails } from '../mails.js'
defineProps<{ items: typeof mails }>()
const selectedMail = defineModel<string>('selectedMail', { required: false })

const relFmt = new Intl.RelativeTimeFormat('en', { style: 'long' })
const now = new Date().getTime()
const MS_TO_DAYS = 1000 * 60 * 60 * 24
const formatDistanceToNow = (date: string) => {
	const dt = new Date(date).getTime() - now
	return relFmt.format(Math.floor(dt / MS_TO_DAYS), 'day')
}
</script>

<template>
	<ScrollAreaRoot class="relative overflow-hidden h-screen">
		<ScrollAreaViewport class="h-full w-full rounded-[inherit]">
			<div class="flex-1 flex flex-col gap-2 p-3">
				<TransitionGroup name="list" appear move-class="transition-all duration-200"
					enter-from-class="opacity-0 translate-y-15px" enter-active-class="transition-all duration-200"
					leave-active-class="absolute transition-all duration-200" leave-to-class="opacity-0 translate-y-15px">
					<button v-for="item of items" :key="item.id" :class="cn(
						'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
						selectedMail === item.id && 'bg-muted'
					)
						" @click="selectedMail = item.id">
						<div class="flex w-full flex-col gap-1">
							<div class="flex items-center">
								<div class="flex items-center gap-2">
									<div class="font-semibold">
										{{ item.name }}
									</div>
									<span v-if="!item.read" class="flex h-2 w-2 rounded-full bg-blue-600" />
								</div>
								<div :class="cn(
									'ml-auto text-xs',
									selectedMail === item.id ? 'text-foreground' : 'text-muted-foreground'
								)
									">
									{{ formatDistanceToNow(item.date) }}
								</div>
							</div>

							<div class="text-xs font-medium">
								{{ item.subject }}
							</div>
						</div>
						<div class="line-clamp-2 text-xs text-muted-foreground">
							{{ item.text.substring(0, 300) }}
						</div>
						<div class="flex items-center gap-2">
							<div v-for="label of item.labels" :key="label"
								class="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs">
								{{ label }}
							</div>
						</div>
					</button>
				</TransitionGroup>
			</div>
		</ScrollAreaViewport>
		<ScrollAreaScrollbar
			class="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-px">
			<ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
		</ScrollAreaScrollbar>
	</ScrollAreaRoot>
</template>
