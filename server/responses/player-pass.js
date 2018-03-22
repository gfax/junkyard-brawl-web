const { getGame } = require('../state')

module.exports = (socket, payload) => {
  const game = getGame(socket.gameId)
  if (game) {
    game.pass(socket.id)
  }
}
