import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** @param {import('clsx').ClassValue[]} inputs */
export const cn = (...inputs) => twMerge(clsx(inputs))

/**
 * @template T
 * @param {T} fn
 * @returns {T}
 */
export const debounce = (fn, delay = 0) => {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => fn(...args), delay)
	}
}
