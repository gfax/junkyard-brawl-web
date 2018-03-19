const ValidatorJs = require('validatorjs')

module.exports = (code, payload) => {
  const responseModule = require('./responses/' + code.replace(':', '-'))
  return new ValidatorJs(payload, responseModule.validator || {}, responseModule.validatorMessage)
}
