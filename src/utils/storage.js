import { effect } from 'alien-signals'
import { signal } from '@musakui/ui'

/** @import { Signal } from '@musakui/ui' */

/** @type {Map<string, { sig: Signal<unknown>, stop: () => void }>} */
const cache = new Map()

const abortController = new AbortController()

/**
 * @template T
 * @param {string} key
 * @param {object} opts
 * @param {T} [opts.defaultValue]
 * @param {(s: string | null) => T} [opts.parse]
 * @param {(v: T) => string | null} [opts.serialize]
 */
export function useStorage(key, opts) {
	const found = cache.get(key)
	if (found) return /** @type {Signal<T>} */ (found.sig)

	const defaultVal = opts?.defaultValue ?? null
	const parse = opts?.parse ?? ((s) => /** @type {T} */ (s ? JSON.parse(s) : defaultVal))
	const serialize = opts?.serialize ?? ((s) => JSON.stringify(s))

	const sig = signal(parse(localStorage.getItem(key)))
	const stop = effect(() => {
		const val = serialize(sig.value)
		if (localStorage.getItem(key) === val) return
		if (val === null) {
			localStorage.removeItem(key)
		} else {
			localStorage.setItem(key, val)
		}
	})

	cache.set(key, { sig, stop })

	// prettier-ignore
	window.addEventListener('storage', (evt) => {
		if (evt.key !== key) return
		sig.value = parse(evt.newValue)
	}, { signal: abortController.signal })

	return sig
}

/** @param {string} key */
export function useStorageBool(key) {
	return useStorage(key, {
		parse: (s) => s === 'true',
		serialize: (s) => (s ? 'true' : null),
	})
}

/** @param {string} key */
export function useStorageString(key, defaultValue = '') {
	return useStorage(key, {
		parse: (s) => s ?? defaultValue,
		serialize: (s) => (s === defaultValue ? null : s),
	})
}

/** @param {string} key */
export function useStorageNumber(key, defaultValue = 0) {
	return useStorage(key, {
		parse: (s) => {
			const n = parseFloat(s || '')
			return Number.isNaN(n) ? defaultValue : n
		},
		serialize: (s) => (s === defaultValue ? null : `${s}`),
	})
}

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		abortController.abort()
		for (const c of cache.values()) c.stop()
		cache.clear()
	})
}
