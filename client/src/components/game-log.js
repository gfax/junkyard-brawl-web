require('./game-log.scss')

module.exports = require('vue').component('game-log', {
  props: {
    log: Array
  },
  template: require('./game-log.pug')()
})
