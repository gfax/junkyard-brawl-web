// Set the player's language
const { getSupportedLanguages } = require('junkyard-brawl/src/language')

module.exports = (socket, { language }) => {
  socket.language = language
}

module.exports.validator = (payload) => {
  return getSupportedLanguages().find(lang => lang === payload)
}

const languages = getSupportedLanguages().join(', ')
module.exports.validatorMessage = `Expected a supported language: ${languages}`
