import { html, signal, computed } from '@musakui/ui'
import { isArray } from '#/utils/lodash.js'

let idCounter = 0

/**
 * Creates a combobox component with search functionality.
 *
 * @param {object} [opts]
 * @param {boolean} [opts.multiple]
 * @param {string} [opts.id]
 * @param {string} [opts.placeholder]
 * @param {string[] | string} [opts.value]
 * @param {Array<{ value: string, label?: string }>} [opts.options]
 */
export function Combobox(opts) {
	const multi = !!opts?.multiple

	const id = opts?.id ?? `combobox-${++idCounter}`
	const listId = `${id}__list`
	const inputId = `${id}__input`

	const search = signal('')
	const expanded = signal(false)
	const activeIdx = signal(-1)

	const options = signal(
		new Map((opts?.options ?? []).map((o) => [o.value, o.label ?? o.value]))
	)

	const selected = signal(
		isArray(opts?.value) ? opts.value : opts?.value ? [opts.value] : []
	)

	const filteredOptions = computed(() => {
		const term = search.value.toLowerCase()
		if (!term) return [...options.value.keys()]
		return [...options.value].flatMap(([value, label]) => {
			return label.toLowerCase().includes(term) ? [value] : []
		})
	})

	/** @type {(v: string) => void} */
	const selectOption = multi
		? (val) => {
				const seld = selected.value
				const ss = new Set(seld)
				selected.value = ss.has(val) ? seld.filter((v) => v !== val) : [...seld, val]
				search.value = ''
				document.getElementById(inputId)?.focus()
			}
		: (val) => {
				selected.value = [val]
				hideList()
			}

	/** @param {boolean | TogglePopoverOptions} opts */
	const pop = (opts) => document.getElementById(listId)?.togglePopover(opts)

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
		const list = filteredOptions.value
		const sch = search.value

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
				if (sch) return
				// move left
				break
			case 'ArrowRight':
				if (sch) return
				// move right
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

	/** @param {HTMLInputElement} el */
	function inputEvents(el) {
		el.addEventListener('keydown', onKeydown)
		el.addEventListener('click', showList)
		el.addEventListener('input', () => {
			search.value = el.value
		})
		el.addEventListener('blur', () => {
			setTimeout(() => {
				if (document.activeElement !== el) hideList()
			}, 150)
		})
	}

	const selectedFallback = multi ? false : null

	const displayValue = computed(() => {
		return search.value || (multi ? '' : options.value.get(selected.value[0]) || '')
	})

	return html`<div id=${id} class="flex w-full flex-wrap gap-1 border p-2">
		<div class="t-secondary contents text-xs">
			${multi
				? computed(() => {
						const seld = selected.value
						const opts = options.value
						/** @param {string} val */
						const remove = (val) => () => {
							selected.value = seld.filter((v) => v !== val)
							document.getElementById(inputId)?.focus()
						}
						return seld.map((val) => {
							return html`<div class="badge flex gap-1 focus-within:outline">
								${opts.get(val) ??
								html`<span class="text-muted-foreground animate-pulse">${val}</span>`}
								<button @click=${remove(val)} class="-mt-0.5 -mr-1 outline-none">
									&times;
								</button>
							</div>`
						})
					})
				: null}
		</div>
		<input
			id=${inputId}
			type="text"
			role="combobox"
			autocomplete="off"
			aria-controls=${listId}
			aria-expanded=${expanded}
			class="min-w-20 flex-1 text-sm"
			placeholder=${computed(() => (selected.value.length ? null : opts.placeholder))}
			.value=${displayValue}
			${inputEvents}
		/>
		<ul
			id=${listId}
			role="listbox"
			popover="manual"
			aria-multiselectable=${multi || null}
			class="combo-listbox mt-1 max-h-60 border p-1 text-sm shadow-md"
		>
			${computed(() => {
				const list = filteredOptions.value
				if (!list.length) {
					return html`<li class="text-muted-foreground p-2">No results found</li>`
				}

				const sel = selected.value
				const cur = activeIdx.value
				const opts = options.value

				return list.map((val, idx) => {
					return html`<li
						role="option"
						class="p-1.5"
						aria-current=${cur === idx}
						aria-selected=${sel.includes(val) || selectedFallback}
						@click=${() => selectOption(val)}
					>
						${opts.get(val) ?? `...`}
					</li>`
				})
			})}
		</ul>
	</div>`
}
