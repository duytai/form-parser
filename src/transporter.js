const Q = require('q')
const { merge } = require('lodash')
const request = require('request')
const urlJoin = require('url-join')
const { URL } = require('url')

class Transporter {
  constructor({ url, options, cache, useCache }) {
    this.url = url
    this.options = options
    this.cache = cache
    this.useCache = useCache
  }
  async submit (action, formData) {
    const { origin } = new URL(this.url)
    let finalURL = action.indexOf('/') === 0 
      ? urlJoin(origin, action)
      : urlJoin(this.url, action)
    const [ response ] = await Q.nfcall(request, {
      url: finalURL,
      method: 'POST',
      formData,
      ...this.options,
    })
    return response
  }
  async get() {
    if (this.useCache && this.cache.hasKey(this.url))
      return Q.resolve(this.cache.get(this.url))
    const [ response ] = await Q.nfcall(request, {
      url: this.url,
      method: 'GET',
      ...this.options,
    })
    if (this.useCache) {
      this.cache.save(this.url, response)
    }
    return response
  }
}

module.exports = Transporter
