import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wind from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		wind(),
	],
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
		},
	},
})
