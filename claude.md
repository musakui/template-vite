# Context for coding agents

## Notes on `@musakui/ui`

`@musakui/ui` is a library for writing reactive HTML pages using JS template tags.

### Template binding prefixes

Templates support special binding prefixes for different kinds of attributes:

```js
// Standard attribute binding (value will be stringified)
html`<div title=${description} id=${elId}>Content</div>`

// Boolean attributes with ?
html`<button ?disabled=${disabled}>Click</button>`

// Property binding with . (sets the DOM property, not the attribute)
html`<input .value=${userText} />`
```

Other than attributes/properties, event listeners and raw bindings are also available.

They will be cleaned-up when the element is unmounted.

```js
// Event handler function binding with @
html`<input @blur=${handleBlur} />`

// Event listener options can be passed via an array, or an object with a `handleEvent` method
html`<button @click=${[handleClick, { passive: true }]}>Click me</button>`

// Bind function called with the element on init (useful for custom setup)
html`<div ${customFunction} />`
```

Note: `this` within event handlers have the same behaviour as [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_value_of_this_within_the_handler) — `this` is the element, not the component. Use arrow functions or closures to capture component state instead of relying on `this`.

### NO partial interpolation of attributes

Template tag interpolations are treated as a unit by the parser, so attribute interpolations must be standalone.

```js
// WRONG - does not work properly
html`<div title="${foo} bar" class="...">...</div>`

// CORRECT - passed value occupies the whole attribute
html`<div title=${`${foo} bar`} class="...">...</div>`

// CORRECT - function will be called with the element when initialized
html`<div ${bindFunction} class="...">...</div>`

// CORRECT - partial content binding works as expected
html`<div>Hello, ${name}!</div>`
```

DO NOT USE DYNAMIC `class="..."` AS IT WILL NOT WORK

### DO wrap dynamic expressions in `computed`

Expressions are evaluated once at template creation time. Also applies to conditional/nested components

```js
// WRONG
html`<div>${isLoggedIn.value ? 'Welcome' : 'Login'}</div>`

// CORRECT
html`<div>${computed(() => (isLoggedIn.value ? 'Welcome' : 'Login'))}</div>`

// WRONG
html`<div>${show.value ? html`<span>visible</span>` : null}</div>`

// CORRECT
html`<div>${computed(() => (show.value ? html`<span>visible</span>` : null))}</div>`
```

### Rendering arrays and conditionals

Arrays of fragments are automatically handled in templates.

```js
html`<div class="flex flex-col">
	${computed(() => {
		return items.value.length
			? items.value.map(ItemComponent)
			: html`<div class="text-muted-foreground">no items</div>`
	})}
</div>`
```

### DO pass signals directly into templates

Signal changes will directly update the relevant DOM nodes instead of re-rendering

```js
// CORRECT - updates when signal value changes
html`<div title=${title} class="...">Hello, ${name}</div>`

// WRONG - not reactive (unless wrapped in computed, but inefficient)
html`<div title=${title.value} class="...">Hello, ${name.value}</div>`
```

### DO NOT update `.innerHTML`

The library does not block it but use the template tags to get real elements instead.

### DO NOT `.init()` manually (except where necessary)

When passing a fragment as content inside another `html` template, `.init()` is called automatically

```js
// BAD - redundant .init() inside template
html`<div>${html`<span>hello</span>`.init()}</div>`

// CORRECT - inner fragment is initialized automatically
html`<div>${html`<span>hello</span>`}</div>`

// CORRECT - .init() needed when adding to the DOM directly
document.body.append(html`<div>hello</div>`.init())
```

Note: calling `.init()` on the same `TemplateFragment` instance more than once has no effect.
Use `cloneNode()` to create independent copies.

```js
const frag = html`<div>hello</div>`

const el1 = frag.init() // works
const el2 = frag.init() // no-op, returns the same instance (`el1 === el2`)

const clone = frag.cloneNode()
const el3 = clone.init() // works - independent copy
```

---

## Best practices

Refer to the template todo app on the overall style guide

### Use baseline available native HTML/CSS features where possible

Prefer native HTML features like `popover` and `<dialog>` instead of custom state.

Also use new baseline available Javascript functions (e.g. `Uint8Array.prototype.toBase64()`) instead of old implementations (e.g. `btoa`)

### Use the latest Tailwind utilities (currently v4)

Do not use legacy utilities like `space-*`, use theme CSS variables where possible.

### Use ARIA/`data-*` attributes to store state for styling

Instead of dynamic classes, use attributes and Tailwind variants to modify element styles.

```js
html`<div
	aria-hidden=${hidden}
	data-status=${status}
	class="aria-hidden:hidden data-[status='ok']:bg-green-500 ..."
>
	...
</div>`
```

DO NOT USE DYNAMIC `class="..."` AS IT WILL NOT WORK

### Use unicode characters or emoji instead of SVG for icons

Close buttons can be `&times;`, pagination arrows can be `⏪⬅️➡️⏩`. Use your imagination

### Theming

Extend the color system in `styles.css` under `@theme`:

```css
@theme {
	--color-accent: light-dark(oklch(0.6 0.15 220), oklch(0.7 0.15 220));
}
```

### Components are plain functions

Components are just functions that return `html` template fragments. No classes, no special wrappers.

```js
// src/components/card.js
import { html } from '@musakui/ui'

export default function Card(props) {
	return html`<div class="rounded border p-4">
		<h2>${props.title}</h2>
		<p>${props.content}</p>
	</div>`
}
```

### Nested signals

When a list item needs its own reactive properties, give it a signal field:

```js
function createItem(name) {
	return {
		id: Date.now(),
		name,
		done: signal(false), // reactive per-item field
	}
}

// Toggle:
update(item.done, (v) => !v)
```

### Import aliases

The project maps `#/` to `src/` via the `imports` field in `package.json`:

```js
import Counter from '#/components/counter.js'
import { update } from '#/utils/signal.js'
```

Always prefer the `#/` alias over relative `../` chains

### Use JSDoc type annotations

Use JSDoc with TypeScript `.d.ts` files. No need to rename `.js` to `.ts`.

Define types in `types.d.ts` (or any name that does not match a `.js` file so the types do not get shadowed):

```ts
import type { Signal } from '@musakui/ui'

export type Item = {
	id: number
	name: string
	done: Signal<boolean>
}
```

Import and use in `.js` files with `@import`:

```js
/** @import { Item } from './types' */

/** @param {Item} item */
function renderItem(item) {
	return html`<div>${item.name}</div>`
}
```

### Project-local utilities vs library exports

`@musakui/ui` only exports `html`, `signal`, `computed`, `mount`, `isSignal`, and `toValue`. The following helpers are **project-local** utilities in `#/utils/signal.js` — do NOT import them from `@musakui/ui`:

- `cached` — memoize templates by object identity
- `$str` — two-way bind a signal to an input
- `update` — mutate a signal value with a function
- `toggle` — return a click handler that flips a boolean signal

`effect` comes from the underlying `alien-signals` package, not from `@musakui/ui`:

```js
import { effect } from 'alien-signals'
```

### Signal reactivity only triggers on `.value` reassignment

`signal` is not a Proxy. Mutating an array or object stored inside a signal will NOT trigger updates:

```js
// WRONG - mutation is silent, UI will not update
items.value.push(newItem)
items.value.name = 'new'

// CORRECT - reassign .value to trigger reactivity
items.value = [...items.value, newItem]
update(items, (arr) => [...arr, newItem])
```

### `mount()` takes a factory function, not a fragment

`mount(fn, target)` calls `fn()` internally to create the fragment. Do not pass a fragment directly:

```js
// WRONG - crashes, mount expects a function
mount(html`<div>...</div>`, document.body)

// CORRECT
mount(() => html`<div>...</div>`, document.body)
```

Use `mount()` for the top-level app entry point.

### Bind functions must return their cleanup

When writing a custom bind function (raw binding), return the cleanup function. The framework calls it automatically before the binding is re-evaluated or the component is replaced:

```js
// WRONG - event listener leaks
return (el) => {
	el.addEventListener('input', handler)
	effect(() => { el.value = sig.value })
}

// CORRECT - cleanup returned so the framework can call it
return (el) => {
	el.addEventListener('input', handler)
	const stop = effect(() => { el.value = sig.value })
	return () => {
		el.removeEventListener('input', handler)
		stop()
	}
}
```

### Use `cached` to memoize templates by object identity

Use `cached()` to avoid re-creating templates for the same object. Critical for list rendering.
Without it, every re-render creates new DOM nodes and loses component state.

```js
import { cached } from '#/utils/signal.js'

function itemTemplate(item) {
	return html`<div>...</div>`
}

export const ItemComponent = cached(itemTemplate)

// In a list:
html`<div>${computed(() => items.value.map(ItemComponent))}</div>`
```

### Use `$str(sig)` to two-way bind a signal to a HTML input

It also works for `<textarea>` and `<select>`

```js
import { $str } from '#/utils/signal.js'
const text = signal('')
html`<input type="text" ${$str(text)} />`
```

The binding updates the signal on `input` events and syncs signal changes back to the element.
For custom input types, create your own binding function using `effect`:

```js
import { effect } from 'alien-signals'

/** @param {Signal<number>} sig */
function $num(sig) {
	/** @param {HTMLInputElement} el */
	return (el) => {
		const handler = () => {
			sig.value = Number(el.value)
		}
		el.addEventListener('input', handler)
		const stop = effect(() => {
			el.value = sig.value
		})
		return () => {
			el.removeEventListener('input', handler)
			stop()
		}
	}
}
```

---

## Agent Guidelines

### Review Style

- Be critical and direct.
- Focus on technical facts, rule violations, and edge cases.
- Avoid praise, "cheerleading," or filler phrases (e.g., "This looks great," "Excellent work").
- Use a "Critique-First" format:
  1. Direct issues/bugs.
  2. Technical observations.
  3. Suggestions for improvement.

### DO NOT Over-Engineer Type Safety

- Do not suggest adding `.d.ts` files or JSDoc type hints for simple components or local signals.
- If the code is functionally correct and readable, do not suggest "better" type coverage.

### "Best Practice" architectural refactors

- Do not suggest moving module-level signals into "Store" objects or "State" props for the sake of "reusability" if the current singleton pattern is sufficient for the app's scale.
- Do not suggest converting simple components to a more complex prop-based architecture unless a specific bug is caused by the current structure.
