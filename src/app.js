import { html, registerEffect } from '@musakui/ui'
import { count, text } from './state.js'

export default function () {
	return html`
		<h1 class="p-4 text-2xl">Vite Starter Template</h1>
		<div class="p-4 text-xl text-center">Edit me!</div>
		<div class="p-4 flex gap-2 items-center">
			<button
				class="px-2 py-1 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90"
				@click=${() => ++count.value}
			>
				${count} clicks
			</button>
			<input type="text" name="hello" class="px-1 border rounded-sm" ${bindText} />
		</div>
		<div class="p-4 truncate">${text}</div>
	`
}

/** @param {HTMLInputElement} el */
export function bindText(el) {
	el.addEventListener('input', () => {
		text.value = el.value
	})
	registerEffect(el, () => {
		el.value = text.value
	})
}
