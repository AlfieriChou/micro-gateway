const micro = require('micro')
const logger = require('../../common/logger')

const hello = async (req, res) => {
  logger.log('info', 'Request was received')
  micro.send(res, 200, 'hello world!!!')
}

module.exports = hello
