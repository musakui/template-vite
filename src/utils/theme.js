import { effect } from 'alien-signals'
import { useStorage } from './storage.js'

const DARK = 'dark'
const LIGHT = 'light'
const SYSTEM = 'system'

/** @typedef {'light' | 'dark' | 'system'} Theme */

export const theme = useStorage('theme', {
	parse: (s) => /** @type {Theme} */ (s ?? SYSTEM),
	serialize: (v) => (v === SYSTEM ? null : v),
})

export function toggleTheme() {
	const t = theme.value
	const v = t === LIGHT ? SYSTEM : t === DARK ? LIGHT : DARK
	theme.value = v
	return /** @type {Theme} */ (v)
}

effect(() => {
	document.body.dataset.theme = theme.value
})
