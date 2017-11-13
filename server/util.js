module.exports = {
  scrubPlayer
}

// To slim the bandwidth, we need to return only
// the very basics over the network connection.
function scrubPlayer(player) {
  return {
    hand: scrubHand(player.hand)
  }
}

function scrubHand(hand) {
  return hand.map((card) => {
    return {
      id: card.id,
      name: card.id,
      type: card.type
    }
  })
}
