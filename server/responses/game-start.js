const { getGame } = require('../state')

module.exports = (socket) => {
  const game = getGame(socket.gameId)
  if (game) {
    game.start()
    game.players.forEach((player) => {
      if (!player.robot) {
        console.log(`gonna whisper status to ${player.name}`)
        game.whisperStatus(player)
      }
    })
  }
}

module.exports.validator = {}
