// UI VARS
displayContainer = document.getElementById('display-container')
recipeIdContainer = document.getElementById('recipeID-container')
form = document.getElementById('search-form')
message = document.getElementById('confirmation-message')
searchInput = document.getElementById('search-input')
let searchValue
let currentSearch

// EVENT LST

// passes user input to search paramater for beer search
searchInput.addEventListener('input', updateInput)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchBeer(searchValue);
})

function updateInput(e) {
    searchValue = e.target.value;
}

// returns the path data from specific beer ID when clicking the recipe-btn
displayContainer.addEventListener('click', (e) => {
    const beerInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('recipe-btn')
        } else {
            return false
        }
    });
    console.log(beerInfo);
    if (beerInfo) {
        const beerID = beerInfo.getAttribute('data-recipeid');
        getBeerById(beerID);
    }
});

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

// HTML data for onload beers and searched beers
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
    displayData(data)
}

// find beer from search input
async function searchBeer(search) {
    clear()
    const data = await fetchApi(`https://api.punkapi.com/v2/beers?beer_name=${search}`)
    // return message to user to confirm succesful search or not 
    const count = data.length
    if (data.length > 0) {
        displayData(data)
        message.innerHTML = `{${count}} matches found for : "${searchValue}"`
    } else {
        message.innerHTML = `{${count}} matches found for : "${searchValue}"`
    }
}

// returns beer from specific beer ID 
async function getBeerById(beerID) {
    const data = await fetchApi(`https://api.punkapi.com/v2/beers?ids=${beerID}`)
    const beer = data[0]
    addBeerToDOM(beer)
}


// returns all data from specific beer ID
function addBeerToDOM(beer) {
    // remove display and form containers
    displayContainer.style.display = 'none';
    form.style.display = 'none'
    // generate new div
    const beerRecipe = document.createElement('div')
    beerRecipe.classList.add('beer-recipe')
    beerRecipe.innerHTML = `
    <h2>Recipe</h2>
    <button class="delete-btn">Delete</button>`
    recipeIdContainer.addEventListener('click', (e) => {
        if (e.target.value = 'delete-btn') {
            beerRecipe.style.display = 'none'
            displayContainer.style.display = 'grid';
            form.style.display = 'block'
        }
    })
    recipeIdContainer.appendChild(beerRecipe)

    console.log(beer)
}

getBeers()
