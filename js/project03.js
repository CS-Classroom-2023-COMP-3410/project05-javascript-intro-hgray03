// -------------------------------
// Global Variables & Setup
// -------------------------------
const cardGrid = document.getElementById("card-grid");
const movesElement = document.getElementById("moves");
const timeElement = document.getElementById("time");
const restartBtn = document.getElementById("restart-btn");

// Define an array of symbols (8 pairs = 16 cards total)
const symbols = ["🐱", "🐱", "🐶", "🐶", "🐵", "🐵", "🐸", "🐸",
                 "🦊", "🦊", "🐮", "🐮", "🐔", "🐔", "🐝", "🐝"];

let shuffledSymbols = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let movesCount = 0;
let matchedPairs = 0;

// Timer variables
let timerInterval = null;
let timeElapsed = 0; // in seconds

// -------------------------------
// Initialization
// -------------------------------
window.addEventListener("DOMContentLoaded", () => {
  restartGame();
  restartBtn.addEventListener("click", restartGame);
});

// -------------------------------
// Game Setup Functions
// -------------------------------
function restartGame() {
  // Stop any existing timer
  clearInterval(timerInterval);
  timeElapsed = 0;
  timeElement.textContent = `Time: 0s`;

  // Reset stats
  movesCount = 0;
  matchedPairs = 0;
  movesElement.textContent = `Moves: 0`;

  // Shuffle symbols
  shuffledSymbols = shuffleArray([...symbols]);

  // Clear board
  cardGrid.innerHTML = "";

  // Create cards
  shuffledSymbols.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    // Use data attribute to store the symbol
    card.setAttribute("data-symbol", symbol);
    card.setAttribute("data-index", index);

    // Card front content (the hidden symbol)
    const symbolSpan = document.createElement("span");
    symbolSpan.classList.add("symbol");
    symbolSpan.textContent = symbol;

    // Add to DOM
    card.appendChild(symbolSpan);
    cardGrid.appendChild(card);

    // Add event listener
    card.addEventListener("click", handleCardClick);
  });
}

// -------------------------------
// Card Interaction
// -------------------------------
function handleCardClick(e) {
  const card = e.currentTarget;

  // If board is locked (we're checking two open cards), ignore clicks
  if (lockBoard) return;
  // If card is already flipped or matched, ignore
  if (card.classList.contains("flipped") || card.classList.contains("match")) {
    return;
  }

  // Start timer if it hasn't started yet
  if (movesCount === 0 && !timerInterval) {
    startTimer();
  }

  // Flip the card
  card.classList.add("flipped");

  // If firstCard isn't set, set it and return
  if (!firstCard) {
    firstCard = card;
    return;
  }

  // If we get here, it means firstCard is set, so this is the second card
  secondCard = card;

  // Increase move count
  movesCount++;
  movesElement.textContent = `Moves: ${movesCount}`;

  // Check for a match
  checkForMatch();
}

function checkForMatch() {
  const symbol1 = firstCard.getAttribute("data-symbol");
  const symbol2 = secondCard.getAttribute("data-symbol");

  if (symbol1 === symbol2) {
    // It's a match!
    firstCard.classList.add("match");
    secondCard.classList.add("match");

    matchedPairs++;
    resetFlips();

    // Check for game completion
    if (matchedPairs === symbols.length / 2) {
      // All pairs found!
      clearInterval(timerInterval);
      setTimeout(() => {
        alert(`You did it!\nMoves: ${movesCount}\nTime: ${timeElapsed}s`);
      }, 500);
    }
  } else {
    // Not a match, lock the board until they're flipped back
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetFlips();
    }, 1000);
  }
}

function resetFlips() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// -------------------------------
// Timer Functions
// -------------------------------
function startTimer() {
  timeElapsed = 0;
  timerInterval = setInterval(() => {
    timeElapsed++;
    timeElement.textContent = `Time: ${timeElapsed}s`;
  }, 1000);
}

// -------------------------------
// Utility: Shuffle Array
// -------------------------------
function shuffleArray(arr) {
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[rand]] = [arr[rand], arr[i]];
  }
  return arr;
}
