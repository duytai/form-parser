const { FormReader } = require('../')
const { userAgent, email, password } = require('./data')
const fs = require('fs')

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
      willSubmit: (requiredFields, submitFields) => ({
        ...requiredFields,
        email,
        pass: password,
        login: submitFields.login,
      }),
      nextURL: response => response.headers.location,
    },
    {
      formAt: 1,
      willSendRequest: response => {
        const cookies = response.headers['set-cookie']
        const cookieData = cookies
          .map(cookie => cookie.split(';')[0])
          .join('&')
        return {
          headers: {
            'User-Agent': userAgent,
            Cookie: cookieData,
          },
        }
      },
      willSubmit: (requiredFields, submitFields) => ({
        ...requiredFields,
        xc_message: 'Hello From Bot',
        view_post: submitFields.view_post,
      })
    }
  ])
  .startWith('https://mbasic.facebook.com/login')
  .then(response => {
    console.log(response.headers)
    fs.writeFileSync('a.html', response.body, 'utf8')
  })
