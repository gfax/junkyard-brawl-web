const { getPhrase } = require('junkyard-brawl/src/language')
const { getGame, getSocket } = require('./state')

module.exports = {
  scrubGameData,
  scrubPlayerData
}

// We need to remove circular references and return
// only the data needing to be sent over the socket.
function scrubGameData(game, playerSocket) {
  if (!game) {
    return game
  }
  const language = playerSocket.language || game.language
  return {
    manager: {
      id: game.manager.id,
      name: game.manager.name
    },
    dropouts: game.dropouts.map(player => scrubOpponentData(player, language)),
    players: game.players.map(player => scrubOpponentData(player, language)),
    started: game.started ? game.started.valueOf() : false,
    stopped: game.stopped ? game.stopped.valueOf() : false,
    turns: game.turns
  }
}

// We can know everything about the player but what is in their hand
function scrubOpponentData(player, language) {
  if (!player) {
    return player
  }
  return {
    id: player.id,
    conditionCards: scrubCards(player.conditionCards, language),
    discard: scrubCards(player.discard, language),
    extraTurns: player.extraTurns,
    name: player.name,
    hand: player.hand.map(card => ({ type: 'unknown' })),
    hp: player.hp,
    maxHand: player.maxHand,
    maxHp: player.maxHp,
    missTurns: player.missTurns,
    score: 12,
    turns: player.turns
  }
}

// Re-use the data we get from scrubbing an opponent but also hand cards
function scrubPlayerData(player) {
  if (!player) {
    return player
  }
  const playerSocket = getSocket(player.id)
  const game = getGame(playerSocket.gameId)
  const language = playerSocket.language || game.language
  return Object.assign(scrubOpponentData(player, language), {
    hand: scrubCards(player.hand, language)
  })
}

function scrubCards(cards, language) {
  return cards.map((card) => {
    return {
      id: card.id,
      name: getPhrase(`card:${card.id}`, language)(),
      type: card.type,
      uid: card.uid
    }
  })
}
