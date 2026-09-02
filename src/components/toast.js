import { html } from '@musakui/ui'

/** @typedef {'success' | 'warning' | 'error'} ToastType */

/** @type {HTMLElement} */
let container

/**
 * @param {string} bg
 * @param {string} fg
 */
const t = (bg, fg) => `--t-bg:var(--color-${bg});--t-fg:var(--color-${fg})`

const styles = {
	'': undefined,
	error: t('red-700', 'red-200'),
	warning: t('amber-800', 'amber-200'),
	success: t('green-800', 'green-200'),
}

export function safelist() {
	return html`
		<span class="bg-red-700 text-red-200"></span>
		<span class="bg-amber-800 text-amber-200"></span>
		<span class="bg-green-800 text-green-200"></span>
	`
}

/**
 * @param {string} msg
 * @param {object} [opts]
 * @param {number} [opts.duration]
 * @param {ToastType} [opts.type]
 */
export function addToast(msg, opts) {
	const frag = html`<li
		style=${styles[opts?.type ?? '']}
		class="card toast flex items-center gap-2 shadow-sm transition"
	>
		<div class="min-w-0 flex-1 text-sm wrap-break-word">${msg}</div>
		<button class="btn" aria-label="Close" @click=${dismiss}>&times;</button>
	</li>`

	const item = init(frag)
	frag.commit()

	function dismiss() {
		if (item.hasAttribute('data-exit')) return
		item.dataset.exit = ''
		setTimeout(remove, 200)
	}

	function remove() {
		item.remove()
		if (!container.childElementCount) container.hidePopover()
	}

	if (!container) return item
	container.togglePopover(true)
	container.append(item)

	const dur = opts?.duration ?? 3000
	if (dur > 0) setTimeout(dismiss, dur)

	return item
}

export default function () {
	const frag = html`<ol
		popover="manual"
		class="fixed right-4 bottom-4 flex w-full max-w-sm flex-col gap-2 overflow-hidden sm:max-w-md"
	></ol>`
	container = init(frag)
	return frag
}

/** @param {import('@musakui/ui').HtmlFragment} frag */
function init(frag) {
	const el = frag.init().el
	if (!el) throw new Error('could not init')
	return el
}
