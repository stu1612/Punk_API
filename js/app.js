// UI VARS
const displayContainer = document.getElementById('display-container')
const recipeIdContainer = document.getElementById('recipeID-container')
const form = document.getElementById('search-form')
const message = document.getElementById('confirmation-message')
const searchInput = document.getElementById('search-input')
const beerRecipe = document.getElementById('beer-recipe')
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
            return item.classList.contains('beers')
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
    scrollTo(0, 0)
    console.log(beer)
    // set display of containers 
    recipeIdContainer.style.display = 'block'
    displayContainer.style.display = 'none'
    form.style.display = 'none'
    // set UI vars for METHOD DIV
    const fermentation = beer.method.fermentation.temp
    const mash = beer.method.mash_temp[0]
    // recipe innerHTML DOM elements
    beerRecipe.innerHTML = `
        <button class"delete-btn">Delete</button>
        <div class="recipe-info">
            <div class="recipe-image">
                ${beer.image_url ? `<img src="${beer.image_url}" />` : '<img src="./img/brewdog_logo.jpg" />'}
            </div>
            <div class="recipe-content"> 
                <div class="recipe-details">   
                    <h2 class="h2-heading">${ beer.name}</h2> <span>ABV : ${beer.abv}</span>
                        <p class="recipe-text">Brewers Tips : ${beer.brewers_tips}</p>
                        <p class="recipe-text">Description : ${beer.description}</p>
                </div>
                <div class="recipe-method">
                    <h3 class="h3-heading">Fermentation</h3>
                        <p>${fermentation.value} ${fermentation.unit}</p>
                    <h3 class="h3-heading">Mash</h3>
                        <p>${mash.temp.value} ${mash.temp.unit} @ ${mash.duration} mins</p>
                    <div class="method">
                        <h3 class="h3-heading">Method</h3>
                            <p class="recipe-text">Boil Volume : ${beer.boil_volume.value} ${beer.boil_volume.unit}</p>
                            <p class="recipe-text">EBC : ${beer.ebc}</p>
                            <p class="recipe-text">IBU : ${beer.ibu}</p>
                            <p class="recipe-text">pH : ${beer.ph}</p>
                            <p class="recipe-text">SRM : ${beer.srm}</p>
                            <p class="recipe-text">Target FG : ${beer.target_fg}</p>
                            <p class="recipe-text">Target OG : ${beer.target_og}</p>
                            <p class="recipe-text">Volume : ${beer.volume.value} ${beer.volume.unit}</p>
                    </div>
                    <div class="food-pairing">
                        <h3 class="h3-heading">Food Pairing</h3>
                            <p class="recipe-text">${beer.food_pairing[0]}</p>
                            <p class="recipe-text">${beer.food_pairing[1]}</p>
                            <p class="recipe-text">${beer.food_pairing[2]}</p>
                    </div>
                </div>

            </div>        
        </div    
            `
    // create divs for the ingredients forEach lists
    // HOPS
    const hopsDiv = document.createElement('div')
    hopsDiv.classList.add('hops-div')
    hopsDiv.innerHTML = '<h3 class="h3-heading">Hops</h3>'
    // MALTS
    const maltsDiv = document.createElement('div')
    maltsDiv.classList.add('malts-div')
    maltsDiv.innerHTML = '<h3 class="h3-heading">Malts</h3>'

    // add hops ingredients to DOM
    const hops = beer.ingredients.hops
    hops.forEach(hop => {
        const list = document.createElement('li')
        list.classList.add('recipe-list')
        list.innerHTML = `${hop.name} - ${hop.amount.value} ${hop.amount.unit} (add: ${hop.add} | attribute: ${hop.attribute})`
        hopsDiv.appendChild(list)
    })
    // add malt ingredients to DOM
    const malts = beer.ingredients.malt
    malts.forEach(malt => {
        const list = document.createElement('li')
        list.classList.add('recipe-list')
        list.innerHTML = `${malt.name} - ${malt.amount.value} ${malt.amount.unit} `
        maltsDiv.appendChild(list)
    })
    // add yeast ingredient to list array and display to DOM
    const yeastDiv = document.createElement('div')
    yeastDiv.classList.add('yeast-div')
    yeastDiv.innerHTML = `
     <h3 class="h3-heading">Yeast</h3>
        <p class="recipe-text">${beer.ingredients.yeast}</p>`

    // append ing divs to beerRecipe div
    beerRecipe.appendChild(hopsDiv)
    beerRecipe.appendChild(maltsDiv)
    beerRecipe.appendChild(yeastDiv)
    // Delete BTN evt lst - remove recipe and reload start page
    recipeIdContainer.addEventListener('click', (e) => {
        if (e.target.value = 'delete-btn') {
            recipeIdContainer.style.display = 'none'
            displayContainer.style.display = 'grid'
            form.style.display = 'block'
        }
    })
    // recipeIdContainer.appendChild(beerRecipe)


}

getBeers()
