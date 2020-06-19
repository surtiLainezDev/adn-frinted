module.exports = {
	mode: 'spa',
	head: {
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		],
		title: 'adn',
		}, // Headers of the page
	loading: { color: '#23F702' , height: 5},
	router:{
		middleware:[
			'reload'
		]
	},
	build: {
		extend (config, { isDev, isClient }) {
			if (isDev && isClient) {
				// Run ESLint on save
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					exclude: /(node_modules)/
				})
			}
			// Extend only webpack config for client-bundle
			if (isClient) { config.target = 'electron-renderer' }
		}
	},
	dev: process.env.NODE_ENV === 'DEV',
	css: [
		'bootstrap/dist/css/bootstrap.css'
	],
	plugins:[
		'@/plugins/vuesax',
		'@/plugins/bootstrap',
		'@/plugins/vuevalidate',
		'@/plugins/axios',
		'@/plugins/mask'
	],
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
	],
	axios: {
		// baseURL: "http://142.93.53.248/api"
		baseURL: "http://127.0.0.1:8000/api"
	},
}
