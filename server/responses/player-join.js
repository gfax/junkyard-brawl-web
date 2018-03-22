const JunkyardBrawl = require('junkyard-brawl')
const { getPhrase } = require('junkyard-brawl/src/language')
const { getGame, getSocket, setGame, setSocket } = require('../state')
const { scrubGameData, scrubPlayerData } = require('../util')
const uuid = require('uuid/v4')

module.exports = (socket, { player }) => {
  let game = getGame(socket.gameId)
  if (game) {
    game.addPlayer(socket.id, player.name)
    return
  }
  game = new JunkyardBrawl(
    socket.id,
    player.name,
    generateAnnounceCallback(socket),
    generateWhisperCallback(socket)
  )
  // Patch in some unique IDs to appease Vue
  game.deck.forEach(card => (card.uid = uuid()))
  game.id = socket.gameId
  setGame(socket.gameId, game)
  game.announce('game:created')
}

module.exports.validator = {
  'player.name': 'required|string'
}

function generateAnnounceCallback(socket) {
  return (code, message, messageProps) => {
    const game = getGame(socket.gameId)
    if (!game) {
      return
    }
    game.players.forEach((player) => {
      if (!player.robot) {
        const playerSocket = getSocket(player.id)
        if (playerSocket) {
          let newMessage = null
          try {
            newMessage = getPhrase(code, (playerSocket.language || game.language))(messageProps)
          } catch (err) {}

          playerSocket.send(JSON.stringify([code, {
            game: scrubGameData(game, playerSocket),
            message: newMessage || message,
            // Send updated personal info
            player: scrubPlayerData(player)
          }]))
        }
      }
    })
    if (game.stopped) {
      game.players.forEach((player) => {
        const playerSocket = getSocket(player.id)
        if (playerSocket) {
          playerSocket.terminate()
          // Mark the socket for garbage collection
          setSocket(player.id, null)
        }
      })
      // Mark the game for garbage collection
      setGame(game.id, null)
    }
    console.log(` >> ${code} ${message}`)
  }
}

function generateWhisperCallback(socket) {
  return (playerId, code, message, messageProps) => {
    const game = getGame(socket.gameId)
    if (!game) {
      return
    }
    const playerSocket = getSocket(playerId)
    if (playerSocket) {
      playerSocket.send(JSON.stringify(code, {
        game: scrubGameData(game, playerSocket),
        message: getPhrase(code, (playerSocket.language || game.language))(messageProps),
        player: scrubPlayerData(messageProps.player)
      }))
    }
    console.log(` >> ${messageProps.player.name}: ${code} ${message}`)
  }
}
