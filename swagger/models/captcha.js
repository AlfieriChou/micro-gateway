const Joi = require('joi')

module.exports = {
  index: {
    method: 'get',
    path: '/api/captcha',
    tags: ['captcha'],
    summary: '获取图形验证码',
    output: Joi.object().keys({
      text: Joi.string().description('验证码结果'),
      data: Joi.string().description('验证码svg')
    })
  }
}
