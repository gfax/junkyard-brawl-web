const uuid = require('uuid/v4')
const { getGame, setSocket } = require('./state')
const validator = require('./validator')
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 4000 })

wss.on('connection', connection)

function connection(ws, req) {
  // Keep track of which game the client is referencing
  ws.gameId = req.url.replace(/^\//, '')
  if (!ws.gameId) {
    ws.send(JSON.stringify([
      'error',
      'No game ID passed on connection: "example.com/gameid"'
    ]))
    ws.terminate()
    return
  }
  // Matching player ID and socket ID
  ws.id = uuid()
  setSocket(ws.id, ws)

  ws.on('message', onMessage)
  ws.on('error', removePlayer)
  ws.on('close', removePlayer)

  function onMessage(msg) {
    console.log(typeof msg, msg)
    let parsedMsg = null
    try {
      parsedMsg = JSON.parse(msg)
    } catch (err) {
      console.log(err)
      return
    }

    if (!Array.isArray(parsedMsg) || !parsedMsg.length) {
      return
    }
    const [code, payload] = parsedMsg
    const codes = {
      'game:start': require('./responses/game-start'),
      'player:bot': require('./responses/player-bot'),
      'player:join': require('./responses/player-join'),
      'player:pass': require('./responses/player-pass'),
      'player:play': require('./responses/player-play'),
      'player:language': require('./responses/player-language')
    }
    if (codes[code]) {
      const validation = validator(code, payload)
      if (validation.fails()) {
        ws.send(JSON.stringify(['error', validation.errors]))
        return
      }
      codes[code](ws, payload)
    }
  }

  function removePlayer() {
    const game = getGame(ws.gameId)
    if (game) {
      game.removePlayer(ws.id)
      // Mark the socket for garbage collection
      setSocket(ws.id, null)
    }
  }

}
