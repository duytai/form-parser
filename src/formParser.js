const cheerio = require('cheerio')
const { merge } = require('lodash')

class FormParser {
  constructor(transporter) {
    this.transporter = transporter
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
    const { body } = await this.transporter.get()
    const $ = cheerio.load(body)
    if (!$('form').length) throw new Error('Form is not found') 
    const form = $('form').eq(this.formIndex)
    const action = form.attr('action')
    if (!action) throw new Error('There is not action')
    const inputs = form.find('input, textarea, button')
    const requiredFields = {}
    const submitFields = {}
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs.eq(i)
      const name = input.attr('name')
      const value = input.attr('value') || ''
      const type = input.attr('type')
      if (name) {
        if (type === 'submit') {
          submitFields[name] = value
        } else {
          if (/\[\]$/.test(name)) {
            const newName = name.slice(0, name.length - 2)
            if (!submitFields[newName]) submitFields[newName] = []
            submitFields[newName].push(value)
          } else {
            requiredFields[name] = value
          }
        }
      }
    }
    const formData = this.willSubmitCallback(requiredFields, submitFields)
    return this.transporter.submit(action, formData)
  }
}

module.exports = FormParser 
