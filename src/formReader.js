const FormParser = require('./formParser')
const Transporter = require('./transporter')
const FormCache = require('./formCache')
const FormPipeline = require('./formPipeline')

class FormReader {
  constructor(formOptions = {}) {
    const { useCache, willSendRequest } = formOptions
    this.extendOptions = () => {} 
    this.cache = new FormCache()
    this.useCache = useCache
    this.willSendRequest(willSendRequest)
  }
  willSendRequest(f = {}) {
    if (typeof f === 'function') {
      this.extendOptions = () => f() || {} 
    } else {
      this.extendOptions = () => f 
    }
    return this
  }
  getTransporter(url) {
    const options = this.extendOptions()
    const transporter = new Transporter({
      url,
      options,
      cache: this.cache,
      useCache: this.useCache,
    })
    return transporter
  }
  readFrom(url) {
    const transporter = this.getTransporter(url)
    return new FormParser(transporter)
  }
  pipeline(steps) {
    return new FormPipeline({
      formReader: this,
      steps, 
    })
  }
}

module.exports = FormReader
