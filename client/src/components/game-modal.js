require('./game-modal.scss')

module.exports = require('vue').component('game-modal', {
  props: {
    score: Number
  },
  template: require('./game-modal.pug')()
})
