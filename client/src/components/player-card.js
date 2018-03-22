require('./player-card.scss')

module.exports = require('vue').component('player-card', {
  methods: {
    toggleSelect
  },
  props: {
    disabled: Boolean,
    card: Object
  },
  template: require('./player-card.pug')()
})

function toggleSelect(card) {
  if (!card.disabled) {
    card.selected = !card.selected
    console.log(this.card.selected)
  }
}
