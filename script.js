const levels = [
  { size: 5, image: "puzzle1.jpg" },
  { size: 6, image: "puzzle2.jpg" },
  { size: 7, image: "puzzle3.jpg" }
];

let currentLevel = 0;
let tiles = [];
let emptyIndex;

const puzzle = document.getElementById("puzzle");
const message = document.getElementById("message");
const levelText = document.getElementById("levelText");

function init(level) {
  puzzle.innerHTML = "";
  message.classList.add("hidden");

  const size = levels[level].size;
  const image = levels[level].image;

  levelText.textContent = `Level ${level + 1}: ${size}x${size}`;

  puzzle.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  puzzle.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  tiles = [];

  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    if (i !== size * size - 1) {
      const x = (i % size) * (100 / size);
      const y = Math.floor(i / size) * (100 / size);

      tile.style.backgroundImage = `url(${image})`;
      tile.style.backgroundSize = `${size * 100}% ${size * 100}%`;
      tile.style.backgroundPosition = `${x}% ${y}%`;

      tile.dataset.index = i;
      tile.addEventListener("click", () => moveTile(i));
    } else {
      tile.classList.add("empty");
      emptyIndex = i;
    }

    tiles.push(tile);
    puzzle.appendChild(tile);
  }

  shuffle(size);
}

function shuffle(size) {
  for (let i = 0; i < 1000; i++) {
    const neighbors = getNeighbors(emptyIndex, size);
    const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
    swap(emptyIndex, rand);
    emptyIndex = rand;
  }
}

function getNeighbors(index, size) {
  const neighbors = [];
  const row = Math.floor(index / size);
  const col = index % size;

  if (row > 0) neighbors.push(index - size);
  if (row < size - 1) neighbors.push(index + size);
  if (col > 0) neighbors.push(index - 1);
  if (col < size - 1) neighbors.push(index + 1);

  return neighbors;
}

function moveTile(index) {
  const size = levels[currentLevel].size;
  if (getNeighbors(emptyIndex, size).includes(index)) {
    swap(index, emptyIndex);
    emptyIndex = index;
    checkWin();
  }
}

function swap(i, j) {
  [tiles[i].style.backgroundImage, tiles[j].style.backgroundImage] =
    [tiles[j].style.backgroundImage, tiles[i].style.backgroundImage];

  [tiles[i].style.backgroundPosition, tiles[j].style.backgroundPosition] =
    [tiles[j].style.backgroundPosition, tiles[i].style.backgroundPosition];
}

function checkWin() {
  const size = levels[currentLevel].size;
  let correct = true;

  for (let i = 0; i < tiles.length - 1; i++) {
    const x = (i % size) * (100 / size);
    const y = Math.floor(i / size) * (100 / size);

    if (tiles[i].style.backgroundPosition !== `${x}% ${y}%`) {
      correct = false;
      break;
    }
  }

  if (correct) {
    message.classList.remove("hidden");
  }
}

function nextLevel() {
  currentLevel++;
  if (currentLevel < levels.length) {
    init(currentLevel);
  } else {
    document.body.innerHTML = "<h1>💖 You completed all puzzles! 💖</h1>";
  }
}

init(currentLevel);
