class FormCache {
  constructor() {
    this.cache = {}
  }
  save(key, value) {
    this.cache[key] = value
  }
  get(key) {
    return this.cache[key]
  }
  hasKey(key) {
    return !!this.cache[key]
  }
}

module.exports = FormCache
