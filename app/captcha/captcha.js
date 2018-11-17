const micro = require('micro')
const svgCaptcha = require('svg-captcha')

const captcha = async (req, res) => {
  const captchaData = await svgCaptcha.createMathExpr()
  micro.send(res, 200, captchaData)
}

module.exports = captcha
