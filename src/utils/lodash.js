/**
 * @param {unknown} v
 * @returns {v is unknown[]}
 */
export const isArray = (v) => Array.isArray(v)

/**
 * @param {unknown} v
 * @returns {v is Record<string, unknown>}
 */
export const isObject = (v) => !!v && typeof v === 'object' && !isArray(v)

/**
 * @param {unknown} v
 * @returns {v is Function}
 */
export const isFunction = (v) => typeof v === 'function'

/** @param {unknown} v */
export const isStr = (v) => typeof v === 'string'

/** @param {unknown} v */
export const isNum = (v) => typeof v === 'number'

/**
 * @template T
 * @template U
 * @param {Record<string, T>} o
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
