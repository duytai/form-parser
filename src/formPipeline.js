const Q = require('q')

class FormPipeline {
  constructor({ steps, formReader }) {
    this.steps = steps 
    this.formReader = formReader
  }
  addMissingFields() {
    this.steps = this.steps.map(step => {
      const { 
        formAt = 0, 
        willSubmit = _ => {}, 
        nextURL = response => response.headers.location 
      } = step
      return { formAt, willSubmit, nextURL }
    })
  }
  async startWith(url) {
    this.addMissingFields()
    let goURL = url
    let response = null
    for (let i = 0; i < this.steps.length; i++) {
      const { formAt, willSubmit, nextURL } = this.steps[i]
      response = await this
        .formReader
        .readFrom(goURL)
        .formAt(formAt)
        .willSubmit(willSubmit)
        .submit()
      goURL = nextURL(response)
    }
    return response
  }
}

module.exports = FormPipeline
