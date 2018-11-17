const micro = require('micro')

const hello = async (req, res) => {
  micro.send(res, 200, 'hello world!!!')
}

module.exports = hello
