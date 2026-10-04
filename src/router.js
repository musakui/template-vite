import { html, signal } from '@musakui/ui'
import { createRouter } from '@musakui/ui/router'

/** @import { RouteMatch } from '@musakui/ui/router' */

export const match = signal(/** @type {RouteMatch | null} */ (null))
export const outlet = signal(loadingPage())

const dispose = createRouter({
	routes: [
		{
			path: '/',
			name: 'Home',
			page: () => import('./pages/home.js'),
		},
		{
			path: '/basic',
			name: 'Basic',
			page: () => import('./pages/basic.js'),
		},
		{
			path: '/forms',
			name: 'Forms',
			page: () => import('./pages/forms.js'),
		},
	],
	onBeforeNav(_, m) {
		match.value = m
	},
	render(r) {
		if (r === undefined) {
			outlet.value = loadingPage()
		} else if (r === null) {
			outlet.value = html`<div class="p-4">Page not found</div>`
		} else if (r instanceof Error) {
			outlet.value = html`<div class="p-4">Error: ${r}</div>`
		} else {
			// @ts-ignore
			outlet.value = r
		}
	},
})

function loadingPage() {
	return html`<div class="p-4">loading...</div>`
}

if (import.meta.hot) {
	import.meta.hot.dispose(() => dispose())
}
