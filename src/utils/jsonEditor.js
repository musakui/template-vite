import { signal, computed } from '@musakui/ui'

const tokenType = ['key', 'str', 'pun', 'num', 'num']
const tokenRe =
	/("(?:\\.|[^"\\])*")\s*:|("(?:\\.|[^"\\])*")|([{}\[\]:,])|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b|(true|false|null)/g

const MAX_INLINE_WIDTH = 50
const INDENT = '  '

/**
 * @param {object} [opts]
 * @param {string} [opts.value]
 * @param {(t: { type: string, value: string }) => unknown} [opts.render]
 */
export function useJsonEditor(opts) {
	const text = signal(opts?.value ?? '')
	const render = opts?.render ?? ((t) => t.value)

	return {
		text,
		highlighted: computed(() => tokenize(text.value).map(render).toArray()),

		/**
		 * @param {HTMLElement} el
		 */
		syncScroll(el) {
			const pre = el.previousElementSibling
			if (!pre) return
			pre.scrollTop = el.scrollTop
			pre.scrollLeft = el.scrollLeft
		},

		/** @param {string} txt */
		process(txt) {
			try {
				text.value = format(JSON.parse(txt), '')
				return ''
			} catch (err) {
				return /** @type {Error} */ (err).message
			}
		},
	}
}

/** @param {string} text */
function* tokenize(text) {
	if (!text) return
	let last = 0
	for (const m of text.matchAll(tokenRe)) {
		if (m.index > last) {
			yield { type: 'txt', value: text.slice(last, m.index) }
		}

		const idx = tokenType.findIndex((_, i) => m[i + 1])
		if (idx > -1) yield { type: tokenType[idx], value: m[idx + 1] }

		const rest = m[1] ? m[0].slice(m[1].length) : null
		if (rest) yield { type: 'txt', value: rest }

		last = m.index + m[0].length
	}

	if (last < text.length) {
		yield { type: 'txt', value: text.slice(last) }
	}
}

/**
 * @param {unknown} val
 * @param {string} indent
 * @returns {string}
 */
function format(val, indent) {
	if (Array.isArray(val)) {
		return collapse(val, '[', ']', indent, (v) => format(v, indent + INDENT))
	}
	if (val && typeof val === 'object') {
		const entries = Object.entries(val)
		return collapse(
			entries,
			'{ ',
			' }',
			indent,
			([k, v]) => `${JSON.stringify(k)}: ${format(v, indent + INDENT)}`
		)
	}
	return JSON.stringify(val)
}

/**
 * @template T
 * @param {T[]} items
 * @param {string} open
 * @param {string} close
 * @param {string} indent
 * @param {(item: T) => string} render
 * @returns {string}
 */
function collapse(items, open, close, indent, render) {
	if (!items.length) return open.trim() + close.trim()
	const parts = items.map(render)
	const inline = `${open}${parts.join(', ')}${close}`
	if (inline.length < MAX_INLINE_WIDTH) return inline
	const ch = indent + INDENT
	return `${open.trim()}\n${parts.map((p) => ch + p).join(',\n')}\n${indent}${close.trim()}`
}
