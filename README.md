# form-parser
Submit your custom data to website

## 1. Install 

```bash
npm i form-reader
```

## 2.Usage

```javascript
  const FormReader = require('form-reader')
  // setup custom headers for every request
  const URL = 'https://mbasic.facebook.com/groups/1244011002355014' 
  formReader.willSendRequest(opts => merge(opts, {
   headers: {
    'User-Agent': userAgent,
    cookie,
   }
  }))
  const response = await formReader
   .readFrom(URL)
   .formAt(1)
   // inject your data and chose your custom submit action
   .willSubmit((requiredFields, submitFields) => {
      const {
       view_photo
      } = submitFields
      return {
       ...requiredFields,
       view_photo,
      }
   })
   .submit()
```

## 3. Examples

take a look at testcases
