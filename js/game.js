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
<<<<<<< HEAD
let timer;
let running = false;
let currentWord = "";
=======
let currentWord = 0;
let timer;
let running = false;
let gameWords = [];
>>>>>>> team/main

const wordBox = document.getElementById("wordBox");
const input = document.getElementById("typingInput");
const scoreText = document.getElementById("scoreText");
const timeText = document.getElementById("timeText");
const accuracyText = document.getElementById("accuracyText");
const message = document.getElementById("messageText");
const userStatus = document.getElementById("userStatus");
<<<<<<< HEAD
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
  let newWord;

  do {
    newWord = words[Math.floor(Math.random() * words.length)];
  } while (newWord === currentWord && words.length > 1);

  currentWord = newWord;
=======

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
>>>>>>> team/main
}

function displayWords() {
  wordBox.innerHTML = "";
<<<<<<< HEAD

  const span = document.createElement("span");

  span.innerText = currentWord;
  span.className = "current-word";

  wordBox.appendChild(span);
=======
  
  gameWords.forEach((word, index) => {
    let span = document.createElement("span");
    span.innerText = word;
    span.className = "word";

    if (index === 0) {
      span.classList.add("current");
    }

    wordBox.appendChild(span);

  });
>>>>>>> team/main
}

function startGame() {
  clearInterval(timer);
<<<<<<< HEAD

=======
>>>>>>> team/main
  running = true;
  score = 0;
  time = 60;
  totalWords = 0;
  correctWords = 0;
<<<<<<< HEAD
  currentWord = "";

  scoreText.textContent = "0";
  timeText.textContent = "60";
  accuracyText.textContent = "100";
  message.textContent = "";
  gameState.textContent = "In progress";

  generateWord();
=======
  currentWord = 0;

  scoreText.textContent = 0;
  timeText.textContent = 60;
  accuracyText.textContent = 100;
  message.textContent = "";

  generateWords();
>>>>>>> team/main
  displayWords();

  input.disabled = false;
  input.value = "";
  input.focus();

<<<<<<< HEAD
  startBtn.disabled = true;

=======
>>>>>>> team/main
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
<<<<<<< HEAD

  running = false;
  input.disabled = true;
  startBtn.disabled = false;

  gameState.textContent = "Finished";

  const accuracy =
    totalWords === 0
      ? 100
      : Math.round((correctWords / totalWords) * 100);

  // Store the final result for result.html
  sessionStorage.setItem(
    "latestGameResult",
    JSON.stringify({
      username: getLoggedInUser() || "Guest",
      score: score,
      accuracy: accuracy,
      correctWords: correctWords,
      totalWords: totalWords,
      difficulty: document.getElementById("difficultyText").textContent
    })
  );

  saveScore();

  // Go to the result page
  window.location.href = "result.html";
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
=======
  running = false;
  input.disabled = true
  message.innerHTML = "Game Over!<br>Final Score : " + score;
  saveScore();
}

function saveScore() {
  const username = localStorage.getItem("currentUser");
  if (!username) return;
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
>>>>>>> team/main

  scores.push({
    username: username,
    score: score
  });

<<<<<<< HEAD
  scores.sort(function (a, b) {
    return b.score - a.score;
  });
=======
  scores.sort((a, b) => b.score - a.score);
>>>>>>> team/main

  localStorage.setItem("scores", JSON.stringify(scores));
}

input.addEventListener("keydown", function (e) {
<<<<<<< HEAD

  if (e.key !== "Enter") return;
=======
  if (e.key !== " ") return;
>>>>>>> team/main

  e.preventDefault();

  if (!running) return;

  let typed = input.value.trim();

  totalWords++;

<<<<<<< HEAD
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
=======
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
>>>>>>> team/main
