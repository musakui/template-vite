<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import type { mails } from '../mails.js'
defineProps<{ mail?: (typeof mails)[0] }>()
</script>

<template>
	<div class="flex h-full flex-col">
		<div class="flex items-center p-2">
			<div class="flex items-center gap-2">
				<Button variant="ghost" size="icon" :disabled="!mail">
					<Icon icon="lucide:archive" class="size-4" />
					<span class="sr-only">Archive</span>
				</Button>
				<Button variant="ghost" size="icon" :disabled="!mail">
					<Icon icon="lucide:trash-2" class="size-4" />
					<span class="sr-only">Move to trash</span>
				</Button>
			</div>
			<div class="ml-auto flex items-center gap-2">
				<Button variant="ghost" size="icon" :disabled="!mail">
					<Icon icon="lucide:reply" class="size-4" />
					<span class="sr-only">Reply</span>
				</Button>
				<Button variant="ghost" size="icon" :disabled="!mail">
					<Icon icon="lucide:forward" class="size-4" />
					<span class="sr-only">Forward</span>
				</Button>
			</div>
		</div>
		<Separator />
		<div v-if="mail" class="flex flex-1 flex-col">
			<div class="flex items-start p-4">
				<div class="flex items-start gap-4 text-sm">
					<div class="grid gap-1">
						<div class="font-semibold">{{ mail.name }}</div>
						<div class="line-clamp-1 text-xs">{{ mail.subject }}</div>
						<div class="line-clamp-1 text-xs">Reply-To: {{ mail.email }}</div>
					</div>
				</div>
				<div v-if="mail.date" class="ml-auto text-xs text-muted-foreground">{{ mail.date }}</div>
			</div>
			<Separator />
			<div class="flex-1 whitespace-pre-wrap p-4 text-sm">{{ mail.text }}</div>
		</div>
		<div v-else class="p-8 text-center text-muted-foreground">No message selected</div>
	</div>
</template>
