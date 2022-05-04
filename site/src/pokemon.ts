const $main = document.querySelector<HTMLDivElement>("main")
const $ul = document.querySelector<HTMLUListElement>("ul")
const $spinner = document.querySelector<HTMLImageElement>(".spinner")





function addPokemonImage(pokemon: Pokemon) {
    const div = document.createElement("div")
    const titleName = `${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}`
    div.innerHTML = `
    <figure>
        <img src="${pokemon.sprites.front_default}" alt="${titleName}" />
        <figcaption><a href="pokemon.html?pokemon=${pokemon.name}">${titleName}</a></figcaption>
    </figure>
        `
    if ($main) {
        $main.append(div)
    }
    if ($ul) {
        div.append($ul)
    }
}

type Abilities = {
    name: string;
    flavor_text_entries: string;
    flavor_text_entry: string;
    url: Request | string;
    error?: { message: string }[];
    queryString: string[];
    ability: string;
}

function addPokemonAbilities(pokemon:Abilities) {
    const titleName = `${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}`
    const li = document.createElement('li')
    const flavor_text = (pokemon.flavor_text_entries)
        .find((flavor_text_entry:Abilities) => flavor_text_entry.language.name === 'en')
    li.innerHTML = `
        <span class = "ability-name">"${titleName}"</span> 
        <span class="ability-short-description">${flavor_text.flavor_text}</span>
        <br>
        `
    if ($ul) {
        $ul.append(li)
    }
}



const queryString = new URLSearchParams(window.location.search)

fetch(`https://pokeapi.co/api/v2/pokemon/${queryString.get("pokemon")}`)
    .then(response => {
        return response.json()
    }).then(response => {
        addPokemonImage(response)
        const abilitiesRequests = response.abilities
            .map((response:Abilities)  => response.ability.url)
            .map((url: RequestInfo) => {
                return fetch(url).then(response => response.json())
            })
        return Promise.all(abilitiesRequests)
    }).then(responses => {
        if ($spinner){
            $spinner.classList.add("hidden")
    }
        responses.forEach(response => {
            addPokemonAbilities(response)
        })

    }).catch((error) => {
        const message = (error instanceof Error)
            ? error.message
            : "Unknown error"
        console.error(message)
    })
    export { }
