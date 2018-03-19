require('./opponent-card.scss')

module.exports = require('vue').component('opponent-card', {
  props: {
    card: Object
  },
  template: require('./opponent-card.pug')()
})
