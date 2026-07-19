import { html } from '@musakui/ui'
import { outlet } from './router.js'
import * as Nav from '#/components/nav.js'
import ToastContainer from '#/components/toast.js'

export default function () {
	return html`<div class="flex h-dvh w-full overflow-hidden overscroll-none">
		<div class="flex h-full flex-1 flex-col overflow-hidden">
			${Nav.Header()}
			<div class="relative flex h-full overflow-hidden">
				${Nav.Sidebar()}
				<main class="h-full flex-1 overflow-auto">${outlet}</main>
			</div>
		</div>
		${ToastContainer()}
	</div>`
}
