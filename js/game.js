const LEADERBOARD_STORAGE_KEY = 'typerush-leaderboard';
const USERNAME_STORAGE_KEY = 'typerush-current-user';
let GAME_DURATION = 30;
let TARGET_WORD_COUNT = 25;
let includePunctuation = false;
let includeNumbers = false;
let includeCaps = false;
const WORD_BANK = [
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
  'his', 'from', 'they', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
  'one', 'all', 'would', 'there', 'their', 'what', 'about', 'which', 'when',
  'make', 'like', 'time', 'just', 'know', 'take', 'people', 'into', 'year',
  'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'new',
  'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are',
  'was', 'were', 'been', 'being', 'very', 'much', 'great', 'small', 'large',
  'world', 'place', 'found', 'under', 'again', 'before', 'right', 'left', 'while',
  'through', 'thing', 'every', 'again', 'around', 'should', 'could', 'would',
  'never', 'always', 'often', 'enough', 'really', 'better', 'friend', 'family',
  'school', 'teacher', 'student', 'home', 'house', 'city', 'country', 'water',
  'earth', 'sound', 'music', 'story', 'movie', 'game', 'play', 'learn', 'read',
  'write', 'language', 'word', 'sentence', 'computer', 'keyboard', 'typing',
  'practice', 'speed', 'accuracy', 'leaderboard', 'record', 'player', 'score'
];

let timerInterval = null;
let gameActive = false;
let timeLeft = GAME_DURATION;
let elapsedTime = 0;
let correctChars = 0;
let totalTypedChars = 0;
let currentTarget = '';
let currentInput = '';
let upcomingWords = [];
let completedWords = [];
let completedCorrectChars = 0;
let completedTotalTypedChars = 0;

const SETTINGS_KEY_MAP = {
  difficulty: 'typerush-setting-difficulty',
  blindMode: 'typerush-setting-blindMode',
  wordHistory: 'typerush-setting-wordHistory',
};

let difficultyMode = 'normal';
let blindModeEnabled = false;
let wordHistoryEnabled = false;

function calculateMatchedChars(input, target) {
  let matched = 0;
  const length = Math.min(input.length, target.length);
  for (let index = 0; index < length; index += 1) {
    if (input[index] === target[index]) {
      matched += 1;
    }
  }
  return matched;
}

function countNonSpaceChars(text) {
  return String(text).replace(/\s+/g, '').length;
}

function buildWord() {
  const baseWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  let word = baseWord;

  if (includeCaps && Math.random() > 0.4) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
  }

  if (includeNumbers && Math.random() > 0.7) {
    const number = Math.floor(Math.random() * 10);
    word = `${word}${number}`;
  }

  if (includePunctuation && Math.random() > 0.7) {
    const punctuation = ['.', ',', ';', ':', '!', '?'];
    word = `${word}${punctuation[Math.floor(Math.random() * punctuation.length)]}`;
  }

  return word;
}

function getCurrentUser() {
  const storedUser = localStorage.getItem(USERNAME_STORAGE_KEY);
  return storedUser && storedUser.trim() ? storedUser.trim() : '';
}

function getPlayerName() {
  const storedName = getCurrentUser();
  return storedName || 'Player';
}

function setPlayerName(name) {
  const cleanName = (name || '').trim() || getCurrentUser();
  if (!cleanName) return;
  localStorage.setItem(USERNAME_STORAGE_KEY, cleanName);
}

function handleLogout() {
  localStorage.removeItem(USERNAME_STORAGE_KEY);
  renderAuthStatus();
  updateGameMessage('You have been logged out.');
}

function renderAuthStatus() {
  const statusText = document.getElementById('userStatus');
  const descriptionText = document.getElementById('authDescription');
  const authActions = document.getElementById('authActions');
  const playerNameInput = document.getElementById('playerNameInput');
  const currentUser = getCurrentUser();

  if (statusText) {
    statusText.textContent = currentUser
      ? `Welcome ${currentUser}! You are now logged in.`
      : 'You are not signed in.';
  }

  if (descriptionText) {
    descriptionText.textContent = currentUser
      ? 'Your typing results will be tied to your account when you finish the challenge.'
      : 'Enter your name below to save your best typing result to the local leaderboard.';
  }

  if (playerNameInput) {
    playerNameInput.value = currentUser || '';
  }

  if (authActions) {
    if (currentUser) {
      authActions.innerHTML = '<button type="button" id="logoutButton">Logout</button>';
      const logoutButton = document.getElementById('logoutButton');
      if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
      }
    } else {
      authActions.innerHTML = '<a href="login.html"><button type="button">Go to Login</button></a>';
    }
  }
}

function loadLeaderboardScores() {
  try {
    const saved = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Unable to load leaderboard scores:', error);
    return [];
  }
}

function saveLeaderboardScores(scores) {
  localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(scores));
}

function sortLeaderboardScores(scores) {
  return [...scores].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
    return a.timeLimit - b.timeLimit;
  });
}

function saveBestResult(username, score, accuracy, timeLimit) {
  if (![20, 30].includes(timeLimit)) {
    updateGameMessage('Only 20s and 30s test results are saved to the leaderboard.');
    return false;
  }

  const scores = loadLeaderboardScores();
  const entry = {
    username,
    score,
    accuracy,
    timeLimit,
    wordCount: TARGET_WORD_COUNT,
    updatedAt: new Date().toISOString(),
  };
  const existingIndex = scores.findIndex(
    (item) => item.username.toLowerCase() === username.toLowerCase() && item.timeLimit === timeLimit
  );

  if (existingIndex >= 0) {
    updateGameMessage('Your previous leaderboard result for this time mode is kept; it will not be updated.');
    return false;
  }

  scores.push(entry);

  const updatedScores = sortLeaderboardScores(scores);
  saveLeaderboardScores(updatedScores);
  updateGameMessage(`Saved ${username}'s best result to the leaderboard.`);
  return true;
}

function updateGameMessage(message) {
  const messageText = document.getElementById('messageText');
  if (messageText) {
    messageText.textContent = message;
  }
}

function updateStats() {
  const timeText = document.getElementById('timeText');
  const scoreText = document.getElementById('scoreText');
  const accuracyText = document.getElementById('accuracyText');

  if (timeText) timeText.textContent = timeLeft;
  if (scoreText) {
    const minutes = Math.max(1, elapsedTime) / 60;
    const wpm = Math.max(0, Math.round((correctChars / 5) / minutes));
    scoreText.textContent = wpm;
  }
  if (accuracyText) {
    accuracyText.textContent = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;
  }
}

function readSetting(key, defaultValue) {
  const saved = localStorage.getItem(SETTINGS_KEY_MAP[key]);
  return saved !== null ? saved : defaultValue;
}

function loadGameSettings() {
  difficultyMode = readSetting('difficulty', 'normal');
  blindModeEnabled = readSetting('blindMode', 'off') === 'on';
  wordHistoryEnabled = readSetting('wordHistory', 'off') === 'on';
}

function updateSettingsSummary() {
  const summary = document.getElementById('gameSettingsSummary');
  if (!summary) return;

  const modeText = `Difficulty: ${difficultyMode}`;
  const blindText = `Blind: ${blindModeEnabled ? 'on' : 'off'}`;
  const historyText = `Word history: ${wordHistoryEnabled ? 'on' : 'off'}`;
  summary.textContent = `${modeText} · ${blindText} · ${historyText}`;
}

function renderHistory() {
  const historyCard = document.getElementById('historyCard');
  const historyList = document.getElementById('historyList');
  if (!historyCard || !historyList) return;

  if (!wordHistoryEnabled || completedWords.length === 0) {
    historyCard.classList.add('hidden');
    historyList.innerHTML = '';
    return;
  }

  historyList.innerHTML = completedWords
    .map((entry) => `<span class="word-pill">${entry.text}</span>`)
    .join('');
  historyCard.classList.remove('hidden');
}

function endGame(message) {
  gameActive = false;
  clearInterval(timerInterval);
  const input = document.getElementById('typingInput');
  if (input) {
    input.disabled = true;
  }

  if (message) {
    updateGameMessage(message);
  }

  renderHistory();
  updateStats();
}

function generateTargetText() {
  if (upcomingWords.length < 2) {
    upcomingWords = [];
    while (upcomingWords.length < 12) {
      upcomingWords.push(buildWord());
    }
  }

  const nextWord = upcomingWords.shift();
  if (!nextWord) {
    return buildWord();
  }

  return nextWord;
}

function renderTargetText() {
  const targetBox = document.getElementById('wordBox');
  if (!targetBox) return;

  const visibleWords = [
    ...completedWords,
    { text: currentTarget, current: true },
    ...upcomingWords.slice(0, 8).map((text) => ({ text })),
  ];

  const segments = visibleWords.map((wordObj, wordIndex) => {
    const isCurrentWord = Boolean(wordObj.current);
    const wordText = wordObj.text || '';
    const typedWord = isCurrentWord ? currentInput : wordObj.typed || '';
    const wordChars = [];

    for (let index = 0; index < wordText.length; index += 1) {
      const char = wordText[index];
      const typedChar = typedWord[index] || '';
      let className = 'unfulfilled';

      if (!blindModeEnabled) {
        if (isCurrentWord) {
          if (index < typedWord.length) {
            className = char === typedChar ? 'correct' : 'incorrect';
          }

          if (index === typedWord.length && index < wordText.length) {
            className = 'active';
          }
        } else {
          if (index < typedWord.length) {
            className = char === typedChar ? 'correct' : 'incorrect';
          }
        }
      }

      wordChars.push(`<span class="char ${className}">${char}</span>`);
    }

    return `<span class="word-pill ${isCurrentWord ? 'current-word' : 'completed-word'}">${wordChars.join('')}</span>`;
  });

  targetBox.innerHTML = segments.join(' ');

  const currentWordElement = targetBox.querySelector('.current-word');
  if (currentWordElement) {
    currentWordElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function resetGameState() {
  clearInterval(timerInterval);
  gameActive = false;
  timeLeft = GAME_DURATION;
  elapsedTime = 0;
  completedWords = [];
  completedCorrectChars = 0;
  completedTotalTypedChars = 0;
  correctChars = 0;
  totalTypedChars = 0;
  currentInput = '';
  upcomingWords = [];
  currentTarget = generateTargetText();
  const input = document.getElementById('typingInput');
  if (input) input.value = '';
  renderTargetText();
  updateStats();
  renderHistory();
  updateSettingsSummary();
}

function refreshPrompt() {
  currentTarget = generateTargetText();
  currentInput = '';
  const input = document.getElementById('typingInput');
  if (input) {
    input.value = '';
  }

  upcomingWords = [];
  while (upcomingWords.length < TARGET_WORD_COUNT) {
    upcomingWords.push(buildWord());
  }

  const wordCountText = document.getElementById('wordCountText');
  if (wordCountText) {
    wordCountText.textContent = TARGET_WORD_COUNT;
  }

  const timeText = document.getElementById('timeText');
  if (timeText) {
    timeText.textContent = GAME_DURATION;
  }

  if (gameActive && input) {
    input.focus();
  }

  renderTargetText();
}

function startGame() {
  const nameInput = document.getElementById('playerNameInput');
  if (nameInput) {
    setPlayerName(nameInput.value);
  }

  resetGameState();
  gameActive = true;
  const input = document.getElementById('typingInput');
  if (input) {
    input.focus();
  }

  updateGameMessage('Start typing. Your best result will be saved automatically when the timer ends.');

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    elapsedTime += 1;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameActive = false;
      timeLeft = 0;
      updateStats();

      const username = getPlayerName();
      const minutes = Math.max(1, elapsedTime) / 60;
      const score = Math.max(0, Math.round((correctChars / 5) / minutes));
      const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 0;
      saveBestResult(username, score, accuracy, GAME_DURATION);

      const input = document.getElementById('typingInput');
      if (input) {
        input.disabled = true;
      }

      renderHistory();
      return;
    }

    updateStats();
  }, 1000);
}

function restartGame() {
  const input = document.getElementById('typingInput');
  if (input) {
    input.disabled = false;
  }
  startGame();
}

function handleTypingInput(event) {
  if (!gameActive) return;

  const rawValue = event.target.value;
  const hasTrailingSpace = /[\s\u00A0]$/.test(rawValue);
  const effectiveInput = rawValue.replace(/\s+$/, '');
  const displayInput = effectiveInput.slice(0, currentTarget.length);
  const previousInput = currentInput;


  if (effectiveInput.length > previousInput.length && difficultyMode === 'master') {
    const newChar = effectiveInput.slice(previousInput.length);
    const targetChar = currentTarget[previousInput.length] || '';
    if (newChar[0] !== targetChar) {
      endGame('Master mode failed: wrong key pressed.');
      return;
    }
  }

  if (hasTrailingSpace) {
    const matchedChars = calculateMatchedChars(displayInput, currentTarget);
    const isCorrectWord = displayInput === currentTarget;

    if (displayInput.length > 0) {
      completedWords.push({ text: currentTarget, typed: displayInput });
      completedCorrectChars += matchedChars;
      completedTotalTypedChars += countNonSpaceChars(displayInput);
      correctChars = completedCorrectChars;
      totalTypedChars = completedTotalTypedChars;
    }

    if (difficultyMode === 'expert' && effectiveInput.length > 0 && !isCorrectWord) {
      endGame('Expert mode failed: incorrect word submitted.');
      return;
    }

    currentTarget = generateTargetText();
    currentInput = '';
    event.target.value = '';
    renderTargetText();
    updateStats();
    return;
  }

  currentInput = effectiveInput;
  const visibleInput = displayInput;
  const matchedChars = calculateMatchedChars(visibleInput, currentTarget);
  correctChars = completedCorrectChars + matchedChars;
  totalTypedChars = completedTotalTypedChars + countNonSpaceChars(visibleInput);
  renderTargetText();
  updateStats();
}

function updateOptionButtons(option, value) {
  document.querySelectorAll(`.option-btn[data-option="${option}"]`).forEach((button) => {
    button.classList.toggle('active', button.dataset.value === String(value));
  });
}

function updateFeatureButtons(feature, enabled) {
  document.querySelectorAll(`.feature-btn[data-feature="${feature}"]`).forEach((button) => {
    button.classList.toggle('active', enabled);
  });
}

function initializeGame() {
  loadGameSettings();

  const input = document.getElementById('typingInput');
  if (input) {
    input.addEventListener('input', handleTypingInput);
  }

  document.querySelectorAll('.option-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const option = button.dataset.option;
      const value = Number(button.dataset.value);
      if (option === 'time') {
        GAME_DURATION = value;
      }
      if (option === 'words') {
        TARGET_WORD_COUNT = value;
      }
      updateOptionButtons(option, value);
      refreshPrompt();
    });
  });

  document.querySelectorAll('.feature-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const feature = button.dataset.feature;
      if (feature === 'punctuation') {
        includePunctuation = !includePunctuation;
        updateFeatureButtons(feature, includePunctuation);
      }
      if (feature === 'numbers') {
        includeNumbers = !includeNumbers;
        updateFeatureButtons(feature, includeNumbers);
      }
      if (feature === 'caps') {
        includeCaps = !includeCaps;
        updateFeatureButtons(feature, includeCaps);
      }
      refreshPrompt();
    });
  });

  renderAuthStatus();
  resetGameState();
  updateGameMessage('Press start to begin the typing challenge.');
}

window.startGame = startGame;
window.restartGame = restartGame;
window.addEventListener('DOMContentLoaded', initializeGame);
