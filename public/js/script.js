function setAddressValues(data) {
  const publicPlaceInput = document.querySelector("input#publicPlace")
  const districtInput = document.querySelector("input#district")
  const cityInput = document.querySelector("input#city")
  const stateInput = document.querySelector("input#state")
  publicPlaceInput.value = data.address
  districtInput.value = data.district
  cityInput.value = data.city
  stateInput.value = data.state
}

// Inputs guard

function formatName(e) {
  let v = e.target.value.replace(/\d/g, "")
  e.target.value = v
}

function formatCep(e) {
  let v = e.target.value.replace(/\D/g, "")

  v = v.replace(/^(\d{5})(\d)/, "$1-$2")

  e.target.value = v
  return v
}

function formatCellPhone(e) {
  let v = e.target.value.replace(/\D/g, "")

  v = v.replace(/^(\d\d)(\d)/g, "($1)$2")

  v = v.replace(/(\d{5})(\d)/, "$1-$2")

  e.target.value = v
}

function formatCpf(e) {
  console.log(e.key)
  let v = e.target.value.replace(/\D/g, "")

  v = v.replace(/(\d{3})(\d)/, "$1.$2")

  v = v.replace(/(\d{3})(\d)/, "$1.$2")

  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

  e.target.value = v
}

function formatRg(e) {
  let v = e.target.value.replace(/\W/g, "")
  v = v.replace(/(\d{2})(\d{3})(\d{3})(\w{1})$/, "$1.$2.$3-$4")
  e.target.value = v
}

// Async operations

async function getCep(e) {
  const formattedCep = formatCep(e)

  const data = await fetch(
    `https://cdn.apicep.com/file/apicep/${formattedCep}.json`
  ).then((r) => r.json())

  setAddressValues(data)
}

const nameInput = document.querySelector("input#name")
const cpfInput = document.querySelector("input#cpf")
const rgInput = document.querySelector("input#rg")
const cepInput = document.querySelector("input#zipCode")
const cellInput = document.querySelector("input#cellPhone")

cepInput && (cepInput.onkeyup = formatCep)
cepInput && (cepInput.onchange = getCep)
nameInput.onkeyup = formatName
rgInput && (rgInput.onkeyup = formatRg)
cpfInput.onkeyup = formatCpf
cellInput && (cellInput.onkeyup = formatCellPhone)
