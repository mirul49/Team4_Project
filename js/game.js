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
let currentWord = 0;
let timer;
let running = false;
let gameWords = [];

const wordBox = document.getElementById("wordBox");
const input = document.getElementById("typingInput");
const scoreText = document.getElementById("scoreText");
const timeText = document.getElementById("timeText");
const accuracyText = document.getElementById("accuracyText");
const message = document.getElementById("messageText");
const userStatus = document.getElementById("userStatus");

function loadUser() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    userStatus.textContent = "Signed in as " + user;
  }
}

loadUser();

function generateWords() {
  gameWords = [];
  for (let i = 0; i < 40; i++) {
    gameWords.push(
      words[Math.floor(Math.random() * words.length)]
    );
  }
}

function displayWords() {
  wordBox.innerHTML = "";
  
  gameWords.forEach((word, index) => {
    let span = document.createElement("span");
    span.innerText = word;
    span.className = "word";

    if (index === 0) {
      span.classList.add("current");
    }

    wordBox.appendChild(span);

  });
}

function startGame() {
  clearInterval(timer);
  running = true;
  score = 0;
  time = 60;
  totalWords = 0;
  correctWords = 0;
  currentWord = 0;

  scoreText.textContent = 0;
  timeText.textContent = 60;
  accuracyText.textContent = 100;
  message.textContent = "";

  generateWords();
  displayWords();

  input.disabled = false;
  input.value = "";
  input.focus();

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
  input.disabled = true
  message.innerHTML = "Game Over!<br>Final Score : " + score;
  saveScore();
}

function saveScore() {
  const username = localStorage.getItem("currentUser");
  if (!username) return;
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.push({
    username: username,
    score: score
  });

  scores.sort((a, b) => b.score - a.score);

  localStorage.setItem("scores", JSON.stringify(scores));
}

input.addEventListener("keydown", function (e) {
  if (e.key !== " ") return;

  e.preventDefault();

  if (!running) return;

  let typed = input.value.trim();

  totalWords++;

  const spans = document.querySelectorAll(".word");

  if (typed === gameWords[currentWord]) {
    score += 10;
    correctWords++;
    spans[currentWord].classList.remove("current");
    spans[currentWord].classList.add("correct");
  } else {
    spans[currentWord].classList.remove("current");
    spans[currentWord].classList.add("wrong");
  }

  currentWord++;

  if (currentWord >= gameWords.length) {
    generateWords();
    displayWords();
    currentWord = 0;
  } else {
    spans[currentWord].classList.add("current");
  }

  scoreText.textContent = score;
  accuracyText.textContent = Math.round(correctWords / totalWords * 100);
  input.value = "";
});

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", restartGame);
