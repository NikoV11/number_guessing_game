// Multiplayer Number Guessing Game Logic
let playerNames = ["", ""];
let currentPlayer = 0;
let secretNumber = 0;
let attempts = [0, 0];
let gameActive = false;

// Sound effects
const correctSound = new Audio('sounds/correct.MP3');
const wrongSound = new Audio('sounds/wrong.MP3');
correctSound.volume = 1.0;
wrongSound.volume = 0.5;

const setupDiv = document.getElementById("setup");
const gameArea = document.getElementById("gameArea");
const turnInfo = document.getElementById("turnInfo");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const feedback = document.getElementById("feedback");
const historyDiv = document.getElementById("history");
const restartBtn = document.getElementById("restartBtn");

// Add event listeners for Enter key on name inputs
const player1NameInput = document.getElementById("player1Name");
const player2NameInput = document.getElementById("player2Name");

player1NameInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    player2NameInput.focus();
  }
});

player2NameInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("startBtn").click();
  }
});

function startGame() {
  const p1 = document.getElementById("player1Name").value.trim();
  const p2 = document.getElementById("player2Name").value.trim();
  if (!p1 || !p2) {
    alert("Both players must enter their names.");
    return;
  }
  playerNames = [p1, p2];
  currentPlayer = 0;
  secretNumber = Math.floor(Math.random() * 1000) + 1;
  attempts = [0, 0];
  gameActive = true;
  setupDiv.style.display = "none";
  gameArea.style.display = "block";
  feedback.textContent = "";
  historyDiv.textContent = "";
  restartBtn.style.display = "none";
  guessInput.value = "";
  guessInput.disabled = false;
  guessBtn.disabled = false;
  updateTurnInfo();
  guessInput.focus();
}

function updateTurnInfo() {
  turnInfo.textContent = `It's ${playerNames[currentPlayer]}'s turn!`;
}

function handleGuess() {
  if (!gameActive) return;
  const guess = parseInt(guessInput.value);
  if (isNaN(guess) || guess < 1 || guess > 1000) {
    feedback.textContent = "⚠️ Enter a valid number between 1 and 1000.";
    wrongSound.currentTime = 0;
    wrongSound.play().catch(() => {});
    guessInput.value = "";
    guessInput.focus();
    return;
  }
  attempts[currentPlayer]++;
  let msg = "";
  if (guess < secretNumber) {
    msg = "📉 Too low!";
    wrongSound.currentTime = 0;
    wrongSound.play().catch(() => {});
  } else if (guess > secretNumber) {
    msg = "📈 Too high!";
    wrongSound.currentTime = 0;
    wrongSound.play().catch(() => {});
  } else {
    msg = `🎉 Correct! ${playerNames[currentPlayer]} wins in ${attempts[currentPlayer]} turns!`;
    correctSound.currentTime = 0;
    correctSound.play().catch(() => {});
    gameActive = false;
    guessInput.disabled = true;
    guessBtn.disabled = true;
    restartBtn.style.display = "inline-block";
    showHistory();
    feedback.textContent = msg;
    return;
  }
  feedback.textContent = msg;
  showHistory();
  guessInput.value = "";
  currentPlayer = 1 - currentPlayer;
  updateTurnInfo();
  guessInput.focus();
}

function showHistory() {
  historyDiv.innerHTML = `<b>${playerNames[0]}:</b> ${attempts[0]} guesses<br><b>${playerNames[1]}:</b> ${attempts[1]} guesses`;
}

document.getElementById("startBtn").onclick = startGame;
document.getElementById("guessBtn").onclick = handleGuess;
restartBtn.onclick = () => {
  setupDiv.style.display = "block";
  gameArea.style.display = "none";
  document.getElementById("player1Name").value = "";
  document.getElementById("player2Name").value = "";
};

guessInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    handleGuess();
  }
});