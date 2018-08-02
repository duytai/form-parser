# Form-parser
`form-reader` is a part of bigger project aiming to support Unofficial Facebook Graph. It allows you to submit your custom data to every facebook form.

## 1. Installation 

```bash
npm i form-reader
```

## 2. Usage
You can login facebook with your own account get a valid cookie for later use. __Notice__: won't work with 2-factor authen accounts.

```javascript
const FormReader = require('form-reader')
const formReader = new FormReader({
  willSendRequest: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    },
  },
})
const loginURL = 'https://mbasic.facebook.com/'
const { headers } = await this.formReader.pipeline([
  {
    formAt: 0,
    willSubmit: (requiredFields, submitFields) => ({
      ...requiredFields,
      login: submitFields.login,
      email: <YOUR_USER_NAME>,
      pass: <YOUR PASSWORD>,
    }),
  },
]).startWith(loginURL)
const cookie = headers['set-cookie'].map(c => c.split(';')[0]).join(';')
```
After having a valid cookie, you can do lots of awesome stuff. for example post a message to your facebook

```javascript
const FormReader = require('form-reader')
const formReader = new FormReader({
  willSendRequest: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
      cookie: <YOUR_VALID_COOKIE>
    },
  },
})
await this.formReader.pipeline([
  {
  formAt: 1,
  willSubmit: (requiredFields, submitFields) => ({
    ...requiredFields,
    xc_message: message,
    view_post: submitFields.view_post,
    }),
  },
]).startWith('https://mbasic.facebook.com/')
```
