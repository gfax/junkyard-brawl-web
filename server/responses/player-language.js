// Set the player's language
const { getSupportedLanguages } = require('junkyard-brawl/src/language')

module.exports = (socket, { language }) => {
  socket.language = language
}

module.exports.validator = (value) => {
  return getSupportedLanguages().find(lang => lang === value)
}

const languages = getSupportedLanguages().join(', ')
module.exports.validatorMessage = `Expected a supported language: ${languages}`
