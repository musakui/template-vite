import { html, computed } from '@musakui/ui'
import { update, cached } from '#/utils/signal.js'
import { describeCron } from '#/utils/cron.js'
import { alarms } from '#/state.js'

const AlarmItem = cached(alarmItem)

export default function () {
	return html`<div class="grid gap-2">
		${computed(() => {
			return alarms.value.length
				? alarms.value.map(AlarmItem)
				: html`<div class="text-muted-foreground rounded-xl border p-6 text-center">
						No alarms set
					</div>`
		})}
	</div>`
}

/** @param {import('#/utils/alarm.js').Alarm} alarm */
function alarmItem(alarm) {
	function remove() {
		clearTimeout(alarm.timerId)
		update(alarms, (ls) => ls.filter((a) => a !== alarm))
	}

	return html`<div class="flex items-start rounded-lg border p-2">
		<div class="flex min-w-0 grow flex-col gap-1">
			<div class="truncate font-medium">${alarm.label}</div>
			<div class="text-muted-foreground text-xs">${describeCron(alarm.parsed)}</div>
			<div class="text-xs">
				next: ${computed(() => alarm.nextFire.value.toLocaleTimeString())}
			</div>
		</div>
		<div class="flex shrink-0 items-center gap-2">
			<button
				aria-label="toggle"
				data-active=${alarm.active}
				class="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:text-muted-foreground rounded border px-2 py-1 text-xs"
				@click=${() => update(alarm.active, (v) => !v)}
			>
				${computed(() => (alarm.active.value ? 'ON' : 'OFF'))}
			</button>
			<button
				aria-label="remove"
				class="text-muted-foreground hover:text-foreground"
				@click=${() => remove()}
			>
				&times;
			</button>
		</div>
	</div>`
}
