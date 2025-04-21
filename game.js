// Redirect to index.html only if no mode is selected
if (!localStorage.getItem('guessMax')) {
  window.location.replace('index.html');
} else {
  // Only run the game logic if a mode is selected
  // Get max range from localStorage or default to 10
  let maxRange = parseInt(localStorage.getItem('guessMax')) || 10;
  let secretNumber = Math.floor(Math.random() * maxRange) + 1;
  let attempts = 0;
  let startTime = Date.now();
  let bestGuesses = null;
  let bestTime = null;
  const leaderboardKey = "guessingLeaderboard_" + maxRange;

  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");

  correctSound.volume = 1.0;
  wrongSound.volume = 1.0;

  document.getElementById("gameTitle").textContent = `🎯 Guess the Number (1–${maxRange})`;
  document.getElementById("guess").setAttribute("max", maxRange);

  // Add event listener for Enter key on the input
  const guessInput = document.getElementById("guess");
  guessInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission or page reload
      makeGuess();
    }
  });

  function makeGuess() {
    const input = document.getElementById("guess");
    const guess = parseInt(input.value);
    const message = document.getElementById("message");
    const scoreboard = document.getElementById("scoreboard");
    attempts++;

    message.classList.remove("shake");
    void message.offsetWidth; // Trigger reflow for animation

    // Clear the input after each guess (unless correct) and refocus
    if (isNaN(guess)) {
      message.textContent = "⚠️ Please enter a valid number.";
      message.classList.add("shake");
      wrongSound.currentTime = 0;
      wrongSound.play().catch((error) => console.error("Error playing wrong sound:", error));
      input.value = "";
      input.focus();
      return;
    }

    if (guess < secretNumber) {
      message.textContent = "📉 Too low! Try again.";
      message.classList.add("shake");
      wrongSound.currentTime = 0;
      wrongSound.play().catch((error) => console.error("Error playing wrong sound:", error));
      input.value = "";
      input.focus();
    } else if (guess > secretNumber) {
      message.textContent = "📈 Too high! Try again.";
      message.classList.add("shake");
      wrongSound.currentTime = 0;
      wrongSound.play().catch((error) => console.error("Error playing wrong sound:", error));
      input.value = "";
      input.focus();
    } else {
      correctSound.currentTime = 0;
      correctSound.play().catch((error) => console.error("Error playing correct sound:", error));
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      message.textContent = `✅ Correct! The number was ${secretNumber}`;
      message.classList.add("pop");

      let recordMsg = "";
      if (bestGuesses === null || attempts < bestGuesses) {
        bestGuesses = attempts;
        recordMsg += "🥇 New record: Fewest guesses!\n";
      }
      if (bestTime === null || timeTaken < bestTime) {
        bestTime = timeTaken;
        recordMsg += "⏱️ New record: Fastest time!\n";
      }

      scoreboard.textContent = `📊 ${attempts} guesses in ${timeTaken} seconds.\n${recordMsg}`;

      const playerName = prompt("🎉 You won! Enter your name for the leaderboard:");
      if (playerName) {
        saveToLeaderboard(playerName, attempts, timeTaken);
      }
    }
  }

  function resetGame() {
    secretNumber = Math.floor(Math.random() * maxRange) + 1;
    attempts = 0;
    startTime = Date.now();
    document.getElementById("message").textContent = "";
    document.getElementById("scoreboard").textContent = "";
    document.getElementById("guess").value = "";
  }

  function goToMode() {
    window.location.href = 'index.html';
  }

  function saveToLeaderboard(name, guesses, time) {
    const entry = { name, guesses, time: parseFloat(time) };
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    leaderboard.push(entry);
    leaderboard.sort((a, b) => a.guesses - b.guesses || a.time - b.time);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
    renderLeaderboard();
  }

  function renderLeaderboard() {
    const list = document.getElementById("leaderboardList");
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    list.innerHTML = leaderboard
      .map(
        (entry, index) =>
          `<li>#${index + 1} ${entry.name} - ${entry.guesses} guesses in ${entry.time}s</li>`
      )
      .join("");
  }

  // Expose functions to global scope
  window.makeGuess = makeGuess;
  window.resetGame = resetGame;
  window.goToMode = goToMode;

  renderLeaderboard();
}