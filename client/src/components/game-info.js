require('./game-info.scss')

module.exports = require('vue').component('game-info', {
  props: {
    score: Number
  },
  template: require('./game-info.pug')()
})
