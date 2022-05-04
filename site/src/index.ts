const url = "https://pokeapi.co/api/v2/pokemon?limit=50"
const $main = document.querySelector<HTMLDivElement>("main")
const $spinner = document.querySelector<HTMLImageElement>(".spinner")


type Pokemon = {
  name: string;
  sprites: {
    front_default: string[];
  };
  url: Request | string;
  error?: { message: string }[];
  queryString: string[];
};

function addPokemonImage(pokemon: Pokemon) {
  const div = document.createElement("div")
  const titleName = `${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}`
  div.innerHTML = `
    <figure>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <figcaption><a href="pokemon.html?pokemon=${pokemon.name}">${titleName}</a></figcaption>
    </figure>
    `
  if ($main) {
    $main.append(div)
  }
}

fetch(url)
  .then(response => {
    return response.json()
  }).then(parsedResponse => {
    const urls = parsedResponse.results.map((result: Pokemon) => result.url)
    const fetches = urls.map((url: RequestInfo) => fetch(url).then(response => response.json()))
    return Promise.all(fetches)
  }).then(responses => {
    responses.forEach(response => {
      if ($spinner) {
        $spinner.classList.add("hidden")
      }
      addPokemonImage(response)
    })
  }).catch((error) => {
    const message = (error instanceof Error)
      ? error.message
      : "Unknown error"
    console.error(message)
  })