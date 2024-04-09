const selectedCharacters = []; // Helps with tracking characters that users select

document.addEventListener("DOMContentLoaded", () => {
  const catalog = document.getElementById("catalog");
  const placeholders = document.querySelectorAll('.placeholder');
  const averageStrengthDisplay = document.getElementById('average-strength');

  function updateCrewDisplay() {
    placeholders.forEach((placeholder, index) => {
      placeholder.style.backgroundImage = selectedCharacters[index] ? `url(${selectedCharacters[index].image})` : '';
    });
    const totalStrength = selectedCharacters.reduce((acc, char) => acc + char.strength, 0);
    const averageStrength = selectedCharacters.length > 0 ? (totalStrength / selectedCharacters.length).toFixed(2) : 0;
    averageStrengthDisplay.textContent = `Crews Average Strength: ${averageStrength}`;
  }

  function filterCharacters() {
    // const affiliation
  }

  characters.forEach((character) => {
    const characterContainer = document.createElement("div");
    characterContainer.className = "character-container";

    // set up name element + styling based on status
    const nameElement = document.createElement("h3");
    nameElement.innerText = character.name;
    nameElement.className = "character-name";
    if (character.isKing) {
      nameElement.classList.add('king');
    } else if (character.isAdmiral) {
      nameElement.classList.add('admiral')
    } else if (character.isEmperor) {
      nameElement.classList.add('emperor')
    } else if (character.isWorstGeneration) {
      nameElement.classList.add('worst-gen')
    } else if (character.isWarlord) {
      nameElement.classList.add('warlord')
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
      const dfElement = document.createElement('li');
      dfElement.innerHTML = `Devil Fruit: <span class="stat-txt">${devilFruit}</span>`;
      card.querySelector('.stats').appendChild(dfElement);
    }
    if (haki !== "") {
      const hakiElement = document.createElement('li');
      hakiElement.innerHTML = `Haki: <span class="stat-txt">${haki}</span>`;
      card.querySelector('.stats').appendChild(hakiElement);
    }

    characterContainer.addEventListener('click', () => {
      // Remove the character if it already exists in selectedCharacters
      if (selectedCharacters.includes(character)) {
        selectedCharacters.splice(selectedCharacters.indexOf(character), 1);
      } else if (selectedCharacters.length < 5) {
        selectedCharacters.push(character);
      }
      updateCrewDisplay();
    })

    // added accessibility for mobile device users
    card.addEventListener("click", () => {
      card.classList.toggle("clicked");
    });

    characterContainer.appendChild(nameElement);
    characterContainer.appendChild(card);
    catalog.appendChild(characterContainer);
  });
});
