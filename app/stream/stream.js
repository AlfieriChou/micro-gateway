const micro = require('micro')
const fs = require('fs')

module.exports = async (req, res) => {
  micro.send(res, 200, fs.createReadStream('./images/test.png'))
}
