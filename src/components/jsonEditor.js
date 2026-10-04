import { html } from '@musakui/ui'
import { $str } from '#/utils/signal.js'
import { useJsonEditor } from '#/utils/jsonEditor.js'
import './jsonEditor.css'

/**
 * @param {object} [opts]
 * @param {number} [opts.rows]
 * @param {string} [opts.value]
 */
export function JsonEditor(opts) {
	const je = useJsonEditor({
		...opts,
		render(t) {
			return t.type === 'txt' ? t.value : html`<span data-tok=${t.type}>${t.value}</span>`
		},
	})

	/** @this {HTMLTextAreaElement} */
	function onBlur() {
		const val = this.value.trim()
		if (val) this.setCustomValidity(je.process(val))
	}

	/** @this {HTMLTextAreaElement} */
	function onScroll() {
		je.syncScroll(this)
	}

	return html`<div class="json-editor">
		<pre class="editorfont json-highlight" aria-hidden="true">${je.highlighted}</pre>
		<textarea
			class="inp editorfont json-input"
			placeholder=" "
			rows=${opts?.rows ?? 10}
			${$str(je.text)}
			@blur=${onBlur}
			@scroll=${onScroll}
		></textarea>
	</div>`
}
