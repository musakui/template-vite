import { html, signal } from '@musakui/ui'
import { Combobox } from '#/components/combobox.js'

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

const disabled = signal(false)

export default function () {
	return html`<div class="flex flex-col gap-4 p-4 pb-10">
		<h1 class="text-2xl">Form component showcase</h1>

		<label>
			<input type="checkbox" role="switch" @change=${toggleDisabled} />
			<span>Toggle disabled</span>
		</label>

		<form class="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2" @submit=${handleSubmit}>
			<fieldset class="card grid grid-cols-1 gap-6 md:grid-cols-2">
				<legend>Account Information</legend>
				<div class="field">
					<label for="username">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						class="inp"
						placeholder="@johndoe"
						?disabled=${disabled}
					/>
				</div>
				<div class="field">
					<label for="mail">Email Address</label>
					<input
						id="mail"
						name="email"
						type="email"
						class="inp"
						value="john@example.com"
						readonly
						?disabled=${disabled}
					/>
				</div>
				<div class="field md:col-span-2">
					<label for="fullname">Full Name</label>
					<input
						id="fullname"
						name="fullname"
						type="text"
						class="inp"
						value="John Doe"
						placeholder="Your Name"
						?disabled=${disabled}
					/>
				</div>
				<div class="field">
					<label for="counter">Counter</label>
					<input id="counter" name="counter" type="number" class="inp" ?disabled=${disabled} />
				</div>
				<div class="field">
					<label for="role">Role</label>
					<select id="role" name="role" class="inp" ?disabled=${disabled}>
						<option value="user">User</option>
						<option value="admin" disabled>Administrator</option>
						<option value="editor">Editor</option>
						<option value="viewer">Viewer</option>
					</select>
				</div>
			</fieldset>

			<fieldset class="card flex flex-col gap-4">
				<legend>Preferences</legend>
				<div class="flex flex-col gap-1">
					<label>Notifications</label>
					<label>
						<input type="checkbox" name="notifs" value="email" />
						<span>Email alerts</span>
					</label>
					<label>
						<input type="checkbox" name="notifs" value="push" ?disabled=${disabled} />
						<span>Push notifications</span>
					</label>
				</div>
				<div class="flex flex-col gap-1">
					<label>Account Plan</label>
					<label>
						<input type="radio" name="plan" value="free" />
						<span>Free Tier</span>
					</label>
					<label>
						<input type="radio" name="plan" value="pro" ?disabled=${disabled} />
						<span>Pro Plan</span>
					</label>
					<label>
						<input type="radio" name="plan" value="enterprise" />
						<span>Enterprise</span>
					</label>
				</div>

				<label>
					<input type="checkbox" name="doNotTrack" role="switch" ?disabled=${disabled} />
					<span>Do not track</span>
				</label>
			</fieldset>

			<div class="field">
				<label for="country">Country</label>
				${Combobox({
					id: 'country',
					name: 'cont',
					options: countries,
					placeholder: 'Search countries...',
				})}
			</div>

			<div class="field">
				<label for="prods">Products</label>
				${Combobox({
					id: 'prods',
					name: 'products',
					multiple: true,
					options: allProducts,
					placeholder: 'Search products...',
				})}
			</div>

			<div class="field">
				<label for="prds">Search Products</label>
				${Combobox({
					id: 'prds',
					name: 'searchProduct',
					placeholder: 'Search products...',
					async loadOptions(s, signal) {
						if (s.length < 2) return []
						await new Promise((r) => setTimeout(r, 600))
						if (signal.aborted) return []
						return allProducts.filter((u) => {
							return u.label.toLowerCase().includes(s.toLowerCase())
						})
					},
				})}
			</div>

			<div class="field">
				<label for="conts">Search Countries</label>
				${Combobox({
					id: 'conts',
					name: 'searchCountry',
					multiple: true,
					placeholder: 'Select countries...',
					async loadOptions(s, signal) {
						if (s.length < 2) return []
						await new Promise((r) => setTimeout(r, 400))
						if (signal.aborted) return []
						return countries.filter((c) => {
							return c.label.toLowerCase().includes(s.toLowerCase())
						})
					},
				})}
			</div>

			<div class="field">
				<label for="errr">Error State</label>
				<input id="errr" name="errorState" type="text" class="inp" pattern="[a-z]{3,16}" />
				<span class="helper">between 3 and 16 lowercase characters</span>
			</div>

			<div class="field">
				<label for="food">Food</label>
				<select id="food" name="food" class="inp" ?disabled=${disabled}>
					<optgroup label="Fruits">
						<option value="apple">Apple</option>
						<option value="banana">Banana</option>
					</optgroup>
					<optgroup label="Roots">
						<option value="carrot">Carrot</option>
						<option value="turnip">Turnip</option>
					</optgroup>
				</select>
			</div>

			<div class="field md:col-span-2">
				<label for="bio">Bio</label>
				<textarea
					id="bio"
					name="bio"
					class="inp h-32 resize-y"
					placeholder="About yourself..."
					?disabled=${disabled}
				></textarea>
			</div>

			<div class="md:col-span-2 flex justify-end">
				<button type="submit" class="btn t-primary">Submit</button>
			</div>
		</form>
	</div>`
}

/**
 * @this {HTMLFormElement}
 * @param {Event} evt
 */
function handleSubmit(evt) {
	evt.preventDefault()
	const formData = new FormData(this)
	console.log('Form submitted:', formData)
}

/** @this {HTMLInputElement} */
function toggleDisabled() {
	disabled.value = this.checked
}
