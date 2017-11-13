const JunkyardBrawl = require('junkyard-brawl')
const util = require('./util')
const validator = require('./validator')
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 4000 })
// Object to store game instances in
const games = {}

wss.on('connection', connection)

function connection(ws) {
  // Keep track of which game the client is referencing
  let id = null
  ws.on('message', onMessage)

  function onMessage(msg) {
    console.log(typeof msg, msg)
    let parsedMsg = null
    try {
      parsedMsg = JSON.parse(msg)
    } catch (err) {
      console.log(err)
      return
    }

    if (!Array.isArray(parsedMsg)) {
      return
    }
    const [code, payload] = parsedMsg
    const codes = {
      'game:start': startGame,
      'player:join': addPlayer
    }
    if (codes[code]) {
      const validation = validator(code, payload)
      if (validation.fails()) {
        ws.send(JSON.stringify(['error', validation.errors]))
        return
      }
      codes[code](payload)
    }
  }

  function addPlayer({ player, gameId }) {
    id = gameId
    const game = games[id]
    if (game) {
      game.addPlayer(ws, player.name)
      return
    }
    games[id] = new JunkyardBrawl(
      ws,
      player.name,
      generateAnnounceCallback(id),
      generateWhisperCallback(id)
    )
    games[id].announce('game:created')
  }

  function generateAnnounceCallback(gameId) {
    return (code, message) => {
      const game = games[gameId]
      if (!game) {
        return
      }
      game.players.forEach(player => player.id.send(JSON.stringify([code, message])))
      console.log(` >> ${code} ${message}`)
    }
  }

  function generateWhisperCallback(gameId) {
    return (playerId, code, message, messageProps) => {
      const game = games[gameId]
      if (!game) {
        return
      }
      playerId.send(JSON.stringify([code, message, {
        player: util.scrubPlayer(messageProps.player)
      }]))
      console.log(` >> ${messageProps.player.name}: ${code} ${message}`)
    }
  }

  function startGame() {
    const game = games[id]
    if (game) {
      game.start()
      game.players.forEach((player) => {
        console.log(`gonna whisper status to ${player.name}`)
        game.whisperStatus(player)
      })
    }
  }

}
