const pirateCrew = []; // Helps with tracking characters that users select

// Users can add/remove characters to/from their pirate crew
function updateCrewDisplay() {
  const placeholders = document.querySelectorAll(".placeholder");
  const averageStrengthDisplay = document.getElementById("average-strength");

  placeholders.forEach((placeholder, index) => {
    placeholder.style.backgroundImage = pirateCrew[index]
      ? `url(${pirateCrew[index].image})`
      : "";
  });
  const totalStrength = pirateCrew.reduce(
    (acc, char) => acc + char.strength,
    0
  );
  const averageStrength =
    pirateCrew.length > 0 ? (totalStrength / pirateCrew.length).toFixed(2) : 0;
  averageStrengthDisplay.textContent = `Crews Average Strength: ${averageStrength}`;
}

// Returns an array of character objects if the character meets applied filter
// criteria.
function filterCharacters() {
  const affiliation = document.getElementById("affiliation").value;
  const strength = document.getElementById("strength-slider").value;
  const faction = document.getElementById("faction").value;
  const haki = document.getElementById("haki").value;
  const emperor = document.getElementById("isEmperor").checked;
  const warlord = document.getElementById("isWarlord").checked;
  const worstgen = document.getElementById("isWorstGeneration").checked;
  const king = document.getElementById("isKing").checked;

  return characters.filter((character) => {
    return (
      (affiliation ? character.affiliation === affiliation : true) &&
      character.strength <= strength &&
      (faction ? character.faction === faction : true) &&
      (haki ? character.abilities.haki.includes(haki) : true) &&
      (!emperor || character.isEmperor === emperor) &&
      (!warlord || character.isWarlord === warlord) &&
      (!worstgen || character.isWorstGeneration === worstgen) &&
      (!king || character.isKing === king)
    );
  });
}

// Characters will be displayed in the catalog when the dom content is loaded or
// when filters are applied
function displayCharacters(characterList) {
  const catalog = document.getElementById("catalog");
  catalog.innerHTML = "";

  // Make a container for all characters in the dataset
  characterList.forEach((character) => {
    const characterContainer = document.createElement("div");
    characterContainer.className = "character-container";

    // set up name element + styling based on status
    const nameElement = document.createElement("h3");
    nameElement.innerText = character.name;
    nameElement.className = "character-name";
    if (character.isKing) {
      nameElement.classList.add("king");
    } else if (character.isAdmiral) {
      nameElement.classList.add("admiral");
    } else if (character.isEmperor) {
      nameElement.classList.add("emperor");
    } else if (character.isWorstGeneration) {
      nameElement.classList.add("worst-gen");
    } else if (character.isWarlord) {
      nameElement.classList.add("warlord");
    }

    // Set devil fruit and Haki strings
    let devilFruit = "";
    let haki = "";
    for (let key in character.abilities) {
      if (typeof character.abilities[key] === "string") {
        devilFruit += character.abilities[key];
      } else if (Array.isArray(character.abilities[key])) {
        for (let item of character.abilities[key]) {
          haki += item + " ";
        }
      }
    }
    devilFruit = devilFruit.trim();
    haki = haki.trim();

    // Build character info section
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${character.image}" alt="${character.name}"/>
      <div class="info">
        <ul class="stats">
          <li>Affiliation: <span class="stat-txt">${character.affiliation}</span></li>
          <li>Faction: <span class="stat-txt">${character.faction}</span></li>
        </ul>
      </div>
    `;
    // Characters without devil fruit or haki powers will have these
    // stats excluded from their info card
    if (devilFruit !== "") {
      const dfElement = document.createElement("li");
      dfElement.innerHTML = `Devil Fruit: <span class="stat-txt">${devilFruit}</span>`;
      card.querySelector(".stats").appendChild(dfElement);
    }
    if (haki !== "") {
      const hakiElement = document.createElement("li");
      hakiElement.innerHTML = `Haki: <span class="stat-txt">${haki}</span>`;
      card.querySelector(".stats").appendChild(hakiElement);
    }

    // Users add characters to their crew by clicking on cards,
    // They remove them by clicking on them again
    characterContainer.addEventListener("click", () => {
      // Remove the character if it already exists in pirateCrew
      if (pirateCrew.includes(character)) {
        pirateCrew.splice(pirateCrew.indexOf(character), 1);
      } else if (pirateCrew.length < 5) {
        pirateCrew.push(character);
      }
      updateCrewDisplay();
    });

    // added accessibility for mobile device users
    card.addEventListener("click", () => {
      card.classList.toggle("clicked");
    });

    // Create character container and add to catalog
    characterContainer.appendChild(nameElement);
    characterContainer.appendChild(card);
    catalog.appendChild(characterContainer);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Initially Display All Characters
  displayCharacters(characters);

  // Update displayed characters when filters are applied
  document.getElementById("filter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const filteredCharacters = filterCharacters();
    displayCharacters(filteredCharacters);
  });

  // Update strength value whenever the slider's value changes
  const slider = document.getElementById("strength-slider");
  const display = document.getElementById("strength-value");
  slider.addEventListener("input", function () {
    display.textContent = this.value;
  });

  // Handle functionality for adding characters
  const addBtn = document.getElementById("add-character");
  const addForm = document.getElementById("add-character-form");
  addBtn.addEventListener("click", () => {
    if (addForm.style.display === "none") {
      addForm.style.display = "flex";
      addBtn.innerText = "Close Form";
    } else {
      addForm.style.display = "none";
      addBtn.innerText = "Add Your Own Character";
    }
  });

  addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // build new character from form
    const newCharacter = {
      name: document.getElementById("add-name").value,
      image: document.getElementById("add-image").value,
      affiliation: document.getElementById("add-affiliation").value,
      faction: document.getElementById("add-faction").value,
      abilities: {
        devilFruit: document.getElementById("add-devilFruit").value || null,
        haki: Array.from(
          document.getElementById("add-haki").selectedOptions
        ).map((option) => option.value),
      },
      strength: parseInt(document.getElementById("add-strength").value, 10),
      isEmperor: document.getElementById("add-isEmperor").checked,
      isWarlord: document.getElementById("add-isWarlord").checked,
      isWorstGeneration: document.getElementById("add-isWorstGeneration")
        .checked,
      isAdmiral: document.getElementById("add-isAdmiral").checked,
      isKing: false, // New characters are always false for isKing
    };

    // add the character to dataset
    characters.push(newCharacter);
    displayCharacters(characters);
    addForm.style.display = "none";
    addForm.reset();
    addBtn.innerText = "Add Your Own Character";
  });
});
