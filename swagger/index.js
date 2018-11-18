const Joi = require('joi')
const convert = require('joi-to-json-schema')
const _ = require('lodash')
const appRoot = require('app-root-path')
const dir = require('dir_filenames')

const generateSwagger = (info) => {
  const items = dir(`${appRoot}/swagger/models`)
  _.remove(items, (n) => {
    return n === `${appRoot}/swagger/models/index.js`
  })
  let methods = []
  let components = {}
  components.schemas = {}
  items.forEach(item => {
    let model = require(item)
    const fileName = item.split('/').pop().replace(/\.\w+$/, '')
    let schemaName = fileName.slice(0, 1).toUpperCase() + fileName.slice(1)
    for (let index in model) {
      if (index === 'schema') {
        const modelSchema = convert(model[index])
        let schema = {}
        schema[schemaName] = {
          'type': 'object',
          'properties': modelSchema.properties
        }
        components.schemas = _.merge(components.schemas, schema)
      } else {
        const content = {
          tags: model[index].tags,
          summary: model[index].summary,
          description: model[index].description
        }

        if (model[index].query) {
          content.parameters = []
          let params = convert(Joi.object(model[index].query))
          for (let prop in params.properties) {
            let field = {}
            field.name = prop
            field.in = 'query'
            field.description = params.properties[prop].description
            field.schema = {
              'type': params.properties[prop].type
            }
            field.required = false
            content.parameters.push(field)
          }
        }

        if (model[index].params) {
          content.parameters = []
          let params = convert(Joi.object(model[index].params))
          for (let prop in params.properties) {
            let field = {}
            field.name = prop
            field.in = 'path'
            field.description = params.properties[prop].description
            field.schema = {
              'type': params.properties[prop].type
            }
            field.required = true
            content.parameters.push(field)
          }
        }

        if (model[index].requestBody) {
          let params = convert(Joi.object(model[index].requestBody.body))
          let request = {}
          request.requestBody = {}
          let bodySchema = request.requestBody
          bodySchema.required = true
          bodySchema.content = {
            'application/json': {
              'schema': {
                'type': params.type,
                'properties': params.properties,
                'required': model[index].requestBody.required
              }
            }
          }
          content.requestBody = request.requestBody
        }

        const schema = convert(model[index].output)
        content.responses = {
          200: {
            'description': 'response success',
            'content': {
              'application/json': {
                'schema': {
                  type: schema.type,
                  properties: schema.properties
                }
              }
            }
          }
        }

        let swaggerMethod = {}
        swaggerMethod[(model[index].method).toString()] = content

        let swaggerItem = {}
        swaggerItem[(model[index].path).toString()] = swaggerMethod
        methods.push(swaggerItem)
      }
    }
  })

  let mergeMethod = {}
  for (let i = 0; i < methods.length; ++i) {
    mergeMethod = _.merge(mergeMethod, methods[i])
  }

  let swagger = {}
  swagger.openapi = '3.0.0'
  swagger.info = info
  swagger.paths = mergeMethod
  swagger.components = components
  return swagger
}

module.exports = {
  generateSwagger
}
