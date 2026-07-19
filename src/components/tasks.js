import { html, signal, computed } from '@musakui/ui'
import { update, toggle, cached } from '#/utils/signal.js'

/** @typedef {ReturnType<typeof createTask>} Task */

const list = signal([
	createTask('take out the trash', 0, true),
	createTask('drink water', 1),
])

/** @param {Task} item */
function taskItem(item) {
	const iid = `t_${item.id}`

	function remove() {
		update(list, (ls) => ls.filter((t) => t !== item))
	}

	return html`<div class="flex min-w-0 gap-2 p-2">
		<input id=${iid} type="checkbox" .checked=${item.done} @change=${toggle(item.done)} />
		<div class="min-w-0 grow">
			<label
				for=${iid}
				title=${item.name}
				?data-done=${item.done}
				class="data-done:text-muted-foreground truncate data-done:line-through"
			>
				${item.name}
			</label>
		</div>
		<button @click=${remove}>🗑️</button>
	</div>`
}

const TaskItem = cached(taskItem)

export default function () {
	return html`<div class="grid min-h-10 divide-y rounded-md border px-2">
		${computed(() => {
			return list.value.length
				? list.value.map(TaskItem)
				: html`<div class="text-muted-foreground place-self-center select-none">
						no tasks
					</div>`
		})}
	</div>`
}

/** @param {string} name */
export function add(name) {
	update(list, (ls) => [...ls, createTask(name)])
}

/**
 * @param {string} name
 * @param {number} [id]
 */
function createTask(name, id, done = false) {
	return {
		id: id ?? Date.now(),
		name,
		done: signal(done),
	}
}
