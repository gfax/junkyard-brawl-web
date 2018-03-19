module.exports = require('vue').component('home', {
  methods: {
    randomGameName
  },
  template: require('./home.pug')()
})

// Guaranteed random
function randomGameName() {
  return '511fax'
}
