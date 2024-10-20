import { defineConfig, presetUno } from 'unocss'
import { presetShadcn } from 'unocss-preset-shadcn'
import presetAnimations from 'unocss-preset-animations'

export default defineConfig({
	presets: [
		presetUno(),
		presetAnimations(),
		presetShadcn({
			color: 'slate',
		}),
	],
	content: {
		pipeline: {
			include: [/\.(vue|html)($|\?)/, 'src/**/*.{js,ts}'],
		},
	},
})
