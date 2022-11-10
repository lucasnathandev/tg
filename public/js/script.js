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

function cepGuard(e) {
  if (!e.key.match(/\d/)) {
    if (e.target.value.length === 6) {
      return e.key === "-"
        ? (e.target.value = e.key)
        : e.target.value.slice(e.target.value.length)
    }
    const index = e.target.value.indexOf(e.key)
    return e.target.value.slice(index - 1, index)
  }
}

async function getCep(cep) {
  let formattedCep = cep.match(/\d/g).join("")
  formattedCep = formattedCep
    .substring(0, formattedCep.length - 3)
    .concat("-", formattedCep.substring(formattedCep.length - 3))

  const data = await fetch(
    `https://cdn.apicep.com/file/apicep/${formattedCep}.json`
  ).then((r) => r.json())

  setAddressValues(data)
}

const cepInput = document.querySelector("input#zipCode")
cepInput.onkeyup = cepGuard
