const Q = require('q')
const { merge } = require('lodash')
const request = require('request')
const urlJoin = require('url-join')
const { URL } = require('url')
const FormParser = require('./formParser')

class FormReader {
  constructor() {
    this.opts = {}
    this.extendOptions = () => this.opts 
    this.cache = {}
  }
  willSendRequest(f) {
    f && (this.extendOptions = f)
  }
  readFrom(url) {
    const options = this.extendOptions(this.opts)
    const submitData = async(action, formData) => {
      const { promise, resolve, reject } = Q.defer()
      const { origin } = new URL(url)
      let finalURL = action.indexOf('/') === 0 
        ? urlJoin(origin, action)
        : urlJoin(url, action)
      request(merge(
        {
          url: finalURL,
          method: 'POST',
          formData: formData,
        },
        options
      ), (error, response) => {
        if (error) return reject(error)
        resolve(response)
      })
      return promise
    }
    const getData = async () => {
      const { promise, resolve, reject } = Q.defer()
      const cachedData = this.cache[url]
      if (cachedData) return Q.resolve(cachedData)
      request(merge(
        {
          url,
          method: 'GET',
        },
        options
      ), (error, response) => {
        if (error) return reject(error)
        resolve(response)
      })
      return promise
    }
    return new FormParser(getData, submitData)
  }
}

module.exports = FormReader
