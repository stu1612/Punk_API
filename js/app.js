// UI VARS
beerContainer = document.getElementById('beer-container')
form = document.getElementById('search-form')
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

// Auto display beer selection for URL API
async function getBeers() {
    const dataFetch = await fetch('https://api.punkapi.com/v2/beers', {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });
    const data = await dataFetch.json();
    // return data;
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
        beerContainer.appendChild(beers)
    })
}

async function searchBeer(search) {
    const dataFetch = await fetch(`https://api.punkapi.com/v2/beers?beer_name=${search}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });
    const data = await dataFetch.json();
    // return data;
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
        beerContainer.appendChild(beers)
    })
}

getBeers()
