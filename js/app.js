// UI VARS
displayContainer = document.getElementById('display-container')
form = document.getElementById('search-form')
message = document.getElementById('confirmation-message')
searchInput = document.getElementById('search-input')
let searchValue
let currentSearch

// EVENT LST
searchInput.addEventListener('input', updateInput)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchBeer(searchValue);
})

function updateInput(e) {
    searchValue = e.target.value;
}

// FUNCTIONS

function clear() {
    displayContainer.innerHTML = '';
}

// fetch and parse data from URL
async function fetchApi(url) {
    const dataFetch = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });
    const data = await dataFetch.json();
    return data;
}

function displayData(data) {
    data.forEach(beer => {
        // console.log(beer);
        const beers = document.createElement('div')
        beers.classList.add('beers')
        beers.setAttribute('data-recipeID', `${beer.id}`)
        beers.innerHTML = `
        <h2>${beer.name.substring(0, 20)}</h2>
        ${beer.image_url ? `<img src="${beer.image_url}"/>` : '<img src="./img/brewdog_logo.jpg" />'}
        <p class="primary-text">${beer.abv} %</p>
        <p class="number-text">${beer.id}</p>
        <button class="recipe-btn" id="recipe-btn">Get Recipe</button>`
        displayContainer.appendChild(beers)
    })
}

// Auto display beer selection for URL API
async function getBeers() {
    const data = await fetchApi('https://api.punkapi.com/v2/beers')
    // data.forEach(beer => {
    //     // console.log(beer);
    //     const beers = document.createElement('div')
    //     beers.classList.add('beers')
    //     beers.setAttribute('data-recipeID', `${beer.id}`)
    //     beers.innerHTML = `
    //     <h2>${beer.name.substring(0, 20)}</h2>
    //     ${beer.image_url ? `<img src="${beer.image_url}"/>` : '<img src="./img/brewdog_logo.jpg" />'}
    //     <p class="primary-text">${beer.abv} %</p>
    //     <p class="number-text">${beer.id}</p>
    //     <button class="recipe-btn" id="recipe-btn">Get Recipe</button>`
    //     beerContainer.appendChild(beers)
    // })
    displayData(data)
}

// find beer from search input
async function searchBeer(search) {
    clear()
    const data = await fetchApi(`https://api.punkapi.com/v2/beers?beer_name=${search}`)
    // data.forEach(beer => {
    //     // console.log(beer);
    //     const beers = document.createElement('div')
    //     beers.classList.add('beers')
    //     beers.setAttribute('data-recipeID', `${beer.id}`)
    //     beers.innerHTML = `
    //     <h2>${beer.name.substring(0, 20)}</h2>
    //     ${beer.image_url ? `<img src="${beer.image_url}"/>` : '<img src="./img/brewdog_logo.jpg" />'}
    //     <p class="primary-text">${beer.abv} %</p>
    //     <p class="number-text">${beer.id}</p>
    //     <button class="recipe-btn" id="recipe-btn">Get Recipe</button>`
    //     beerContainer.appendChild(beers)
    // })

    // return message to user to confirm succesful search or not 
    const count = data.length
    if (data.length > 0) {
        displayData(data)
        message.innerHTML = `{${count}} matches found for : "${searchValue}"`
    } else {
        message.innerHTML = `{${count}} matches found for : "${searchValue}"`
    }
}

getBeers()
