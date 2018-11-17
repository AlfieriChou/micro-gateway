module.exports = {
  host: 'localhost',
  rules: [{
    slug: 'hello',
    pathname: '/api/hello',
    dest: 'hello.api.localhost',
    method: ['GET'],
    run: 'cd ./app/hello && micro hello.js -p 3001',
    debug: true
  }, {
    slug: 'captcha',
    pathname: '/api/captcha',
    dest: 'captcha.api.localhost',
    method: ['GET'],
    run: 'cd ./app/captcha && micro captcha.js -p 3002',
    debug: true
  }]
}
