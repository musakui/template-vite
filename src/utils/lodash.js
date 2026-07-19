/**
 * @template [T=unknown]
 * @typedef {Record<string, T>} Rec
 */

/**
 * @param {unknown} v
 * @returns {v is unknown[]}
 */
export const isArr = (v) => Array.isArray(v)

/**
 * @param {unknown} v
 * @returns {v is Rec}
 */
export const isObj = (v) => !!v && typeof v === 'object' && !isArr(v)

/** @param {unknown} v */
export const isStr = (v) => typeof v === 'string'

/** @param {unknown} v */
export const isNum = (v) => typeof v === 'number'

/** @param {unknown} v */
export const isFn = (v) => typeof v === 'function'

/**
 * @template T
 * @template U
 * @param {Rec<T>} o
 * @param {(key: string, val: T) => [string, U]} t
 */
export function mapObject(o, t) {
	return Object.fromEntries(Object.entries(o).map((v) => t(v[0], v[1])))
}

/**
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
export const clamp = (val, min, max) => Math.max(min, Math.min(max, val))

/** @param {number} d */
export const millis = (d) => new Promise((r) => setTimeout(r, d))
