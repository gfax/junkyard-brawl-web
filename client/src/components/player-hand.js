module.exports = require('vue').component('player-hand', {
  props: {
    hand: Array
  },
  template: require('./player-hand.pug')()
})
