const micro = require('micro')
const { generateSwagger } = require('../../swagger/index')

const swagger = async (req, res) => {
  const result = generateSwagger(
    {
      'title': 'Demo API document',
      'version': 'v3',
      'description': 'Using swagger3.0 & joi to generate swagger.json',
      'contact': {
        'name': 'AlfieriChou',
        'email': 'alfierichou@gmail.com',
        'url': 'https://alfierichou.com'
      },
      'license': {
        'name': 'MIT',
        'url': 'https://github.com/AlfieriChou/joi_swagger_three/blob/master/LICENSE'
      }
    }
  )
  micro.send(res, 200, result)
}

module.exports = swagger
