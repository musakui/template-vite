<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'

import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'

import { cn, debounce } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button, buttonVariants as bv } from '@/components/ui/button'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'

import MailList from './MailList.vue'
import MailDisplay from './MailDisplay.vue'

import type { mails } from '../mails.js'

interface MailProps {
	mails: typeof mails
	accounts: {
		label: string
		email: string
		icon: string
	}[]
}

const props = defineProps<MailProps>()

const selectedMail = ref<string | undefined>()
const searchValue = ref('')
const debouncedSearch = ref('')
watch(searchValue, debounce(() => {
	debouncedSearch.value = searchValue.value
}, 250))

const filteredMailList = computed(() => {
	const searchValue = debouncedSearch.value?.trim()
	if (!searchValue) return props.mails
	return props.mails.filter((item) => {
		return (
			item.name.includes(debouncedSearch.value) ||
			item.email.includes(debouncedSearch.value) ||
			item.name.includes(debouncedSearch.value) ||
			item.subject.includes(debouncedSearch.value) ||
			item.text.includes(debouncedSearch.value)
		)
	})
})

const selectedMailData = computed(() =>
	props.mails.find((item) => item.id === selectedMail.value)
)

const sheetState = computed({
	get() {
		return !!selectedMail.value && window.matchMedia('(max-width: 768px)').matches
	},
	set(v) {
		if (!v) {
			selectedMail.value = ''
		}
	}
})

const links = [
	{
		title: 'Inbox',
		icon: 'lucide:inbox',
		variant: 'default' as const,
	},
	{
		title: 'Drafts',
		icon: 'lucide:file',
		variant: 'ghost' as const,
	},
	{
		title: 'Sent',
		icon: 'lucide:send',
		variant: 'ghost' as const,
	},
	{
		title: 'Junk',
		icon: 'lucide:archive',
		variant: 'ghost' as const,
	},
	{
		title: 'Trash',
		icon: 'lucide:trash',
		variant: 'ghost' as const,
	},
	{
		title: 'Archive',
		icon: 'lucide:archive',
		variant: 'ghost' as const,
	},
]
</script>

<template>
	<div class="flex h-screen">
		<nav class="flex flex-col gap-2 py-2 px-1 w-12 sm:w-60 max-w-60">
			<a v-for="link of links" :key="link.title" href="#" :class="cn(
				bv({ variant: 'ghost', size: 'sm' }),
				'sm:justify-start'
			)">
				<Icon :icon="link.icon" class="sm:mr-2 size-3 sm:size-4" />
				<span class="hidden sm:block">{{ link.title }}</span>
			</a>
		</nav>
		<Separator orientation="vertical" />
		<div class="md:hidden">
			<Sheet v-model:open="sheetState">
				<SheetContent class="w-8/9">
					<SheetHeader>
						<SheetTitle>{{ selectedMailData?.subject }}</SheetTitle>
						<SheetDescription></SheetDescription>
					</SheetHeader>
					<MailDisplay :mail="selectedMailData" />
					<SheetFooter>
						<SheetClose as-child>
							<Button>close</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
			<MailList v-model:selected-mail="selectedMail" :items="filteredMailList" />
		</div>
		<div class="hidden md:block">
			<SplitterGroup direction="horizontal" class="items-stretch">
				<SplitterPanel :default-size="40" :min-size="30">
					<MailList v-model:selected-mail="selectedMail" :items="filteredMailList" />
				</SplitterPanel>
				<SplitterResizeHandle
					class="relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1">
					<div class="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
						<Icon icon="lucide:grip-vertical" class="h-2.5 w-2.5" />
					</div>
				</SplitterResizeHandle>
				<SplitterPanel :default-size="70" :min-size="50" collapsible :collapsed-size="4">
					<MailDisplay :mail="selectedMailData" />
				</SplitterPanel>
			</SplitterGroup>
		</div>
	</div>
</template>
