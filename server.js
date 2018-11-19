module.exports = {
  host: 'localhost',
  rules: [{
    slug: 'hello',
    pathname: '/api/hello',
    dest: 'hello.api.localhost',
    method: ['GET'],
    run: 'cd ./app/hello && micro-dev hello.js -p 3001',
    debug: true
  }, {
    slug: 'captcha',
    pathname: '/api/captcha',
    dest: 'captcha.api.localhost',
    method: ['GET'],
    run: 'cd ./app/captcha && micro-dev captcha.js -p 3002',
    debug: true
  }, {
    slug: 'swagger',
    pathname: '/api/swagger.json',
    dest: 'swagger.api.localhost',
    method: ['GET'],
    run: 'cd ./app/swagger && micro-dev swagger.js -p 3003',
    debug: true
  }, {
    slug: 'stream',
    pathname: '/api/stream',
    dest: 'stream.api.localhost',
    method: ['GET'],
    run: 'cd ./app/stream && micro-dev stream.js -p 3004',
    debug: true
  }]
}
