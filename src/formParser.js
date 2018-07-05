const cheerio = require('cheerio')
const { merge } = require('lodash')

class FormParser {
  constructor(getData, submitData) {
    this.getData = getData
    this.submitData = submitData
    this.formIndex = 0
    this.willSubmitCallback = (requiredFields, submitFields) => 
      merge(requiredFields, submitFields) 
  }
  formAt(formIndex) {
    this.formIndex = formIndex
    return this
  }
  willSubmit(f) {
    f && (this.willSubmitCallback = f)
    return this
  }
  async submit() {
    const { body } = await this.getData()
    const $ = cheerio.load(body)
    const form = $('form').eq(this.formIndex)
    const action = form.attr('action')
    const inputs = form.find('input, textarea')
    const requiredFields = {}
    const submitFields = {}
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs.eq(i)
      const name = input.attr('name')
      const value = input.attr('value') || ''
      const type = input.attr('type')
      if (type === 'submit') {
        submitFields[name] = value
      } else {
        requiredFields[name] = value
      }
    }
    const formData = this.willSubmitCallback(requiredFields, submitFields)
    return this.submitData(action, formData)
  }
}

module.exports = FormParser 
