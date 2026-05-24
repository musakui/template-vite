import { signal } from '@musakui/ui'

export const errMsg = signal('')
export const cronInput = signal('')
export const labelInput = signal('')

export const alarms = signal(/** @type {import('./utils/alarm').Alarm>[]} */ ([]))
