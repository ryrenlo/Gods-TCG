const gods = [
  {
    name: "God of War",
    atk: 2,
    def: 2,
    spd: 2,
    hp: 4,
    Image: "imagh/warrior.png",
  },
  {
    name: "God of Hunt",
    atk: 3,
    def: 1,
    spd: 2,
    hp: 2,
    Image: "imagh/archer.png",
  },
  {
    name: "God of Sky",
    atk: 3,
    def: 1,
    spd: 2,
    hp: 2,
    Image: "imagh/zeus.png",
  },
  { name: "God of Sea", atk: 2, def: 3, spd: 1, hp: 6, Image: "imagh/.png" },
  {
    name: "God of Underworld",
    atk: 3,
    def: 2,
    spd: 1,
    hp: 4,
    Image: "imagh/.png",
  },
];
var combine = null;
// whose turn to attack: 0 = player (combine[0]), 1 = computer (combine[1])
var currentTurn = 0;
// prevent overlapping battle calls
var isBattling = false;
// guard to avoid scheduling multiple end-of-battle messages
var endScheduled = false;
const cards = document.getElementById("cards");
var PlayerChoice = null;
var ComputerChoice = null;
// Select the battle button by class (safer) and guard against missing element
const battlebutton = document.querySelector(".battle-button");

function choose(cardNo, data) {
  PlayerChoice = data[cardNo];
  console.log(PlayerChoice);
  cards.innerHTML = "";
  ComputerChoice = AIchoose(gods);
  console.log(ComputerChoice);
  // keep a combined pair for battle calculations
  combine = [PlayerChoice, ComputerChoice];
  ShowBattle(ComputerChoice, PlayerChoice);
}

function PageLoad() {
  if (battlebutton) battlebutton.style.display = "none";
  PlayerCards = ChooseRandom(gods);
  console.log(PlayerCards);
  ShowCards(PlayerCards);
  combine = [PlayerChoice, ComputerChoice];
}

function ChooseRandom(data) {
  var GodsChosen = [];
  var UsedNumbers = new Set();
  while (GodsChosen.length < 3) {
    var RandomNumber = Math.floor(Math.random() * data.length);
    if (!UsedNumbers.has(RandomNumber)) {
      GodsChosen.push(data[RandomNumber]);
      UsedNumbers.add(RandomNumber);
    }
  }
  return GodsChosen;
}

function AIchoose(data) {
  var RandomNumber = Math.floor(Math.random() * data.length);
  return data[RandomNumber];
}

function ShowCards(GodsChosen) {
  for (const [index, item] of GodsChosen.entries()) {
    // Create the main card div
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => choose(index, GodsChosen);

    // Create the border image
    const cardBorder = document.createElement("img");
    cardBorder.src = "imagh/Border.jpg";
    cardBorder.alt = "Card Border";
    cardBorder.width = 275;
    cardBorder.height = 375;
    cardBorder.className = "card-border";

    // Create the title
    const title = document.createElement("h3");
    title.textContent = item.name;

    // Create the character image
    const characterImg = document.createElement("img");
    characterImg.src = item.Image;
    characterImg.width = 100;
    characterImg.height = 100;

    // Create the stats div
    const stats = document.createElement("div");
    stats.className = "stats";

    // Create stat paragraphs
    const atkStat = document.createElement("p");
    atkStat.innerHTML = `Atk: ${item.atk}&#9733 / 3&#9733`;

    const defStat = document.createElement("p");
    defStat.innerHTML = `Def: ${item.def}&#9733 / 3&#9733`;

    const spdStat = document.createElement("p");
    spdStat.innerHTML = `Spd: ${item.spd}&#9733 / 3&#9733`;

    // Append stat paragraphs to stats div
    stats.appendChild(atkStat);
    stats.appendChild(defStat);
    stats.appendChild(spdStat);

    // Append all elements to the card
    card.appendChild(cardBorder);
    card.appendChild(title);
    card.appendChild(characterImg);
    card.appendChild(stats);

    // Finally, append the card to the body or any other container
    cards.appendChild(card);
    // Or to a specific container: document.getElementById('container').appendChild(card);
  }
}
const battleDiv = document.getElementById("Battle");
function ShowBattle(ComputerChoice, PlayerChoice) {
  console.log("testing 1...2...3...");
  if (battlebutton) battlebutton.style.display = "flex";
  document.getElementById("ChooseYourGOD").style.display = "none";
  // clear previous battle cards
  if (battleDiv) battleDiv.innerHTML = "";

  // Store original HP for HP bar scaling
  // Preserve original HP only if not already set (so we keep the true max)
  if (!combine[0].originalHP) combine[0].originalHP = combine[0].hp;
  if (!combine[1].originalHP) combine[1].originalHP = combine[1].hp;

  // initialize current turn: whoever has higher speed attacks first
  if (combine[0].spd > combine[1].spd) currentTurn = 0;
  else if (combine[1].spd > combine[0].spd) currentTurn = 1;
  else currentTurn = 0; // tie -> player first
  // clear any previous end-of-battle scheduling
  endScheduled = false;

  const both = [PlayerChoice, ComputerChoice];
  for (const [index, item] of both.entries()) {
    // Create the main card div
    const card = document.createElement("div");
    card.className = "card";

    // Create the border image
    const cardBorder = document.createElement("img");
    cardBorder.src = "imagh/Border.jpg";
    cardBorder.alt = "Card Border";
    cardBorder.width = 275;
    cardBorder.height = 375;
    cardBorder.className = "card-border";

    // Create the title
    const title = document.createElement("h3");
    title.textContent = item.name;

    // Create the character image
    const characterImg = document.createElement("img");
    characterImg.src = item.Image;
    characterImg.width = 100;
    characterImg.height = 100;

    // Create the stats div
    const stats = document.createElement("div");
    stats.className = "stats";

    // Create stat paragraphs
    const atkStat = document.createElement("p");
    atkStat.innerHTML = `Atk: ${item.atk}&#9733 / 3&#9733`;

    const defStat = document.createElement("p");
    defStat.innerHTML = `Def: ${item.def}&#9733 / 3&#9733`;

    const spdStat = document.createElement("p");
    spdStat.innerHTML = `Spd: ${item.spd}&#9733 / 3&#9733`;

    // Append stat paragraphs to stats div
    stats.appendChild(atkStat);
    stats.appendChild(defStat);
    stats.appendChild(spdStat);

    // Create HP bar container
    const hpBarContainer = document.createElement("div");
    hpBarContainer.className = "hp-bar-container";

    // Create HP bar fill (scale by original max HP)
    const hpBar = document.createElement("div");
    hpBar.className = "hp-bar";
    const maxHP = item.originalHP || item.hp;
    hpBar.style.width = (item.hp / maxHP) * 100 + "%";

    // Create HP text
    const hpText = document.createElement("span");
    hpText.className = "hp-text";
    hpText.textContent = `HP: ${item.hp}`;

    hpBarContainer.appendChild(hpBar);
    hpBarContainer.appendChild(hpText);

    // Append all elements to the card
    card.appendChild(cardBorder);
    card.appendChild(title);
    card.appendChild(characterImg);
    card.appendChild(stats);
    card.appendChild(hpBarContainer);

    // Finally, append the card to the body or any other container
    battleDiv.appendChild(card);
    // Or to a specific container: document.getElementById('container').appendChild(card);
  }
}

async function Battle() {
  if (isBattling) return; // prevent overlapping clicks
  if (!combine || !combine[0] || !combine[1]) return;
  isBattling = true;
  if (battlebutton) battlebutton.disabled = true;

  // determine order for this full exchange (higher speed attacks first)
  // If speeds equal, perform simultaneous attacks
  if (combine[0].spd === combine[1].spd) {
    // simultaneous: apply both damages before updating UI so bars change together
    const dmgTo0 = combine[1].atk;
    const dmgTo1 = combine[0].atk;
    combine[0].hp -= dmgTo0;
    combine[1].hp -= dmgTo1;
    updateHPBars();
    hpLeft();
    // short pause to let the player see the simultaneous change
    await sleep(400);
  } else {
    const first = combine[0].spd > combine[1].spd ? 0 : 1;
    const second = 1 - first;

    // first attack
    combine[second].hp -= combine[first].atk;
    updateHPBars();
    hpLeft();

    // pause so user can see the first hit
    await sleep(500);

    // if defender died from the first hit, end the exchange
    if (combine[second].hp <= 0) {
      isBattling = false;
      if (battlebutton) battlebutton.disabled = false;
      return;
    }

    // second attack (counter)
    combine[first].hp -= combine[second].atk;
    updateHPBars();
    hpLeft();

    // brief pause after the exchange
    await sleep(300);
  }

  isBattling = false;
  if (battlebutton) battlebutton.disabled = false;
}

function updateHPBars() {
  const cards = battleDiv.querySelectorAll(".card");
  const maxHP = [
    combine[0].hp + combine[0].atk,
    combine[1].hp + combine[1].atk,
  ]; // approximate original HP

  // Better: store original HP in combine objects
  if (!combine[0].originalHP) combine[0].originalHP = combine[0].hp + 50; // fallback
  if (!combine[1].originalHP) combine[1].originalHP = combine[1].hp + 50; // fallback

  cards.forEach((card, index) => {
    const hpBar = card.querySelector(".hp-bar");
    const hpText = card.querySelector(".hp-text");
    const currentHP = combine[index].hp;
    const maxHP = combine[index].originalHP || currentHP + 10;
    const hpPercent = Math.max(0, (currentHP / maxHP) * 100);

    if (hpBar) hpBar.style.width = hpPercent + "%";
    if (hpText) hpText.textContent = `HP: ${Math.max(0, currentHP)}`;
  });
}

function hpLeft() {
  if (endScheduled) return;

  if (combine[0].hp <= 0 && combine[1].hp <= 0) {
    endScheduled = true;
    console.log("Draw...");
    // give the browser a moment to render the updated HP bar
    setTimeout(() => {
      if (battleDiv) battleDiv.innerHTML = "<h1>A draw? Did I code that?</h1>";
      if (battlebutton) battlebutton.style.display = "none";
    }, 350);
  } else if (combine[0].hp <= 0) {
    endScheduled = true;
    console.log("DEAD");
    setTimeout(() => {
      if (battleDiv) battleDiv.innerHTML = "<h1>Haha you lost...SUCKER!</h1>";
      if (battlebutton) battlebutton.style.display = "none";
    }, 350);
  } else if (combine[1].hp <= 0) {
    endScheduled = true;
    console.log("DEAD");
    setTimeout(() => {
      if (battleDiv)
        battleDiv.innerHTML = "<h1>Congratulations you won...I think</h1>";
      if (battlebutton) battlebutton.style.display = "none";
    }, 350);
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Attach single click handler to battle button (if present)
if (battlebutton) {
  // remove any inline onclick to avoid duplicates, then add listener
  try {
    battlebutton.onclick = null;
  } catch (e) {}
  battlebutton.addEventListener("click", Battle);
}
