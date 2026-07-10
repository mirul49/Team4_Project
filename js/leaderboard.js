// leaderboard.js

// This checks who is currently signed in
function getCurrentUser() {
  return localStorage.getItem("currentUser");
}


// This sends the user to the login page
function goToLogin() {
  window.location.href = "login.html";
}


// This logs the user out
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}


// This function gets the scores from localStorage
function getScores() {
  let scores = localStorage.getItem("scores");

  if (scores === null) {
    return [];
  } else {
    return JSON.parse(scores);
  }
}


// This function saves the scores into localStorage
function saveScores(scores) {
  localStorage.setItem("scores", JSON.stringify(scores));
}


// This function displays the leaderboard table
function displayLeaderboard() {
  let currentUser = getCurrentUser();

  let notSignedInBox = document.getElementById("notSignedInBox");
  let leaderboardBox = document.getElementById("leaderboardBox");
  let welcomeMessage = document.getElementById("welcomeMessage");

  // If user is not signed in, hide leaderboard and show sign in message
  if (currentUser === null || currentUser === "") {
    notSignedInBox.style.display = "block";
    leaderboardBox.style.display = "none";
    return;
  }

  // If user is signed in, show leaderboard
  notSignedInBox.style.display = "none";
  leaderboardBox.style.display = "block";

  welcomeMessage.textContent = "Welcome, " + currentUser + "!";

  let scores = getScores();

  // Sort scores from highest to lowest
  scores.sort(function(a, b) {
    return b.score - a.score;
  });

  let table = document.getElementById("leaderboardTable");

  table.innerHTML = "";

  if (scores.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="3">No scores yet.</td>
      </tr>
    `;
    return;
  }

  for (let i = 0; i < scores.length; i++) {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${scores[i].username}</td>
      <td>${scores[i].score}</td>
    `;

    table.appendChild(row);
  }
}


// This function can be used by the game page later to save a new score
function saveNewScore(username, score) {
  let scores = getScores();

  let newScore = {
    username: username,
    score: score
  };

  scores.push(newScore);

  scores.sort(function(a, b) {
    return b.score - a.score;
  });

  saveScores(scores);
}


// This button clears the whole leaderboard
function clearLeaderboard() {
  localStorage.removeItem("scores");
  displayLeaderboard();
}


// This is only for testing
// You can delete this later after the game is connected
function addTestScore() {
  let currentUser = getCurrentUser();

  if (currentUser === null || currentUser === "") {
    alert("Please sign in first.");
    window.location.href = "login.html";
    return;
  }

  let score = prompt("Enter test score:");

  if (score === "" || score === null) {
    alert("Score cannot be empty.");
    return;
  }

  score = Number(score);

  saveNewScore(currentUser, score);
  displayLeaderboard();
}


// Display leaderboard when the page opens
<<<<<<< HEAD
displayLeaderboard();
=======
displayLeaderboard();
>>>>>>> team/main
