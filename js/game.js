const words = [
  "apple", "banana", "orange", "keyboard", "computer", "javascript",
  "coding", "developer", "internet", "browser", "window", "docker",
  "github", "network", "student", "holiday", "summer", "winter",
  "school", "coffee", "monitor", "python", "software", "hardware",
  "science", "rocket", "planet", "future", "algorithm", "database",
  "website", "frontend", "backend", "security", "typing", "gaming"
];

let score = 0;
let time = 60;
let totalWords = 0;
let correctWords = 0;
let timer;
let running = false;
let currentWord = "";

const wordBox = document.getElementById("wordBox");
const input = document.getElementById("typingInput");
const scoreText = document.getElementById("scoreText");
const timeText = document.getElementById("timeText");
const accuracyText = document.getElementById("accuracyText");
const message = document.getElementById("messageText");
const userStatus = document.getElementById("userStatus");
const gameState = document.getElementById("gameState");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

function getLoggedInUser() {
  const localUser = localStorage.getItem("currentUser");
  const sessionUser = sessionStorage.getItem("loggedInUser");

  return localUser || sessionUser;
}

function loadUser() {
  const user = getLoggedInUser();

  if (user) {
    userStatus.textContent = user;
  } else {
    userStatus.textContent = "Guest";
  }
}

function loadDifficulty() {
  const savedDifficulty =
    localStorage.getItem("difficulty") ||
    localStorage.getItem("selectedDifficulty") ||
    "Easy";

  document.getElementById("difficultyText").textContent = savedDifficulty;
}

function generateWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
}

function displayWords() {
  wordBox.innerHTML = "";

  const span = document.createElement("span");

  span.innerText = currentWord;
  span.className = "current-word";

  wordBox.appendChild(span);
}

function startGame() {
  clearInterval(timer);

  running = true;
  score = 0;
  time = 60;
  totalWords = 0;
  correctWords = 0;
  currentWord = 0;

  scoreText.textContent = "0";
  timeText.textContent = "60";
  accuracyText.textContent = "100";
  message.textContent = "";
  gameState.textContent = "In progress";

  generateWord();
  displayWords();

  input.disabled = false;
  input.value = "";
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

function restartGame() {
  startGame();
}

function endGame() {
  clearInterval(timer);

  running = false;
  input.disabled = true;
  startBtn.disabled = false;

  gameState.textContent = "Finished";
  message.textContent = "Game over! Final score: " + score;

  saveScore();
}

function saveScore() {
  const username = getLoggedInUser();

  if (!username) {
    return;
  }

  let scores;

  try {
    scores = JSON.parse(localStorage.getItem("scores")) || [];
  } catch (error) {
    scores = [];
  }

  scores.push({
    username: username,
    score: score
  });

  scores.sort(function (a, b) {
    return b.score - a.score;
  });

  localStorage.setItem("scores", JSON.stringify(scores));
}

input.addEventListener("keydown", function (e) {

  if (e.key !== "Enter") return;

  e.preventDefault();

  if (!running) return;

  let typed = input.value.trim();

  totalWords++;

  if (typed.toLowerCase() === currentWord.toLowerCase()) {

    score += 10;
    correctWords++;

    message.textContent = "Correct!";
    message.style.color = "green";

  } else {

    message.textContent =
      "Wrong! The word was " + currentWord;

    message.style.color = "red";
  }

  scoreText.textContent = score;

  accuracyText.textContent =
    Math.round(correctWords / totalWords * 100);

  input.value = "";

  generateWord();
  displayWords();

});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

loadUser();
loadDifficulty();