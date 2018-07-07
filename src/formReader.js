const FormParser = require('./formParser')
const Transporter = require('./transporter')
const FormCache = require('./formCache')

class FormReader {
  constructor(formOptions = {}) {
    const { useCache } = formOptions
    this.opts = {}
    this.extendOptions = () => this.opts 
    this.cache = new FormCache()
    this.useCache = useCache
  }
  willSendRequest(f) {
    f && (this.extendOptions = f)
  }
  readFrom(url) {
    const options = this.extendOptions(this.opts)
    const transporter = new Transporter({
      url,
      options,
      cache: this.cache,
      useCache: this.useCache,
    })
    return new FormParser(transporter)
  }
}

module.exports = FormReader
