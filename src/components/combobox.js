import { html, signal, computed } from '@musakui/ui'
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

	const search = signal('')
	const expanded = signal(false)
	const loading = signal(false)
	const activeIdx = signal(-1)

	const selected = signal(normaliseArray(opts?.value))

	const options = signal(normaliseOpts(opts?.options))
	const filteredOptions = computed(() => {
		const term = search.value.toLowerCase()
		if (!term) return options.value.keys().toArray()
		return options.value
			.entries()
			.flatMap(([v, t]) => (t.toLowerCase().includes(term) ? [v] : []))
			.toArray()
	})

	const displayVal = computed(() => {
		return search.value || (multi ? '' : options.value.get(selected.value[0]) || '')
	})

	const combobox = html`<input
		id=${id}
		type="text"
		role="combobox"
		autocomplete="off"
		aria-controls=${listId}
		aria-expanded=${expanded}
		placeholder=${computed(() => (selected.value.length ? null : opts?.placeholder))}
		?disabled=${opts?.disabled}
		.value=${displayVal}
		@keydown=${onKeydown}
		@click=${showList}
		@input=${onInput}
		@blur=${onBlur}
	/>`.init()

	/** @type {(v: string, s: Set<string>) => void} */
	const selectOption = multi
		? (val, sel) => {
				const sd = selected.value
				selected.value = sel.has(val) ? sd.filter((v) => v !== val) : [...sd, val]
				search.value = ''
				combobox.el?.focus()
			}
		: (val) => {
				selected.value = [val]
				hideList()
			}

	const listbox = html`<ul
		id=${listId}
		role="listbox"
		popover="manual"
		aria-multiselectable=${multi || null}
	>
		${computed(() => {
			const list = filteredOptions.value
			if (!list.length) {
				return html`<li>${loading.value ? `Loading...` : `No results found`}</li>`
			}

			const sel = new Set(selected.value)
			const cur = activeIdx.value
			const ops = options.value

			return list.map((v, i) => {
				return html`<li
					role="option"
					aria-current=${cur === i}
					aria-selected=${sel.has(v) || selectedFallback}
					@click=${() => selectOption(v, sel)}
				>
					${ops.get(v) ?? `...`}
				</li>`
			})
		})}
	</ul>`.init()

	/** @param {boolean | TogglePopoverOptions} op */
	const pop = (op) => {
		try {
			listbox.el?.togglePopover(op)
		} catch {
			//
		}
	}


	/** @this {HTMLElement} */
	function showList() {
		pop({ force: true, source: this.parentElement })
		expanded.value = true
	}

	function hideList() {
		pop(false)
		search.value = ''
		activeIdx.value = -1
		expanded.value = false
	}

	/**
	 * @this {HTMLInputElement}
	 * @param {KeyboardEvent} evt
	 */
	function onKeydown(evt) {
		const sch = search.value
		const list = filteredOptions.value

		switch (evt.code) {
			case 'ArrowDown':
				if (expanded.value) {
					activeIdx.value = Math.min(activeIdx.value + 1, list.length - 1)
				} else {
					showList.call(this)
				}
				break
			case 'ArrowUp':
				activeIdx.value = Math.max(activeIdx.value - 1, 0)
				break
			case 'ArrowLeft':
				if (!multi || sch) return
				const lst = document.querySelectorAll(`#${grpId} button`)
				lst[lst.length - 1]?.focus()
				break
			case 'Space':
				if (sch) return
			// fallthrough
			case 'Enter':
				evt.preventDefault()
				const opt = list[activeIdx.value]
				if (opt) selectOption(opt)
				break
			case 'Escape':
				hideList()
				break
			case 'Backspace':
				if (!multi && sch.length === 1) {
					selected.value = []
					return
				}
				if (!multi || sch || !selected.value.length) return
				selected.value = selected.value.slice(0, -1)
				break
			default:
				if (!expanded.value) showList.call(this)
				break
		}
	}

	/** @this {HTMLInputElement} */
	function onBlur() {
		setTimeout(() => {
			if (document.activeElement !== this) hideList()
		}, 150)
	}

	/** @type {AbortController | null} */
	let controller = null

	/** @this {HTMLInputElement} */
	async function onInput() {
		search.value = this.value
		if (!opts?.loadOptions) return
		if (controller) controller.abort()
		const st = this.value.trim()
		if (!st) return
		controller = new AbortController()
		loading.value = true
		try {
			const res = await opts.loadOptions(st, controller.signal)
			if (controller?.signal.aborted || !res) return
			const newMap = new Map(options.value)
			for (const opt of res) {
				newMap.set(opt.value, opt.label ?? opt.value)
			}
			options.value = newMap
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') return
			console.log(err)
		} finally {
			if (controller?.signal.aborted) return
			loading.value = false
		}
	}

	return html`<div id=${grpId} class="combobox">
		${opts?.name
			? html`<select name=${opts.name} ?multiple=${multi} ?required=${opts?.required}>
					${computed(() => selected.value.map(selectedOpt))}
				</select>`
			: null}
		<div class="chips t-secondary">
			${multi
				? computed(() => {
						const sel = selected.value
						const ops = options.value
						/** @param {string} val */
						const remove = (val) => () => {
							selected.value = sel.filter((v) => v !== val)
							combobox.el?.focus()
						}
						return sel.map((v) => {
							return html`<div class="badge">
								${ops.get(v) ?? html`<span class="loading">${v}</span>`}
								<button @click=${remove(v)}>&times;</button>
							</div>`
						})
					})
				: null}
		</div>
		${combobox}${listbox}
	</div>`
}

/**
 * @template T
 * @param {T | T[]} [val] */
function normaliseArray(val) {
	return Array.isArray(val) ? val : val ? [val] : []
}

/** @param {DisplayOption[]} [opts] */
function normaliseOpts(opts) {
	return new Map((opts ?? []).map((o) => [o.value, o.label ?? o.value]))
}

/** @param {string} v */
function selectedOpt(v) {
	return html`<option value=${v} selected></option>`
}
