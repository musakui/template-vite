import { signal } from '@musakui/ui'
import { playAudio } from './audio.js'
import { nextSeconds } from './cron.js'

/** @typedef {ReturnType<typeof createAlarm>} Alarm */

/**
 * @param {import('./cron').ParsedField} parsed
 * @param {string} label
 */
export function createAlarm(parsed, label) {
	const ms = nextSeconds(parsed) * 1000

	const active = signal(true)
	const nextFire = signal(new Date(Date.now() + ms))

	const alarm = {
		id: Date.now(),
		label,
		parsed,
		active,
		nextFire,
		timerId: setTimeout(fire, ms),
	}

	function fire() {
		if (active.value) playAudio()

		const ns = nextSeconds(parsed) * 1000
		alarm.timerId = setTimeout(fire, ns)
		alarm.nextFire.value = new Date(Date.now() + ns)
	}

	return alarm
}
