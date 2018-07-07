const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const { merge } = require('lodash')
const { FormReader } = require('../')

const { userAgent, cookie } = JSON.parse(process.env.SETTINGS)
describe('# Form reader', () => {
  return
  it('Allow remove cache', async () => {
    const formReader = new FormReader({ useCache: true })
    formReader
      .willSendRequest(opts => merge(opts, {
        headers: {
          'User-Agent': userAgent,
          cookie,
        }
      }))
    // FIRST
    let fields1 = {}
    await formReader
      .readFrom('https://mbasic.facebook.com/groups/1244011002355014')
      .formAt(1)
      .willSubmit((requiredFields, submitFields) => {
        const { view_photo } = submitFields
        fields1 = requiredFields
        return {
          ...requiredFields,
          view_photo,
        }
      })
      .submit()
    // SECOND
    let fields2 = {}
    await formReader
      .readFrom('https://mbasic.facebook.com/groups/1244011002355014')
      .formAt(1)
      .willSubmit((requiredFields, submitFields) => {
        const { view_photo } = submitFields
        fields2 = requiredFields
        return {
          ...requiredFields,
          view_photo,
        }
      })
      .submit()
    expect(fields1).to.deep.equal(fields2)
  })
  it('Form with Image', async () => {
    const formReader = new FormReader()
    formReader.willSendRequest(opts => merge(opts, {
      headers: {
        'User-Agent': userAgent,
        cookie,
      }
    }))
    const { headers: { location }, body } = await formReader
      .readFrom('https://mbasic.facebook.com/groups/1244011002355014')
      .formAt(1)
      .willSubmit((requiredFields, submitFields) => {
        const { view_photo } = submitFields
        return {
          ...requiredFields,
          view_photo,
        }
      })
      .submit()
    const { headers: { location: nextStep } } = await formReader
      .readFrom(location)
      .formAt(0)
      .willSubmit((requiredFields, submitFields) => {
        return merge(
          requiredFields,
          submitFields,
          { 
            file1: fs.createReadStream(
              path.join(__dirname, './a.jpg')
            )
          }
        )
      })
      .submit()
    const d = await formReader
      .readFrom(nextStep)
      .formAt(0)
      .willSubmit((requiredFields, submitFields) => {
        const { view_post } = submitFields
        return merge(
          requiredFields,
          { xc_message: 'upload message from bot' },
          { view_post }
        )
      })
      .submit()
  })
  it('Simple Form', (done) => {
    const formReader = new FormReader()
    formReader.willSendRequest(opts => merge(opts, {
      headers: {
        'User-Agent': userAgent,
        cookie,
      }
    }))
    const formParser = formReader
      .readFrom('https://mbasic.facebook.com/groups/1244011002355014')
    formParser
      .formAt(1)
      .willSubmit((requiredFields, submitFields) => {
        const { view_post } = submitFields
        requiredFields.xc_message = 'Hello From Bot'
        return merge(requiredFields, { view_post })
      })
      .submit()
      .then((response) => {
        expect(1).to.be.ok
        done()
      })
  })
})
