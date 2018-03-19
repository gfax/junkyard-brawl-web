// Object to store game instances in
const games = {}
const sockets = {}

module.exports = {
  getGame,
  getSocket,
  setGame,
  setSocket
}

function getGame(id) {
  return games[id]
}

function getSocket(id) {
  return sockets[id]
}

function setGame(id, game) {
  if (!id) {
    throw new Error('Could not set game. No ID given.')
  }
  if (game === undefined) {
    throw new Error('Could not set game. No game given.')
  }
  games[id] = game || undefined
}

function setSocket(id, socket) {
  if (!id) {
    throw new Error('Could not set socket. No ID given.')
  }
  if (socket === undefined) {
    throw new Error('Could not set socket. No socket given.')
  }
  sockets[id] = socket || undefined
}
