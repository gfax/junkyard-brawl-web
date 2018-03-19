const { getGame } = require('../state')

module.exports = (socket) => {
  const game = getGame(socket.gameId)
  if (game) {
    game.addBot('Dark')
  }
}
