import { html, computed } from '@musakui/ui'
import { count, text } from '#/state.js'
import { $str } from '#/utils/signal.js'
import Tasks, { add } from '#/components/tasks.js'

export default function () {
	return html` <div class="max-w-xl">
		<h1 class="p-4 text-2xl">Vite Starter Template</h1>
		<div class="grid items-center gap-2 p-4">
			<div class="flex items-center justify-center gap-2">
				<button class="btn t-primary" @click=${() => ++count.value}>
					${count} clicks
				</button>
				<button
					class="btn t-secondary"
					?disabled=${computed(() => count.value < 2)}
					@click=${() => (count.value = 0)}
				>
					Reset
				</button>
			</div>
			<div class="grid gap-2">
				<label for="task" class="flex items-center text-sm font-medium">Task</label>
				<div class="flex">
					<input
						id="task"
						type="text"
						placeholder="What do you need to do next?"
						class="bg-background h-9 w-full rounded-md border px-3 py-2 text-sm"
						${$str(text)}
					/>
					<button
						class="px-2"
						?disabled=${computed(() => !text.value.trim())}
						@click=${addTask}
					>
						➕
					</button>
				</div>
			</div>
			${Tasks()}
		</div>
	</div>`
}

function addTask() {
	const t = text.value.trim()
	if (!t) return
	add(t)
	text.value = ''
}
