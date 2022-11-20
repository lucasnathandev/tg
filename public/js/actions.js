class Actions {
  elements = []
  add(selector) {
    const el = document.querySelector(selector)
    this.elements.push(el)
    return this
  }
  addMany(selector) {
    const el = document.querySelectorAll(selector)
    el.forEach((item) => this.elements.push(el))
    return this
  }
}

const actions = new Actions().addMany("table.table thead th::before")
console.log(actions)
