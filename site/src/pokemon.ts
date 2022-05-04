const main = document.querySelector<HTMLDivElement>("main")
const ul = document.querySelector<HTMLUListElement>("ul")
const spinner = document.querySelector<HTMLImageElement>(".spinner")





function addPokemonImage(pokemon: Pokemon) {
    const div = document.createElement("div")
    const titleName = `${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}`
    div.innerHTML = `
    <figure>
        <img src="${pokemon.sprites.front_default}" alt="${titleName}" />
        <figcaption><a href="pokemon.html?pokemon=${pokemon.name}">${titleName}</a></figcaption>
    </figure>
        `
    main.append(div)
    div.append(ul)
}

function addPokemonAbilities(pokemon) {
    const titleName = `${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}`
    const li = document.createElement('li')
    const flavor_text = (pokemon.flavor_text_entries)
        .find(flavor_text_entry => flavor_text_entry.language.name === 'en')
    li.innerHTML = `
        <span class = "ability-name">"${titleName}"</span> 
        <span class="ability-short-description">${flavor_text.flavor_text}</span>
        <br>
        `
    ul.append(li)
}



const queryString = new URLSearchParams(window.location.search)

fetch(`https://pokeapi.co/api/v2/pokemon/${queryString.get("pokemon")}`)
    .then(response => {
        return response.json()
    }).then(response => {
        addPokemonImage(response)
        const abilitiesRequests = response.abilities
            .map(response => response.ability.url)
            .map(url => {
                return fetch(url).then(response => response.json())
            })
        return Promise.all(abilitiesRequests)
    }).then(responses => {
        spinner.classList.add("hidden")
        responses.forEach(response => {
            addPokemonAbilities(response)
        })

    })
    export { }
