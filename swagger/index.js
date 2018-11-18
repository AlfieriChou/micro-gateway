const Joi = require('joi')
const convert = require('joi-to-json-schema')
const _ = require('lodash')
const appRoot = require('app-root-path')
const dir = require('dir_filenames')

const generateComponents = (model, modelName) => {
  const modelSchema = convert(model)
  let schema = {}
  schema[modelName] = {
    'type': 'object',
    'properties': modelSchema.properties
  }
  return schema
}

const generateInterface = (model) => {
  const content = {
    tags: model.tags,
    summary: model.summary,
    description: model.description
  }

  if (model.query) {
    content.parameters = []
    let params = convert(Joi.object(model.query))
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

  if (model.params) {
    content.parameters = []
    let params = convert(Joi.object(model.params))
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

  if (model.requestBody) {
    let params = convert(Joi.object(model.requestBody.body))
    let request = {}
    request.requestBody = {}
    let bodySchema = request.requestBody
    bodySchema.required = true
    bodySchema.content = {
      'application/json': {
        'schema': {
          'type': params.type,
          'properties': params.properties,
          'required': model.requestBody.required
        }
      }
    }
    content.requestBody = request.requestBody
  }
  return content
}

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
        const schema = generateComponents(model[index], schemaName)
        components.schemas = _.merge(components.schemas, schema)
      } else {
        const content = generateInterface(model[index])
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
