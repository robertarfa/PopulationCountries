// Estado da aplicação (state)

let tabCountries = null
let tabFavorites = null

let allCountries = []
let favoriteCountries = []

let countCountries = 0
let countFavorites = 0

let totalPopulationList = 0
let totalPopulationListFavorites = 0

let numberFormat = null

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries')
  tabFavorites = document.querySelector('#tabFavorites')

  countCountries = document.querySelector('#countCountries')
  countFavorites = document.querySelector('#countFavorites')

  totalPopulationList = document.querySelector('#totalPopulationList')
  totalPopulationListFavorites = document.querySelector(
    '#totalPopulationListFavorites'
  )

  numberFormat = Intl.NumberFormat('pt-BR')

  fetchCountries()
})

async function fetchCountries() {
  const promiseData = await fetch('https://restcountries.eu/rest/v2/all')
  const json = await promiseData.json()
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country

    return {
      id: numericCode,
      name: country.translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag,
    }
  })
  render()
}

function render() {
  renderCountryList()
  renderFavorites()
  renderSummary()
  handleCountryButtons()
}

function renderCountryList() {
  let countriesHTML = '<div>'

  allCountries.forEach((country) => {
    const { id, name, population, flag, formattedPopulation } = country

    const countryHTML = `
          <div class='country'>
              <div>
              <a id='${id}' class="waves-effect waves-light btn">+</a>
              </div>
              <div>
              <img src='${flag}' alt='${name}'>
              </div>
              <div>
                <ul>
                    <li>${name}</li>
                    <li>${formattedPopulation}</li>
                </ul>
              </div>
          </div>
          `
    countriesHTML += countryHTML
  })

  countriesHTML += '</div>'

  tabCountries.innerHTML = countriesHTML
}

function renderFavorites() {
  let favoriteCountriesHTML = ''

  favoriteCountries.forEach((country) => {
    const { id, name, population, flag, formattedPopulation } = country

    const favoriteCountryHTML = `
    <div class='country'>
        <div>
        <a id='${id}' class="waves-effect waves-light btn red darken-4">-</a>
        </div>
        <div>
        <img src='${flag}' alt='${name}'>
        </div>
        <div>
            <ul>
                <li>${name}</li>
                <li>${formattedPopulation}</li>
            </ul>
        </div>
    </div>
        `

    favoriteCountriesHTML += favoriteCountryHTML
  })

  favoriteCountriesHTML += '</div>'
  tabFavorites.innerHTML = favoriteCountriesHTML
}

function renderSummary() {
  countCountries.innerHTML = allCountries.length
  countFavorites.innerHTML = favoriteCountries.length

  const totalPopulation = allCountries.reduce((acc, curr) => {
    return acc + curr.population
  }, 0)

  totalPopulationList.innerHTML = formatNumber(totalPopulation)

  const totalFavoritePopulation = favoriteCountries.reduce((acc, curr) => {
    return acc + curr.population
  }, 0)

  totalPopulationFavorites.innerHTML = formatNumber(totalFavoritePopulation)
}

function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'))
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'))

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id))
  })

  favoriteButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id))
  })
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find((country) => country.id === id)

  favoriteCountries = [...favoriteCountries, countryToAdd]

  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  allCountries = allCountries.filter((country) => country.id !== id)

  render()
}

function removeFromFavorites(id) {
  const countryToRemove = favoriteCountries.find((country) => country.id === id)

  allCountries = [...allCountries, countryToRemove]

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  favoriteCountries = favoriteCountries.filter((country) => country.id !== id)
  render()
}

function formatNumber(number) {
  return numberFormat.format(number)
}
