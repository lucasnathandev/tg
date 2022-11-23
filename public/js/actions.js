// global variables

let actions = { ...getElements() }
const tableRows = document.querySelectorAll("table.table tbody > tr")
const buttons = {
  updateButton: document.querySelector("a#update-action"),
  deleteButton: document.querySelector("a#delete-action"),
}

const originalHref = {
  update: buttons.updateButton.href,
  delete: buttons.deleteButton.href,
}

// Functions declaring
// Event handlers

function orderDesc(e) {
  e.target.classList.remove("down")
  e.target.classList.add("up")
}

function orderAsc(e) {
  e.target.classList.remove("up")
  e.target.classList.add("down")
}

function setActive(e) {
  const activeElements = document.querySelectorAll("tr.active")
  e.currentTarget.classList.toggle("active")
  activeElements.forEach((item) => item.classList.remove("active"))
}

// State handlers

function getElements() {
  const arrows = document.querySelectorAll("th > i")
  const arrowDown = document.querySelectorAll("i.down")
  const arrowUp = document.querySelectorAll("i.up")
  const activeTr = document.querySelector("tbody > tr.active")
  let activeCpf
  activeTr && (activeCpf = activeTr.children.item(1).textContent)
  return {
    arrows,
    arrowDown,
    arrowUp,
    activeTr,
    activeCpf,
  }
}

function updateDomState() {
  actions = { ...getElements() }
  console.log(actions)
}

function main() {
  const { updateButton, deleteButton } = buttons
  actions.arrowDown.forEach((item) => {
    item.addEventListener("click", (e) => {
      orderDesc(e)
      updateDomState()
    })
  })

  deleteButton.addEventListener("click", (e) => {})

  tableRows.forEach((row) =>
    row.addEventListener("click", (e) => {
      setActive(e)
      updateDomState()
      if (actions.activeCpf) {
        updateButton.href = originalHref.update + "/" + btoa(actions.activeCpf)
        deleteButton.href = originalHref.delete + "/" + btoa(actions.activeCpf)
        return
      }
      updateButton.href = originalHref.update
      deleteButton.href = originalHref.delete
    })
  )

  actions.arrowUp.forEach((item) => {
    item.addEventListener("click", (e) => {
      orderAsc(e)
      updateDomState()
    })
  })
}

main()
