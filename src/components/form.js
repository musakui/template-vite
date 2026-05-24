import { html, signal } from '@musakui/ui'
import { Combobox } from './combobox.js'
import './forms.css'

const disabled = signal(false)

const countries = [
	{ value: 'us', label: 'United States' },
	{ value: 'ca', label: 'Canada' },
	{ value: 'mx', label: 'Mexico' },
	{ value: 'uk', label: 'United Kingdom' },
	{ value: 'fr', label: 'France' },
	{ value: 'de', label: 'Germany' },
	{ value: 'it', label: 'Italy' },
	{ value: 'es', label: 'Spain' },
	{ value: 'jp', label: 'Japan' },
	{ value: 'cn', label: 'China' },
	{ value: 'in', label: 'India' },
	{ value: 'au', label: 'Australia' },
	{ value: 'br', label: 'Brazil' },
	{ value: 'za', label: 'South Africa' },
]

const allProducts = [
	{ value: 'laptop-dell', label: 'Dell XPS Laptop' },
	{ value: 'laptop-mac', label: 'MacBook Pro' },
	{ value: 'phone-samsung', label: 'Samsung Galaxy S24' },
	{ value: 'tablet-ipad', label: 'iPad Air' },
	{ value: 'watch-apple', label: 'Apple Watch' },
	{ value: 'watch-samsung', label: 'Samsung Galaxy Watch' },
	{ value: 'headphones-sony', label: 'Sony WH-1000XM5' },
	{ value: 'headphones-bose', label: 'Bose QuietComfort' },
	{ value: 'monitor-lg', label: 'LG UltraWide Monitor' },
]

export default function () {
	return html`<form class="grid gap-2 p-4">
		<fieldset class="flex flex-col gap-1 text-sm">
			<label for="cb1">country</label>
			${Combobox({
				options: countries,
				placeholder: 'Search countries...',
			})}
		</fieldset>
		<fieldset class="flex flex-col gap-1 text-sm">
			<label for="cb2">products</label>
			${Combobox({
				multiple: true,
				options: allProducts,
				placeholder: 'Search products...',
			})}
		</fieldset>
		<div class="flex gap-2 items-center">
			<input
				id="disable-switch"
				type="checkbox"
				role="switch"
				@change=${toggleDisabled}
			/>
			<label for="disable-switch">Toggle disabled</label>
		</div>
		<fieldset class="flex flex-col gap-1 text-sm">
			<label for="f1">text input</label>
			<input id="f1" type="text" ?disabled=${disabled} class="input p-2" />
		</fieldset>
		<fieldset class="flex flex-col gap-1 text-sm">
			<label for="f2">textarea</label>
			<textarea id="f2" rows="3" ?disabled=${disabled} class="input p-2"></textarea>
		</fieldset>
		<fieldset class="flex flex-col gap-1 text-sm">
			<label for="f3">select</label>
			<select id="f3" ?disabled=${disabled} class="input p-2">
				<option>Apple</option>
				<option>Banana</option>
				<option>Cabbage</option>
			</select>
		</fieldset>
		<fieldset class="flex flex-col gap-2 text-sm">
			<legend class="font-medium text-muted-foreground pb-1">Checkbox / Radio</legend>
			<div class="flex items-center gap-2">
				<input id="c1" type="checkbox" />
				<label for="c1">checkbox 1</label>
			</div>
			<div class="flex items-center gap-2">
				<input id="c2" type="checkbox" ?disabled=${disabled} />
				<label for="c2">another checkbox</label>
			</div>
			<div class="flex items-center gap-2">
				<input id="r1" type="radio" name="rr" />
				<label for="r1">radio 1</label>
			</div>
			<div class="flex items-center gap-2">
				<input id="r2" type="radio" name="rr" />
				<label for="r2">radio 2</label>
			</div>
			<div class="flex items-center gap-2">
				<input id="r3" type="radio" name="rr" ?disabled=${disabled} />
				<label for="r3">radio 3</label>
			</div>
			<div class="flex items-center gap-2">
				<input id="s1" type="checkbox" role="switch" ?disabled=${disabled} />
				<label for="s1">switch</label>
			</div>
		</fieldset>
	</form>`
}

/** @this {HTMLInputElement} */
function toggleDisabled() {
	disabled.value = this.checked
}
