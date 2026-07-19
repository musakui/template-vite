import { html } from '@musakui/ui'
import { addToast } from '#/components/toast.js'

/** @param {string} txt */
function Header(txt) {
	return html`<h2 class="text-xs font-semibold tracking-widest uppercase">${txt}</h2>`
}

export default function () {
	return html`<div class="flex flex-col gap-4 p-4 pb-10">
		<h1 class="text-2xl">Component showcase</h1>
		<section class="flex flex-col gap-3">
			${Header('Button')}
			<div class="flex flex-wrap gap-3 text-sm font-medium">
				<button class="btn t-primary">Primary</button>
				<button class="btn t-secondary">Secondary</button>
				<button class="btn t-danger">Danger</button>
				<button class="btn border">Outline</button>
				<button class="btn">Ghost</button>
				<button disabled class="btn t-primary">Disabled</button>
				<div class="btn-grp t-secondary flex border">
					<button>Grouped</button>
					<button>Foo</button>
					<button>Bar</button>
				</div>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Badge')}
			<div class="flex flex-wrap gap-3 text-xs">
				<span class="badge t-primary">Default</span>
				<span class="badge t-secondary">Secondary</span>
				<span class="badge t-danger">Danger</span>
				<span class="badge border">Outline</span>
				<button class="badge t-secondary">Button</button>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Avatar')}
			<div class="flex gap-3">
				<span class="avatar size-10" data-txt="M">
					<img src="https://avatars.githubusercontent.com/u/56913878" loading="lazy" />
				</span>
				<span class="avatar t-primary size-10" data-txt="AB"></span>
				<span class="avatar size-10 border" data-txt="CD"></span>
				<div class="t-secondary inline-flex *:-mx-2 *:size-10 *:border">
					<span class="avatar" data-txt="EF"></span>
					<span class="avatar" data-txt="GH"></span>
					<span class="avatar" data-txt="IJ"></span>
					<span class="avatar" data-txt="KL"></span>
				</div>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Skeleton')}
			<div class="flex flex-col gap-3">
				<div class="bg-muted h-4 w-48 animate-pulse rounded-md"></div>
				<div class="bg-muted h-4 w-32 animate-pulse rounded-md"></div>
				<div class="bg-muted h-10 w-48 animate-pulse rounded-lg"></div>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Spinner')}
			<div class="flex items-center gap-4">
				<div class="spinner size-4 border"></div>
				<div class="spinner size-6 border-2"></div>
				<button class="btn t-secondary flex items-center gap-2" disabled>
					<div class="spinner size-3 border"></div>
					Loading...
				</button>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Alert')}
			<div class="card t-secondary w-64 text-sm">Info message here.</div>
			<div class="card t-danger flex w-64 gap-2 text-sm">
				<span>⚠️</span>
				Something went wrong.
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Card')}
			<div class="flex flex-wrap gap-3">
				<div class="card w-64 p-5 shadow-sm">
					<p class="pb-2 text-lg leading-none font-semibold tracking-tight">Card Title</p>
					<p class="text-muted-foreground text-sm">
						A simple card with title and description. Write any structure inside.
					</p>
				</div>
				<div class="card w-64 p-5 shadow-sm">
					<p class="text-sm">A card with no title</p>
				</div>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Accordion')}
			<div class="accordion w-64 divide-y text-sm">
				<details>
					<summary>What is this?</summary>
					<div class="text-muted-foreground">
						A native details/summary element styled as an accordion. No JS required.
					</div>
				</details>
				<details>
					<summary>How do I use it?</summary>
					<div class="text-muted-foreground">Apply .accordion to details.</div>
				</details>
				<details>
					<summary>Is it ok?</summary>
					<div class="text-muted-foreground">Can la</div>
				</details>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Progress')}
			<div class="flex flex-col items-start gap-3 text-sm">
				<progress class="h-2 w-64" max="100" value="40"></progress>
				<progress class="h-2 w-64" max="100" value="75"></progress>
				<progress class="h-2 w-64" max="100"></progress>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Table')}
			<table class="table w-full text-sm">
				<thead>
					<tr>
						<th>Name</th>
						<th>Role</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Alice</td>
						<td>Admin</td>
						<td>Active</td>
					</tr>
					<tr>
						<td>Bob</td>
						<td>User</td>
						<td>Active</td>
					</tr>
					<tr>
						<td>Carol</td>
						<td>User</td>
						<td>Inactive</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Popover')}
			<div class="flex flex-wrap gap-3">
				<button id="pop-butt-1" class="btn border" popovertarget="demo-pop-1">
					toggle popover (down)
				</button>
				<button id="pop-butt-2" class="btn border" popovertarget="demo-pop-2">
					toggle popover (right)
				</button>
				<div
					id="demo-pop-1"
					popover
					anchor="pop-butt-1"
					class="card translate-y-2 text-sm shadow-sm transition-all [position-area:bottom]"
				>
					<p class="mb-1 font-medium">Popover content</p>
					<p class="text-muted-foreground">Fully declarative. No JS needed.</p>
				</div>
				<div
					id="demo-pop-2"
					popover
					anchor="pop-butt-2"
					class="card translate-x-2 text-sm shadow-sm transition-all [position-area:center_end]"
				>
					Popover
				</div>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Toast')}
			<div class="flex flex-wrap gap-3 text-sm">
				<button class="btn border" @click=${() => addToast('Default toast')}>
					Default
				</button>
				<button
					class="btn border"
					@click=${() => addToast('Persistent (manually close me)', { duration: 0 })}
				>
					Persistent
				</button>
				<button
					class="btn bg-green-800"
					@click=${() => addToast('Completed successfully', { type: 'success' })}
				>
					Success
				</button>
				<button
					class="btn bg-amber-800"
					@click=${() => addToast('Warning: maybe not good', { type: 'warning' })}
				>
					Warning
				</button>
				<button
					class="btn bg-red-700"
					@click=${() => addToast('Something bad happened', { type: 'error' })}
				>
					Error
				</button>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Tooltip')}
			<div class="flex gap-3 text-sm">
				<div class="rounded-sm border px-3 py-1" @mouseenter=${hoverOpenPopover}>
					tooltip 1 (hover)
					<div
						popover="hint"
						class="card t-primary -translate-y-1 px-2 py-1 [position-area:top]"
					>
						Tooltip text 1
					</div>
				</div>
				<button class="btn border" @mouseenter=${hoverOpenPopover}>
					tooltip 2 (hover)
					<div
						popover="hint"
						class="card t-primary -translate-y-1 px-2 py-1 [position-area:top]"
					>
						Tooltip text 2
					</div>
				</button>
				<button id="tip-trigger-3" class="btn border" popovertarget="demo-tip-3">
					tooltip 3 (click)
					<div
						id="demo-tip-3"
						popover="hint"
						anchor="tip-trigger-3"
						class="card t-primary -translate-y-1 px-2 py-1 [position-area:top]"
					>
						Tooltip text 3
					</div>
				</button>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			${Header('Dialog / Sheet')}
			<div class="flex flex-wrap items-start gap-3">
				<button commandfor="demo-diag" command="show-modal" class="btn border">
					Open dialog
				</button>

				<button popovertarget="info-sheet" class="btn border">Open sheet</button>

				<dialog id="demo-diag" class="card t-secondary w-sm p-6">
					hello world
					<button
						command="close"
						commandfor="demo-diag"
						class="btn absolute top-2 right-2"
					>
						&times;
					</button>
				</dialog>

				<aside
					id="info-sheet"
					popover
					class="sheet max-h-[80dvh] w-full max-w-[90vw] md:h-dvh md:max-h-none md:w-100"
				>
					<div
						class="bg-background flex h-full flex-col rounded-md border max-sm:max-h-[80vh]"
					>
						<div class="shrink-0 p-2 font-medium">About this app</div>
						<div class="flex-1 overflow-y-auto">
							<div class="grid gap-3 p-3 text-sm">
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
									tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
									veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
									commodo consequat.
								</p>
								<p>
									Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
									dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
									proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
								</p>
								<hr />
								<p class="text-muted-foreground">
									This is a centered popover on mobile and a side sheet on desktop. Resize
									the window to see the layout switch between the two modes.
								</p>
							</div>
						</div>
						<div class="flex justify-end p-2">
							<button
								popovertarget="info-sheet"
								popovertargetaction="hide"
								class="btn t-secondary w-15"
							>
								Ok
							</button>
						</div>
					</div>
				</aside>
			</div>
		</section>
	</div>`
}

/** @this {HTMLElement} */
function hoverOpenPopover() {
	const el = /** @type {HTMLElement | null} */ (this.querySelector('[popover]'))
	el?.showPopover({ source: this })
}
