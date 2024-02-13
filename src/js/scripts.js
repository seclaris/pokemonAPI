const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");

// Fetch the pokemon API
async function fetchPokemon() {
  const userInput = searchInput.value.toLowerCase().trim();
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${userInput}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon with status: ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

// TODO: error message for invalid pokemon name

// Filter the pokemon data
function filterPokemonData(data) {
  const pokemonData = {
    name: data.name,
    id: data.id,
    sprite: data.sprites.front_default,
    type: data.types.map((type) => type.type.name).join(", "),
    weight: data.weight,
    height: data.height,
    base_experience: data.base_experience,
  };
  return pokemonData;
}

// Event listener for the search button
searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
});
searchBtn.addEventListener("click", async () => {
  let pokemonData;
  let pokemon;
  try {
    pokemonData = await fetchPokemon();
    pokemon = filterPokemonData(pokemonData);
    console.log(pokemon);
  } catch (error) {
    console.error(error);
  }
});
