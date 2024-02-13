const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const section = document.querySelector("section");
const errorMessage = document.querySelector("#error-message");

/**
 * Fetches the pokemon API from the pokeapi.co website.
 * @return {data} - contains the pokemon data from the API.
 * @throws {Error} - if the fetch fails, an error is thrown. Additional error handling is done in the searchBtn event listener.
 */
async function fetchPokemon() {
  const userInput = await searchInput.value.toLowerCase().trim();

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${userInput}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon with status: ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

/**
 * Filters the pokemon data to only the name, id, sprite, type, weight, height, and base_experience.
 * @param {data} data - contains data from the fetchPokemon function.
 */
function filterPokemonData(data) {
  const pokemonData = {
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    id: "#" + data.id,
    sprite: data.sprites.front_default,
    Type: data.types.map((type) => type.type.name).join(", "),
    Weight: data.weight,
    Height: data.height,
    Base_experience: data.base_experience,
  };
  return pokemonData;
}

// Event listeners for the search button
searchBtn.addEventListener("click", async () => {
  if (searchInput.value !== "") {
    errorMessage.innerHTML = "";
  }

  let pokemonData;
  let pokemon;
  try {
    pokemonData = await fetchPokemon();
    pokemon = filterPokemonData(pokemonData);
    displayPokemon(pokemon);

    searchInput.value = "";
  } catch (error) {
    console.error(error); // logs additional error information to the console.
    let errorElement = document.querySelector("#error-message");
    if (errorElement === null) {
      errorElement = document.createElement("p");
      errorMessage.appendChild(errorElement);
    }
    if (searchInput.value === "") {
      errorElement.textContent = "ERROR: " + error.message + ". Please enter a pokemon name.";
    } else {
      errorElement.textContent = "ERROR: " + error.message;
    }
  }
});

// Clears the section to prevent the page from displaying multiple pokemon data.
searchBtn.addEventListener("click", clearSection);

function clearSection() {
  section.innerHTML = "";
}

/**
 * Displays pokemon's data through a table.
 * @param {pokemon} pokemon - contains the pokemon data from the filterPokemonData function (name, id, sprite, type, weight, height, base_experience)
 *
 */
function displayPokemon(pokemon) {
  const header = document.createElement("h2");
  header.textContent = pokemon.name + "'s Info";
  section.appendChild(header);

  const div = document.createElement("div");
  div.id = "info";
  section.appendChild(div);

  // Create a table
  const table = document.createElement("table");
  div.appendChild(table);

  // Header row
  const headerRow = document.createElement("tr");
  table.appendChild(headerRow);

  // Header name of the pokemon
  const headerName = document.createElement("th");
  headerName.textContent = pokemon.name;
  headerName.classList.add("name");
  headerRow.appendChild(headerName);

  // Header id of the pokemon
  const headerID = document.createElement("th");
  headerID.textContent = pokemon.id;
  headerID.id = "pokemon-id";
  headerRow.appendChild(headerID);

  // Sprite row
  const spriteRow = document.createElement("tr");
  table.appendChild(spriteRow);
  const spriteCell = document.createElement("td");
  spriteCell.colSpan = 2;

  const sprite = document.createElement("img");
  sprite.id = "sprite-img";
  sprite.src = pokemon.sprite;
  sprite.alt = pokemon.name + " sprite";

  spriteCell.appendChild(sprite);
  spriteRow.appendChild(spriteCell);

  // Loops through the rest of the data and creates a row for each property and value from the filterPokemonData function
  for (const pokemonInfo in pokemon) {
    if (pokemonInfo !== "name" && pokemonInfo !== "id" && pokemonInfo !== "sprite") {
      // create row
      const row = document.createElement("tr");
      table.appendChild(row);
      // create cell for the property (type, weight, height, base_experience)
      const pokemonProperty = document.createElement("td");
      pokemonProperty.textContent = pokemonInfo;
      row.appendChild(pokemonProperty);

      // create cell for the value
      const pokemonValue = document.createElement("td");
      pokemonValue.textContent = pokemon[pokemonInfo];
      row.appendChild(pokemonValue);
    }
  }
}
