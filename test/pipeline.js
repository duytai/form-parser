const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const { FormReader } = require('../')

const { userAgent, cookie } = JSON.parse(process.env.SETTINGS)
describe('Pipeline', () => {
  it('Simple pipeline', (done) => {
    const URL = 'https://mbasic.facebook.com/groups/1244011002355014' 
    const formReader = new FormReader({ 
      useCache: true,
      willSendRequest: {
        headers: {
          'User-Agent': userAgent,
          cookie,
        },
      },
    })
    formReader.pipeline([
      {
        formAt: 1, 
        willSubmit: (requiredFields, submitFields) => ({
          ...requiredFields,
          view_photo: submitFields.view_photo,
        }),
      },
      {
        formAt: 0, 
        willSubmit: (requiredFields, submitFields) => ({
          ...requiredFields,
          ...submitFields,
          file1: fs.createReadStream(
            path.join(__dirname, './a.jpg')
          )
        }),
      },
      {
        formAt: 0, 
        willSubmit: (requiredFields, submitFields) => ({
          ...requiredFields,
          ...submitFields,
          xc_message: 'upload message from bot',
          view_post: submitFields.view_post,
        }),
        nextURL: (response) => response.headers.location,
      }
    ]).startWith(URL).then(() => {
      expect(true).to.equal(true)
    })
  })
})
