const ValidatorJs = require('validatorjs')

const rules = {
  'game:start': {},
  'player:join': {
    gameId: 'required|string',
    'player.name': 'required|string'
  }
}

module.exports = (code, payload) => {
  if (!rules[code]) {
    throw new Error(`Received undefined code: ${code}`)
  }
  return new ValidatorJs(payload, rules[code])
}
