import { signal, computed } from '@musakui/ui'

/** @typedef {{ value: string; label?: string }} DisplayOption */

/**
 * Headless combobox state and logic
 *
 * @param {object} [opts]
 * @param {number} [opts.limit]
 * @param {boolean} [opts.multiple]
 * @param {string} [opts.placeholder]
 * @param {string[] | string} [opts.value]
 * @param {DisplayOption[]} [opts.options]
 * @param {(s: string, sig: AbortSignal) => Promise<DisplayOption[]>} [opts.loadOptions]
 */
export function useCombobox(opts) {
	const multi = !!opts?.multiple
	const limit = opts?.limit ?? 10

	const search = signal('')
	const loading = signal(false)
	const expanded = signal(false)
	const activeIdx = signal(-1)

	const selected = signal(normaliseArray(opts?.value))
	const options = signal(normaliseOpts(opts?.options))

	const filteredOptions = computed(() => {
		const term = search.value.trim().toLowerCase()
		if (!term) return options.value.keys().take(limit).toArray()
		return options.value
			.entries()
			.filter((t) => t[1].toLowerCase().includes(term))
			.take(limit)
			.map((t) => t[0])
			.toArray()
	})

	function showList() {
		expanded.value = true
	}

	function hideList() {
		expanded.value = false
		search.value = ''
		activeIdx.value = -1
	}

	const selectOption = multi
		? /** @param {string} val */ (val) => {
				const sd = selected.value
				const sel = new Set(sd)
				selected.value = sel.has(val) ? sd.filter((v) => v !== val) : [...sd, val]
				search.value = ''
			}
		: /** @param {string} val */ (val) => {
				selected.value = [val]
				hideList()
			}

	/** @type {AbortController | null} */
	let controller = null

	/** @param {string} val */
	async function setSearch(val) {
		search.value = val
		if (!opts?.loadOptions) return
		if (controller) controller.abort()
		const st = val.trim()
		if (!st) {
			loading.value = false
			return
		}
		controller = new AbortController()
		const sig = controller.signal
		loading.value = true
		try {
			const res = await opts.loadOptions(st, sig)
			if (sig.aborted || !res) return
			const newMap = new Map(options.value)
			for (const opt of res) {
				newMap.set(opt.value, opt.label ?? opt.value)
			}
			options.value = newMap
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') return
			console.log(err)
		} finally {
			if (sig.aborted) return
			loading.value = false
		}
	}

	/** @param {KeyboardEvent} evt */
	function handleKeydown(evt) {
		const sch = search.value
		switch (evt.code) {
			case 'ArrowDown':
				if (expanded.value) {
					const lim = filteredOptions.value.length - 1
					activeIdx.value = Math.min(activeIdx.value + 1, lim)
				} else {
					showList()
				}
				break
			case 'ArrowUp':
				activeIdx.value = Math.max(activeIdx.value - 1, 0)
				break
			case 'ArrowLeft':
				if (!multi || sch) break
				return { focusLastChip: true }
			case 'Space':
				if (sch) break
			// fallthrough
			case 'Enter':
				evt.preventDefault()
				const opt = filteredOptions.value[activeIdx.value]
				if (opt) selectOption(opt)
			// fallthrough
			case 'Escape':
				hideList()
				break
			case 'Backspace':
				if (!multi) {
					if (search.value.length === 1) selected.value = []
					return
				}
				if (search.value || !selected.value.length) return
				selected.value = selected.value.slice(0, -1)
				break
			default:
				showList()
				break
		}
	}

	return {
		multi,
		search,
		options,
		loading,
		selected,
		expanded,
		activeIdx,
		filteredOptions,
		showList,
		hideList,
		selectOption,
		handleKeydown,

		/** @param {string} val */
		async handleInput(val) {
			await setSearch(val)
			showList()
		},

		/** @param {string} val */
		removeSelected(val) {
			selected.value = selected.value.filter((v) => v !== val)
		},

		placeholder: computed(() => (selected.value.length ? null : opts?.placeholder)),

		displayVal: computed(() => {
			return search.value || (multi ? '' : options.value.get(selected.value[0]) || '')
		}),
	}
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
