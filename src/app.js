import { html, computed } from '@musakui/ui'
import { $str, update } from '#/utils/signal.js'
import { createAlarm } from '#/utils/alarm.js'
import { parseCron, describeCron } from '#/utils/cron.js'
import { alarms, errMsg, cronInput, labelInput } from './state.js'
import Alarms from '#/components/alarms.js'

export default function () {
	return html`<main class="flex min-h-screen flex-col items-center justify-start p-4">
		<div class="grid w-full max-w-md gap-4">
			<div>
				<h1 class="text-2xl font-semibold tracking-tight">Cron Alarm</h1>
				<p class="text-muted-foreground mt-1 text-sm">
					Schedule recurring alarms with cron expressions
				</p>
			</div>

			<div class="grid gap-3 rounded-xl border p-4">
				<div class="grid gap-2">
					<label class="text-sm font-medium" for="cron-expr">Cron expression</label>
					<input
						id="cron-expr"
						type="text"
						placeholder="0 9 * * 1-5"
						class="bg-background h-9 w-full rounded-md border px-3 py-2 font-mono text-sm"
						${$str(cronInput)}
					/>
					<p class="text-muted-foreground text-xs">
						${computed(() => {
							const v = cronInput.value.trim()
							if (!v) {
								return html`<span>Format: minute hour day month dow</span>`
							}
							const parsed = parseCron(v)
							return parsed ? describeCron(parsed) : 'Invalid expression'
						})}
					</p>
				</div>

				<div class="grid gap-1.5">
					<label class="text-sm font-medium" for="alarm-label">Label</label>
					<input
						id="alarm-label"
						type="text"
						placeholder="My alarm"
						class="bg-background h-9 w-full rounded-md border px-3 py-2 text-sm"
						${$str(labelInput)}
					/>
				</div>

				${computed(() => {
					return errMsg.value
						? html`<p class="text-xs text-red-500">${errMsg.value}</p>`
						: null
				})}

				<button
					class="bg-primary text-primary-foreground h-9 rounded-md text-sm font-medium"
					?disabled=${computed(() => !cronInput.value.trim())}
					@click=${addAlarm}
				>
					Add alarm
				</button>
			</div>

			${Alarms()}
		</div>
	</main>`
}

function addAlarm() {
	const expr = cronInput.value.trim()
	const label = labelInput.value.trim() || expr
	if (!expr) return

	const parsed = parseCron(expr)
	if (!parsed) {
		errMsg.value = 'Invalid cron expression'
		return
	}

	errMsg.value = ''
	cronInput.value = ''
	labelInput.value = ''

	update(alarms, (ls) => [...ls, createAlarm(parsed, label)])
}
