import './styles.css'
import App from './app.js'

export function init() {
	const app = App()
	app.init()
	document.body.replaceChildren(app)
}

init()

if (import.meta.hot) {
	import.meta.hot.accept((m) => m?.init())
}
