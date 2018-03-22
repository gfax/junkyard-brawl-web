const { getGame } = require('../state')

module.exports = (socket, payload) => {
  const game = getGame(socket.gameId)
  if (game) {
    const player = game.getPlayer(socket.id)
    game.play(socket.id, payload.map((card) => {
      return player.hand.find(_card => _card.uid === card.uid)
    }).filter(card => card))
  }
}

module.exports.validator = (payload) => {
  if (!Array.isArray(payload)) return false
  payload.forEach((card) => {
    if (typeof card.id !== 'string') {
      return false
    }
    if (typeof card.uid !== 'string') {
      return false
    }
  })
  return true
}

module.exports.validatorMessage = 'Expected array of card objects.'
