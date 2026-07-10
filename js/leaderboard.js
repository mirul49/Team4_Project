const STORAGE_KEY = 'typerush-leaderboard';

let leaderboardScores = [];
let activeTimeLimit = 20;

function loadScores() {
  try {
    const savedScores = localStorage.getItem(STORAGE_KEY);
    if (!savedScores) return [];

    const parsed = JSON.parse(savedScores);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Unable to load leaderboard scores:', error);
    return [];
  }
}

function saveScores(scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

function sortScores(scores) {
  return [...scores].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    return a.timeLimit - b.timeLimit;
  });
}

function renderLeaderboard() {
  const tableBody = document.getElementById('leaderboardTable');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const notSignedInBox = document.getElementById('notSignedInBox');
  const leaderboardBox = document.getElementById('leaderboardBox');

  if (!tableBody) return;

  const currentUser = localStorage.getItem('typerush-current-user');
  const isSignedIn = Boolean(currentUser && currentUser.trim());

  if (isSignedIn) {
    notSignedInBox.style.display = 'none';
    leaderboardBox.style.display = 'block';
    welcomeMessage.textContent = `Welcome back, ${currentUser}!`;
  } else {
    notSignedInBox.style.display = 'block';
    leaderboardBox.style.display = 'block';
    welcomeMessage.textContent = 'Leaderboard';
  }

  const filteredScores = leaderboardScores.filter((entry) => entry.timeLimit === activeTimeLimit);

  if (!filteredScores.length) {
    tableBody.innerHTML = `<tr><td colspan="3">No scores yet for the ${activeTimeLimit}s mode.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filteredScores
    .map((entry, index) => `
      <tr>
        <td>#${index + 1}</td>
        <td>${entry.username}</td>
        <td>${entry.score} pts (${entry.accuracy}% accuracy)</td>
      </tr>
    `)
    .join('');
}

function goToLogin() {
  window.location.href = 'login.html';
}

function initLeaderboard() {
  leaderboardScores = loadScores();
  document.querySelectorAll('.difficulty-btn').forEach((button) => {
    button.addEventListener('click', () => {
      activeTimeLimit = Number(button.dataset.timelimit) || 25;
      document.querySelectorAll('.difficulty-btn').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      renderLeaderboard();
    });
  });

  renderLeaderboard();
}

window.goToLogin = goToLogin;
window.addEventListener('DOMContentLoaded', initLeaderboard);
