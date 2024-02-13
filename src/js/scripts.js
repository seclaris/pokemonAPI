const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const section = document.querySelector("section");
const errorMessage = document.querySelector("#error-message");

// Fetch the pokemon API
async function fetchPokemon() {
  const userInput = await searchInput.value.toLowerCase().trim();

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${userInput}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon with status: ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

// Filter the pokemon data to display
function filterPokemonData(data) {
  const pokemonData = {
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    id: "#" + data.id,
    sprite: data.sprites.front_default,
    Type: data.types.map((type) => type.type.name).join(", "), // Array of types - git co-pilot
    Weight: data.weight,
    Height: data.height,
    Base_experience: data.base_experience,
  };
  return pokemonData;
}

// Event listener for the search button
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
    console.error(error);
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

// Display the pokemon data
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

  // Name
  const headerName = document.createElement("th");
  headerName.textContent = pokemon.name;
  headerName.classList.add("name");
  headerRow.appendChild(headerName);

  // ID
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
  sprite.alt = pokemon.name;

  spriteCell.appendChild(sprite);
  spriteRow.appendChild(spriteCell);

  // Loop through the rest of the data and create table rows
  for (const pokemonInfo in pokemon) {
    if (pokemonInfo !== "name" && pokemonInfo !== "id" && pokemonInfo !== "sprite") {
      // create row
      const row = document.createElement("tr");
      table.appendChild(row);
      // create cell for the property
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

// Clear the section
function clearSection() {
  section.innerHTML = "";
}

// Clear the section when the user clicks on the search input and types a new pokemon
searchBtn.addEventListener("click", clearSection);
