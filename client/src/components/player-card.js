require('./player-card.scss')

module.exports = require('vue').component('player-card', {
  props: {
    disabled: Boolean,
    card: Object
  },
  template: require('./player-card.pug')()
})
