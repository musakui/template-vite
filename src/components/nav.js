import { html, computed } from '@musakui/ui'

import { search } from '#/state.js'
import { match } from '#/router.js'
import { toggle, $str } from '#/utils/signal.js'
import { useStorageBool } from '#/utils/storage.js'
import { theme, toggleTheme } from '#/utils/theme.js'

const links = [
	{ name: 'Home', to: '/' },
	{ name: 'Basic', to: '/basic' },
	{ name: 'Forms', to: '/forms' },
]

const isOpen = useStorageBool('nav-open')

const themeIcons = { light: '🔆', dark: '🌙' }

export function Header() {
	return html`<nav class="sticky top-0 flex items-center gap-2 border-b p-2">
		<button class="md:hidden" title="toggle left sidebar" @click=${toggle(isOpen)}>
			☰
		</button>
		<div><a href="/">Vite Template</a></div>
		<div class="flex-1">
			<input
				type="search"
				class="bg-input w-full max-w-sm rounded-md px-2 py-1"
				${$str(search)}
			/>
		</div>
	</nav>`
}

export function Sidebar() {
	return html`<nav
		aria-expanded=${isOpen}
		class="bg-background absolute z-999 hidden h-full flex-col overflow-hidden border-r aria-expanded:flex md:relative md:flex"
	>
		<div class="flex min-w-30 flex-col overflow-auto p-1">
			${links.map((link) => {
				const current = computed(() => {
					return match.value?.name === link.name ? 'page' : null
				})
				return html`<a
					class="hover:bg-accent/50 aria-[current=page]:bg-accent/30 rounded-sm px-2 py-1"
					aria-current=${current}
					href=${link.to}
				>
					${link.name}
				</a>`
			})}
		</div>
		<button class="fixed bottom-2 left-2" title="theme toggle" @click=${toggleTheme}>
			${computed(() => themeIcons[theme.value] ?? '🖥️')}
		</button>
	</nav>`
}
