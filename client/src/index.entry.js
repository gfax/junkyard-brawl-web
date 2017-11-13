const vue = require('vue')
const vueRouter = require('vue-router')

// Set app version as a global
window.appVersion = APP_VERSION

// Load styling
//require('uikit/dist/css/uikit.css')
//require('uikit/dist/js/uikit')
require('./stylesheets/main.scss')

// Load components
requireAll(require.context('.', true, /components(\\|\/)(?!.*spec\.js$).*\.js$/))

// Require all files for a given folder
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext)
}

// Configure Vue router
const routerConfig = new vueRouter({
  base: __dirname,
  mode: 'hash',
  routes: [
    {
      name: 'Create a game',
      path: '/',
      component: require('./components/home')
    },
    {
      name: 'Game in progress...',
      path: '/games/:gameId',
      component: require('./components/game')
    }
  ]
})
routerConfig.afterEach((toRoute, fromRoute) => {
  window.document.title = `Junkyard Brawl: ${toRoute.name}`
})

// Initialize Vue app
vue.config.productionTip = false
vue.use(vueRouter)
window.addEventListener('load', () => {
  new vue({
    el: '#app',
    router: routerConfig
  })
})
