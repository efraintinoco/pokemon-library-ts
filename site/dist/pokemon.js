"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $main = document.querySelector("main");
const $ul = document.querySelector("ul");
const $spinner = document.querySelector(".spinner");
function addPokemonImage(pokemon) {
    const div = document.createElement("div");
    const titleName = `${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}`;
    div.innerHTML = `
    <figure>
        <img src="${pokemon.sprites.front_default}" alt="${titleName}" />
        <figcaption><a href="pokemon.html?pokemon=${pokemon.name}">${titleName}</a></figcaption>
    </figure>
        `;
    if ($main) {
        $main.append(div);
    }
    if ($ul) {
        div.append($ul);
    }
}
function addPokemonAbilities(pokemon) {
    var _a;
    const titleName = `${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}`;
    const li = document.createElement('li');
    const flavor_text = (pokemon.flavor_text_entries)
        .find((flavor_text_entry) => flavor_text_entry.language.name === 'en');
    li.innerHTML = `
        <span class = "ability-name">"${titleName}"</span> 
        <span class="ability-short-description">${(_a = flavor_text === null || flavor_text === void 0 ? void 0 : flavor_text.flavor_text) !== null && _a !== void 0 ? _a : ""}</span>
        <br>
        `;
    if ($ul) {
        $ul.append(li);
    }
}
const queryString = new URLSearchParams(window.location.search);
fetch(`https://pokeapi.co/api/v2/pokemon/${queryString.get("pokemon")}`)
    .then(response => {
    return response.json();
}).then(response => {
    addPokemonImage(response);
    const abilitiesRequests = response.abilities
        .map((response) => response.ability.url)
        .map((url) => {
        return fetch(url).then(response => response.json());
    });
    return Promise.all(abilitiesRequests);
}).then(responses => {
    if ($spinner) {
        $spinner.classList.add("hidden");
    }
    responses.forEach(response => {
        addPokemonAbilities(response);
    });
}).catch((error) => {
    const message = (error instanceof Error)
        ? error.message
        : "Unknown error";
    console.error(message);
});
//# sourceMappingURL=pokemon.js.map