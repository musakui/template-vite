import { effect } from 'alien-signals'
import { html, computed } from '@musakui/ui'
import { useCombobox } from '#/utils/combo.js'
import './combobox.css'

let idCounter = 0

/** @typedef {{ value: string; label?: string }} DisplayOption */

/**
 * Creates a combobox component with search functionality.
 *
 * @param {object} [opts]
 * @param {boolean} [opts.multiple]
 * @param {string} [opts.id]
 * @param {string} [opts.name]
 * @param {boolean} [opts.disabled]
 * @param {boolean} [opts.required]
 * @param {string} [opts.placeholder]
 * @param {string[] | string} [opts.value]
 * @param {DisplayOption[]} [opts.options]
 * @param {(s: string, sig: AbortSignal) => Promise<DisplayOption[]>} [opts.loadOptions]
 */
export function Combobox(opts) {
	const multi = !!opts?.multiple
	const selectedFallback = multi ? false : null

	const id = opts?.id ?? `combobox-${++idCounter}`
	const grpId = `${id}__grp`
	const listId = `${id}__list`

	const cb = useCombobox(opts)

	const combobox = html`<input
		id=${id}
		type="text"
		role="combobox"
		autocomplete="off"
		aria-controls=${listId}
		aria-expanded=${cb.expanded}
		placeholder=${cb.placeholder}
		?disabled=${opts?.disabled}
		.value=${cb.displayVal}
		@click=${cb.showList}
		@command=${onCommand}
		@keydown=${onKeydown}
		@input=${onInput}
		@blur=${onBlur}
	/>`.init()

	const listbox = html`<ul
		id=${listId}
		role="listbox"
		popover="manual"
		aria-multiselectable=${multi || null}
	>
		${computed(() => {
			const list = cb.filteredOptions.value
			if (!list.length) {
				return html`<li>${cb.loading.value ? `Loading...` : `No results found`}</li>`
			}

			const sel = new Set(cb.selected.value)
			const cur = cb.activeIdx.value
			const ops = cb.options.value

			return list.map((v, i) => {
				return html`<li
					role="option"
					aria-current=${cur === i}
					aria-selected=${sel.has(v) || selectedFallback}
				>
					<button type="button" commandfor=${id} command="--a" data-val=${v}>
						${ops.get(v) ?? v}
					</button>
				</li>`
			})
		})}
	</ul>`.init()

	/**
	 * @this {HTMLInputElement}
	 * @param {KeyboardEvent} evt
	 */
	function onKeydown(evt) {
		const a = cb.handleKeydown(evt)
		if (a?.focusLastChip) getLastChip(grpId)?.focus()
	}

	/** @this {HTMLInputElement} */
	function onBlur() {
		setTimeout(() => {
			if (document.activeElement !== this) cb.hideList()
		}, 250)
	}

	/**
	 * @this {HTMLInputElement}
	 * @param {CommandEvent} evt
	 */
	function onCommand(evt) {
		const val = /** @type {HTMLElement} */ (evt.source)?.dataset?.val
		if (!val) return
		if (evt.command === '--a') {
			cb.selectOption(val)
		} else if (evt.command === '--x') {
			cb.removeSelected(val)
		}
		this.focus()
	}

	/** @this {HTMLInputElement} */
	async function onInput() {
		await cb.handleInput(this.value)
	}

	const chips = multi
		? computed(() => {
				const ops = cb.options.value
				return cb.selected.value.map((v) => {
					return html`<div class="badge">
						${ops.get(v) ?? html`<span class="loading">${v}</span>`}
						<button type="button" commandfor=${id} command="--x" data-val=${v}>
							&times;
						</button>
					</div>`
				})
			})
		: null

	const formEl = opts?.name
		? html`<select name=${opts.name} ?multiple=${multi} ?required=${opts?.required}>
				${computed(() => cb.selected.value.map(selectedOpt))}
			</select>`
		: null

	effect(() => {
		const show = cb.expanded.value
		const el = listbox.el
		if (!el) return
		try {
			el.togglePopover(show && { force: true, source: maybeParent(combobox.el) })
		} catch {
			//
		}
	})

	return html`<div id=${grpId} class="combobox">
		${formEl}
		<div class="chips t-secondary">${chips}</div>
		${combobox}${listbox}
	</div>`
}

/** @param {string} v */
function selectedOpt(v) {
	return html`<option value=${v} selected></option>`
}

/** @param {HTMLElement} [el] */
function maybeParent(el) {
	return el?.parentElement ?? el
}

/** @param {string} grpId */
function getLastChip(grpId) {
	const buttons = document.getElementById(grpId)?.querySelectorAll(`button`)
	return buttons?.[buttons.length - 1]
}
