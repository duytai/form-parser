# Form-parser
Submit your custom data to website

## 1. Install 

```bash
npm i form-reader
```

## 2.Usage

```javascript
  const FormReader = require('form-reader')
  const formReader = new FormReader({
    useCache: true,
    willSendRequest: {
      headers: {
        'User-Agent': userAgent,
         cookie,
      },
    },
  })
  formReader.pipeline({
    formAt: 0,
    willSubmit: (requiredFields, submitFields) => ({
      ...requiredFields,
      view_photo: submitFields.view_photo,
    }),
    nextURL: (response) => response.headers.location
  })
```

## 3. Examples

take a look at testcases
