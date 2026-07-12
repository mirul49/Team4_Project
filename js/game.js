const words = [
  "apple", "banana", "orange", "keyboard", "computer", "javascript", "coding",
  "developer", "internet", "browser", "window", "docker", "github", "network",
  "student", "holiday", "summer", "winter", "school", "coffee", "monitor", "python", 
  "software", "hardware", "science", "rocket", "planet", "future", "algorithm", 
  "database", "website", "frontend", "backend", "security", "typing", "gaming"
];

let score = 0;
let time = 0;
let totalWords = 0;
let correctWords = 0;
let timer = null;
let running = false;
let currentWord = "";
let selectedDifficulty = "";

const wordBox = document.getElementById("wordBox");
const input = document.getElementById("typingInput");
const scoreText = document.getElementById("scoreText");
const timeText = document.getElementById("timeText");
const accuracyText = document.getElementById("accuracyText");
const message = document.getElementById("messageText");
const userStatus = document.getElementById("userStatus");
const difficultyText = document.getElementById("difficultyText");
const gameState = document.getElementById("gameState");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");


/* Get logged-in player */
function getLoggedInUser() {
  const localUser = localStorage.getItem("currentUser");
  const sessionUser = sessionStorage.getItem("loggedInUser");

  return localUser || sessionUser;
}


/* Display player name */
function loadUser() {
  const user = getLoggedInUser();

  if (user) {
    userStatus.textContent = user;
  } else {
    userStatus.textContent = "Guest";
  }
}


/* Read difficulty selected on settings.html */
function loadDifficulty() {
  selectedDifficulty =
    localStorage.getItem("selectedDifficulty") ||
    localStorage.getItem("difficulty") ||
    "";

  /*
    If no difficulty was selected,
    send the user to settings.html first.
  */
  if (!selectedDifficulty) {
    window.location.href = "settings.html";
    return;
  }

  difficultyText.textContent = selectedDifficulty;
  time = getDifficultyTime();

  timeText.textContent = time;
}


/* Return the correct game time */
function getDifficultyTime() {
  if (selectedDifficulty === "Medium") {
    return 45;
  }

  if (selectedDifficulty === "Hard") {
    return 30;
  }

  return 60;
}


/* Generate a word without immediate repetition */
function generateWord() {
  let newWord;

  do {
    newWord =
      words[Math.floor(Math.random() * words.length)];
  } while (
    newWord === currentWord &&
    words.length > 1
  );

  currentWord = newWord;
}


/* Display the current word */
function displayWord() {
  wordBox.innerHTML = "";

  const wordSpan = document.createElement("span");

  wordSpan.textContent = currentWord;
  wordSpan.className = "current-word";

  wordBox.appendChild(wordSpan);
}


/* Start the game */
function startGame() {
  /*
    Check again in case difficulty was removed
    after the page loaded.
  */
  selectedDifficulty =
    localStorage.getItem("selectedDifficulty") ||
    localStorage.getItem("difficulty") ||
    "";

  if (!selectedDifficulty) {
    window.location.href = "settings.html";
    return;
  }

  clearInterval(timer);

  running = true;
  score = 0;
  totalWords = 0;
  correctWords = 0;
  currentWord = "";
  time = getDifficultyTime();

  difficultyText.textContent = selectedDifficulty;
  scoreText.textContent = "0";
  timeText.textContent = time;
  accuracyText.textContent = "100";

  message.textContent = "";
  message.style.color = "";

  gameState.textContent = "In progress";

  generateWord();
  displayWord();

  input.disabled = false;
  input.value = "";
  input.placeholder =
    "Type the word and press Enter";

  input.focus();

  startBtn.disabled = true;

  timer = setInterval(function () {
    time--;

    timeText.textContent = time;

    if (time <= 0) {
      endGame();
    }
  }, 1000);
}


/* Restart using the same selected difficulty */
function restartGame() {
  clearInterval(timer);

  running = false;
  score = 0;
  totalWords = 0;
  correctWords = 0;
  currentWord = "";
  time = getDifficultyTime();

  scoreText.textContent = "0";
  timeText.textContent = time;
  accuracyText.textContent = "100";

  input.disabled = true;
  input.value = "";
  input.placeholder = "Press Start Game...";

  wordBox.textContent =
    "Press Start Game to begin.";

  gameState.textContent = "Ready";

  message.textContent = "";
  message.style.color = "";

  startBtn.disabled = false;
}


/* Finish the game */
function endGame() {
  clearInterval(timer);

  running = false;
  input.disabled = true;
  startBtn.disabled = false;

  gameState.textContent = "Finished";

  const accuracy =
    totalWords === 0
      ? 100
      : Math.round(
        (correctWords / totalWords) * 100
      );

  const result = {
    username: getLoggedInUser() || "Guest",
    score: score,
    accuracy: accuracy,
    correctWords: correctWords,
    totalWords: totalWords,
    difficulty: selectedDifficulty
  };

  sessionStorage.setItem(
    "latestGameResult",
    JSON.stringify(result)
  );

  saveScore();

  window.location.href = "result.html";
}


/* Save score for leaderboard */
function saveScore() {
  const username = getLoggedInUser();

  if (!username) {
    return;
  }

  let scores = [];

  try {
    scores =
      JSON.parse(
        localStorage.getItem("scores")
      ) || [];

    if (!Array.isArray(scores)) {
      scores = [];
    }
  } catch (error) {
    scores = [];
  }

  scores.push({
    username: username,
    score: score,
    difficulty: selectedDifficulty
  });

  scores.sort(function (first, second) {
    return second.score - first.score;
  });

  localStorage.setItem(
    "scores",
    JSON.stringify(scores)
  );
}


/* Check submitted word */
input.addEventListener(
  "keydown",
  function (event) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (!running) {
      return;
    }

    const typedWord = input.value.trim();

    if (typedWord === "") {
      return;
    }

    totalWords++;

    if (
      typedWord.toLowerCase() ===
      currentWord.toLowerCase()
    ) {
      score += 10;
      correctWords++;

      message.textContent = "Correct!";
      message.style.color = "green";
    } else {
      message.textContent =
        "Wrong! The word was " +
        currentWord;

      message.style.color = "red";
    }

    const accuracy = Math.round(
      (correctWords / totalWords) * 100
    );

    scoreText.textContent = score;
    accuracyText.textContent = accuracy;

    input.value = "";

    generateWord();
    displayWord();
  }
);


/* Button connections */
startBtn.addEventListener(
  "click",
  startGame
);

restartBtn.addEventListener(
  "click",
  restartGame
);


/* Load page information */

loadUser();
loadDifficulty();
