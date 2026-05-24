const LIST_REG = /^[\d,]+$/
const STEP_REG = /^\*\/(\d+)$/
const RANGE_REG = /^(\d+)-(\d+)$/

const LIST = /** @type {const} */ ('list')

/** @typedef {NonNullable<ReturnType<typeof parseField>>} ParsedField */
/** @typedef {NonNullable<ReturnType<typeof parseCron>>} ParsedCron */

/**
 * Parse a field of a cron expression
 *
 * @param {string} field
 * @param {number} max
 */
export function parseField(field, max = 60) {
	if (field === '*') {
		return { type: /** @type {const} */ ('every') }
	}

	const stepMatch = STEP_REG.exec(field)
	if (stepMatch) {
		const step = parseInt(stepMatch[1])
		if (step < 1 || step >= max) return null
		return { type: /** @type {const} */ ('step'), step }
	}

	const rangeMatch = RANGE_REG.exec(field)
	if (rangeMatch) {
		const a = parseInt(rangeMatch[1])
		const b = parseInt(rangeMatch[2])
		if (a < 0 || b >= max || a > b) return null
		/** @type {number[]} */
		const list = []
		for (let i = a; i <= b; ++i) list.push(i)
		return { type: LIST, list }
	}

	if (LIST_REG.test(field)) {
		const nums = field.split(',').map((s) => {
			const n = parseInt(s)
			return n < 0 || n >= max ? NaN : n
		})

		if (nums.some((n) => Number.isNaN(n))) return null

		const list = [...new Set(nums)].sort((a, b) => a - b)
		return { type: LIST, list }
	}

	return null
}

/**
 * Parse a full cron expression (all 5 fields)
 *
 * @param {string} expr
 */
export function parseCron(expr) {
	const parts = expr.trim().split(/\s+/)
	if (parts.length !== 5) return null

	return {
		minute: parseField(parts[0], 60),
		hour: parseField(parts[1], 24),
		day: parseField(parts[2], 32),
		month: parseField(parts[3], 13),
		dayOfWeek: parseField(parts[4], 7),
	}
}

/**
 * Describe parsed cron for display
 *
 * @param {ParsedField} parsed
 * @param {string} unit
 * @param {string} [plural]
 */
export function describeField(parsed, unit, plural) {
	if (!parsed) return ''

	if (parsed.type === 'every') {
		return `every ${unit}`
	}

	const pl = plural ?? `${unit}s`

	if (parsed.type === 'step') {
		return `every ${parsed.step} ${pl}`
	}

	if (parsed.type === 'list') {
		return `at ${parsed.list.length > 1 ? pl : unit} ${parsed.list.join(', ')}`
	}

	return ''
}

/**
 * Describe a full parsed cron expression
 *
 * @param {ParsedCron} parsed
 */
export function describeCron(parsed) {
	const parts = []

	const minDesc = describeField(parsed.minute, 'minute')
	const hourDesc = describeField(parsed.hour, 'hour')
	const dayDesc = describeField(parsed.day, 'day')
	const monthDesc = describeField(parsed.month, 'month')
	const dowDesc = describeField(parsed.dayOfWeek, 'day of week')

	if (minDesc) parts.push(minDesc)
	if (hourDesc && hourDesc !== 'every hour') parts.push(hourDesc)
	if (dayDesc && dayDesc !== 'every day') parts.push(dayDesc)
	if (monthDesc && monthDesc !== 'every month') parts.push(monthDesc)
	if (dowDesc && dowDesc !== 'every day of week') parts.push(dowDesc)

	return parts.length > 0 ? parts.join(', ') : 'every minute'
}

/**
 * Get the next fire time in seconds from now
 *
 * @param {ParsedCron} parsed
 */
export function nextSeconds(parsed) {
	const now = new Date()
	const startMs = now.getTime()

	let d = new Date(startMs)
	d.setSeconds(0, 0)
	d.setMinutes(d.getMinutes() + 1)

	for (let i = 0; i < 400000; i++) {
		if (
			matchField(parsed.minute, d.getMinutes()) &&
			matchField(parsed.hour, d.getHours()) &&
			matchField(parsed.day, d.getDate()) &&
			matchField(parsed.month, d.getMonth() + 1) &&
			matchField(parsed.dayOfWeek, d.getDay())
		) {
			return Math.max(0, Math.floor((d.getTime() - startMs) / 1000))
		}

		d.setMinutes(d.getMinutes() + 1)
	}

	return 3600
}

/**
 * Check if a value matches a parsed field
 *
 * @param {ParsedField} parsed
 * @param {number} value
 */
function matchField(parsed, value) {
	if (parsed.type === 'every') return true
	if (parsed.type === 'step') {
		return value % parsed.step === 0
	}
	if (parsed.type === 'list') {
		return parsed.list.includes(value)
	}
	return false
}
