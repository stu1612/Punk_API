// UI VARS
beerContainer = document.getElementById('beer-container')
submitBtn = document.getElementById('submit-btn')

// FUNCTIONS
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
        console.log(beer);
        const beers = document.createElement('div')
        beers.classList.add('beers')
        beers.setAttribute('data-recipeID', `${beer.id}`)
        beers.innerHTML = `
        <h2>${beer.name}</h2>`
        beerContainer.appendChild(beers)
    })
}

getBeers()



// EVENT LST
