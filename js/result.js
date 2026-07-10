// Read the latest result saved by game.js
function getLatestResult() {
  const savedResult = sessionStorage.getItem("latestGameResult");

  if (!savedResult) {
    return null;
  }

  try {
    return JSON.parse(savedResult);
  } catch (error) {
    return null;
  }
}


// Display the game result on result.html
function displayResult() {
  const result = getLatestResult();

  // No completed game result was found
  if (!result) {
    document.getElementById("resultMessage").textContent =
      "No completed game was found. Play a game to see your result.";

    document.getElementById("resultScore").textContent = "0";
    document.getElementById("resultUsername").textContent = "Guest";
    document.getElementById("resultDifficulty").textContent = "-";
    document.getElementById("resultAccuracy").textContent = "0";
    document.getElementById("resultCorrect").textContent = "0";
    document.getElementById("resultAttempts").textContent = "0";

    return;
  }

  document.getElementById("resultScore").textContent =
    result.score;

  document.getElementById("resultUsername").textContent =
    result.username;

  document.getElementById("resultDifficulty").textContent =
    result.difficulty;

  document.getElementById("resultAccuracy").textContent =
    result.accuracy;

  document.getElementById("resultCorrect").textContent =
    result.correctWords;

  document.getElementById("resultAttempts").textContent =
    result.totalWords;

  displayResultMessage(result);
}


// Display a message based on the player's accuracy
function displayResultMessage(result) {
  const message = document.getElementById("resultMessage");

  if (result.totalWords === 0) {
    message.textContent =
      "You did not enter any words. Try again and start typing!";
  } else if (result.accuracy === 100) {
    message.textContent =
      "Perfect accuracy! You completed every word correctly.";
  } else if (result.accuracy >= 80) {
    message.textContent =
      "Excellent result! Your typing was fast and accurate.";
  } else if (result.accuracy >= 60) {
    message.textContent =
      "Good attempt! Keep practising to improve your accuracy.";
  } else {
    message.textContent =
      "Keep practising! Focus on accuracy before increasing your speed.";
  }
}


// Run when result.html opens
displayResult();