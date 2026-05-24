import { html, signal } from '@musakui/ui'
import { update, cached } from '#/utils/signal.js'

/** @typedef {ReturnType<typeof createTask>} Task */

export const list = signal([
	createTask('take out the trash', 0, true),
	createTask('drink water', 1),
])

/** @param {string} name */
export function add(name) {
	update(list, (ls) => [...ls, createTask(name)])
}

/** @param {Task} item */
function taskItem(item) {
	const iid = `t_${item.id}`

	function remove() {
		update(list, (ls) => ls.filter((t) => t !== item))
	}

	function toggle() {
		update(item.done, (v) => !v)
	}

	return html`<div class="flex min-w-0 gap-2 p-2">
		<input id=${iid} type="checkbox" .checked=${item.done} @change=${toggle} />
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

export const TaskItem = cached(taskItem)

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
