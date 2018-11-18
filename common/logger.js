const winston = require('winston')
const appRoot = require('app-root-path')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} ${info.level}: ${info.message}`
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${appRoot}/logs/app.log` })
  ]
})

module.exports = logger
