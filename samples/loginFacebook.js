const fs = require('fs')
const { FormReader } = require('../')
const { userAgent, email, password } = require('./data')

const formReader = new FormReader({
  useCache: true,
  willSendRequest: {
    headers: {
      'User-Agent': userAgent,
    },
  },
})

formReader
  .pipeline([
    {
      formAt: 0,
      willSubmit: (requiredFields, submitFields) => ({
        ...requiredFields,
        ...submitFields,
        email,
        password,
        login: submitFields.login,
      })
    }
  ])
  .startWith('https://www.facebook.com/login.php')
  .then(response => {
    console.log('END')
    console.log(response.headers)
    fs.writeFileSync('a.html', response.body, 'utf8')
  })
