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
        ...submitFields,
        email,
        password,
        login: submitFields.login,
      }),
      nextURL: () => 'https://m.facebook.com/?soft=composer',
    },
    //{
      //willSendRequest: response => ({
        //headers: {
          //'User-Agent': userAgent,
          //Cookie: response.headers['set-cookie'][0],
        //}
      //}),
      //willSubmit: (requiredFields, submitFields) => ({
        //...requiredFields,
        //...submitFields,
        //status: 'Hi all',
      //})
    //}
  ])
  .startWith('https://m.facebook.com/login')
  .then(response => {
    console.log(response.headers)
    fs.writeFileSync('a.html', response.body, 'utf8')
  })
