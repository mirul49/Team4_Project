// TYPE RUSH WORD LIST

const words = [
  "apple", "window", "keyboard", "typing", "school",
  "browser", "planet", "coffee", "student", "holiday",
  "summer", "winter", "computer", "developer", "internet",
  "monitor", "website", "game", "player", "score",
  "speed", "accuracy", "challenge", "practice", "language",
  "garden", "village", "ocean", "music", "friend",
  "future", "project", "record", "leaderboard", "quick",
  "focus", "correct", "simple", "strong", "light",
  "dream", "travel", "learn", "create", "design",
  "coding", "javascript", "result", "normal", "expert",
  "master"
];


// GAME SETTINGS

let selectedDifficulty = "Normal";
let selectedDuration = 20;


// GAME VARIABLES

let timeLeft = 20;
let elapsedSeconds = 0;

let timer = null;
let running = false;

let gameWords = [];
let currentWordIndex = 0;

let correctWords = 0;
let incorrectWords = 0;

let correctCharacters = 0;
let incorrectCharacters = 0;


// HTML ELEMENTS

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const wordBox = document.getElementById("wordBox");
const input = document.getElementById("typingInput");
const timeText = document.getElementById("timeText");
const durationText = document.getElementById("durationText");
const wordCountText = document.getElementById("wordCountText");
const wpmText = document.getElementById("wpmText");
const accuracyText = document.getElementById("accuracyText");
const difficultyText = document.getElementById("difficultyText");
const gameState = document.getElementById("gameState");
const modeDescription = document.getElementById("modeDescription");
const message = document.getElementById("messageText");
const userStatus = document.getElementById("userStatus");
const loginHeading = document.getElementById("loginHeading");
const loginDescription = document.getElementById("loginDescription");
const guestActions = document.getElementById("guestActions");


// USER

function getLoggedInUser() {
  const username =
    localStorage.getItem(
      "typerush-current-user"
    );

  if (
    !username ||
    username === "undefined"
  ) {
    return null;
  }

  return username.trim();
}


function loadUser() {
  const username =
    getLoggedInUser();

  if (username) {
    userStatus.textContent =
      username;

    userStatus.hidden =
      false;

    guestActions.hidden =
      true;

    loginHeading.textContent =
      "Hello, " + username + "!";

    loginDescription.textContent =
      "Your result will be saved to the leaderboard.";
  } else {
    userStatus.textContent =
      "Guest";

    userStatus.hidden =
      true;

    guestActions.hidden =
      false;

    loginHeading.textContent =
      "Play as a guest";

    loginDescription.textContent =
      "Log in or create an account to save your result to the leaderboard.";
  }
}


// LOAD SAVED SETTINGS

function loadGameSettings() {
  const savedDifficultyRaw =
    localStorage.getItem(
      "typerush-setting-difficulty"
    );

  const savedDifficulty =
    savedDifficultyRaw
      ? savedDifficultyRaw
          .charAt(0)
          .toUpperCase() +
        savedDifficultyRaw
          .slice(1)
          .toLowerCase()
      : null;

  const savedDuration =
    Number(
      localStorage.getItem(
        "gameDuration"
      )
    );

  const validDifficulties = [
    "Normal",
    "Expert",
    "Master"
  ];

  const validDurations = [
    20,
    30
  ];


  // Use the saved difficulty only
  // when it contains a valid value.
  if (
    validDifficulties.includes(
      savedDifficulty
    )
  ) {
    selectedDifficulty =
      savedDifficulty;
  } else {
    selectedDifficulty =
      "Normal";
  }


  // Use the saved duration only
  // when it is 20 or 30 seconds.
  if (
    validDurations.includes(
      savedDuration
    )
  ) {
    selectedDuration =
      savedDuration;
  } else {
    selectedDuration =
      20;
  }


  timeLeft = selectedDuration;

  difficultyText.textContent =
    selectedDifficulty;

  durationText.textContent =
    selectedDuration;

  timeText.textContent =
    selectedDuration;

  displayModeDescription();
}


// DISPLAY MODE DESCRIPTION

function displayModeDescription() {
  if (
    selectedDifficulty === "Expert"
  ) {
    modeDescription.textContent =
      "Incorrect submitted word ends the test";
  } else if (
    selectedDifficulty === "Master"
  ) {
    modeDescription.textContent =
      "Incorrect character ends the test immediately";
  } else {
    modeDescription.textContent =
      "Classic typing mode";
  }
}


// GENERATE GAME WORDS

function generateGameWords(
  amount = 120
) {
  const generatedWords = [];

  for (
    let index = 0;
    index < amount;
    index++
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
        words.length
      );

    generatedWords.push(
      words[randomIndex]
    );
  }

  return generatedWords;
}


// CREATE ONE WORD ELEMENT

function createWordElement(
  word,
  wordIndex
) {
  const wordSpan =
    document.createElement(
      "span"
    );

  wordSpan.className =
    "typing-word";

  wordSpan.dataset.wordIndex =
    wordIndex;


  word
    .split("")
    .forEach(function (
      character
    ) {
      const characterSpan =
        document.createElement(
          "span"
        );

      characterSpan.textContent =
        character;

      characterSpan.className =
        "typing-character";

      wordSpan.appendChild(
        characterSpan
      );
    });


  if (
    wordIndex ===
    currentWordIndex
  ) {
    wordSpan.classList.add(
      "current-word"
    );
  }

  return wordSpan;
}


// DISPLAY INITIAL WORDS

function displayWords() {
  wordBox.innerHTML = "";

  const visibleWordCount = 6;

  const wordsToDisplay =
    Math.min(
      visibleWordCount,
      gameWords.length
    );

  for (
    let wordIndex = 0;
    wordIndex < wordsToDisplay;
    wordIndex++
  ) {
    const wordElement =
      createWordElement(
        gameWords[wordIndex],
        wordIndex
      );

    wordBox.appendChild(
      wordElement
    );
  }
}


// APPEND ONE NEW WORD

function appendNextWord() {
  const displayedWords =
    wordBox.querySelectorAll(
      ".typing-word"
    );

  if (
    displayedWords.length === 0
  ) {
    return;
  }

  const lastDisplayedWord =
    displayedWords[
      displayedWords.length - 1
    ];

  const lastDisplayedIndex =
    Number(
      lastDisplayedWord
        .dataset.wordIndex
    );

  const nextWordIndex =
    lastDisplayedIndex + 1;


  // Add more random words to the
  // game array if necessary.
  if (
    nextWordIndex >=
    gameWords.length
  ) {
    gameWords.push(
      ...generateGameWords(50)
    );
  }


  const newWordElement =
    createWordElement(
      gameWords[nextWordIndex],
      nextWordIndex
    );

  wordBox.appendChild(
    newWordElement
  );
}


// KEEP CURRENT WORD VISIBLE

function scrollCurrentWordIntoView() {
  const currentWordElement =
    wordBox.querySelector(
      `[data-word-index="${currentWordIndex}"]`
    );

  if (!currentWordElement) {
    return;
  }

  currentWordElement.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest"
  });
}


// START GAME

function startGame() {
  clearInterval(timer);

  // Reload the settings in case the
  // player changed them recently.
  loadGameSettings();

  timeLeft = selectedDuration;
  elapsedSeconds = 0;
  
  currentWordIndex = 0;
  
  correctWords = 0;
  incorrectWords = 0;

  correctCharacters = 0;
  incorrectCharacters = 0;
  
  running = true;


  gameWords = generateGameWords(120);

  timeText.textContent = timeLeft;
  wordCountText.textContent = "0";
  wpmText.textContent = "0";
  accuracyText.textContent = "100";
  gameState.textContent = "In progress";
  message.textContent = "";
  message.className = "game-message";

  startBtn.disabled = true;
  restartBtn.disabled = false;

  input.disabled = false;
  input.value = "";
  input.placeholder = "Start typing here...";

  displayWords();

  input.focus();


  timer = setInterval(function () {
      timeLeft--;
      elapsedSeconds++;

      timeText.textContent = timeLeft;

      updateStatistics();

      if (
        timeLeft <= 0
      ) {
        endGame(
          false,
          "Time completed."
        );
      }
    }, 1000);
}


// INPUT HANDLING

input.addEventListener(
  "input",
  function () {
    if (!running) {
      return;
    }

    // Remove line breaks.
    input.value =
      input.value.replace(
        /\n/g,
        ""
      );

    updateCharacterHighlighting();


    if (
      selectedDifficulty ===
      "Master"
    ) {
      checkImmediateFailure();
    }
  }
);


// GET THE CURRENT TYPED WORD

function getCurrentTypedWord() {
  return input.value.trim();
}


// CHARACTER HIGHLIGHTING

function updateCharacterHighlighting() {
  const currentWordElement =
    wordBox.querySelector(
      `[data-word-index="${currentWordIndex}"]`
    );

  if (!currentWordElement) {
    return;
  }


  const correctWord =
    gameWords[
      currentWordIndex
    ];

  const typedWord =
    getCurrentTypedWord();

  const characterElements =
    currentWordElement
      .querySelectorAll(
        ".typing-character"
      );


  characterElements.forEach(
    function (
      characterElement,
      characterIndex
    ) {
      characterElement.classList.remove(
        "correct-character",
        "incorrect-character"
      );


      if (
        characterIndex >=
        typedWord.length
      ) {
        return;
      }


      if (
        typedWord[
          characterIndex
        ] ===
        correctWord[
          characterIndex
        ]
      ) {
        characterElement.classList.add(
          "correct-character"
        );
      } else {
        characterElement.classList.add(
          "incorrect-character"
        );
      }
    }
  );
}


// MASTER MODE

function checkImmediateFailure() {
  const typedWord =
    getCurrentTypedWord();

  const correctWord =
    gameWords[
      currentWordIndex
    ];


  for (
    let index = 0;
    index < typedWord.length;
    index++
  ) {
    if (
      typedWord[index] !==
      correctWord[index]
    ) {
      incorrectCharacters++;

      endGame(
        true,
        selectedDifficulty +
        " mode failed: an incorrect character was typed."
      );

      return;
    }
  }


  if (
    typedWord.length >
    correctWord.length
  ) {
    incorrectCharacters++;

    endGame(
      true,
      selectedDifficulty +
      " mode failed: too many characters were typed."
    );
  }
}


// SUBMIT WORD USING SPACE OR ENTER

input.addEventListener(
  "keydown",
  function (event) {
    if (!running) {
      return;
    }

    if (
      event.key !== " " &&
      event.key !== "Enter"
    ) {
      return;
    }

    event.preventDefault();

    submitCurrentWord();
  }
);


// SUBMIT CURRENT WORD

function submitCurrentWord() {
  const typedWord =
    getCurrentTypedWord();

  if (
    typedWord === ""
  ) {
    return;
  }


  const correctWord =
    gameWords[
      currentWordIndex
    ];

  const wordElement =
    wordBox.querySelector(
      `[data-word-index="${currentWordIndex}"]`
    );

  if (!wordElement) {
    return;
  }


  const isCorrect =
    typedWord === correctWord;


  countCharacters(
    typedWord,
    correctWord
  );


  if (isCorrect) {
    correctWords++;

    wordElement.classList.add(
      "completed-correct-word"
    );

    message.textContent =
      "Correct!";

    message.className =
      "game-message correct-message";
  } else {
    incorrectWords++;

    wordElement.classList.add(
      "completed-incorrect-word"
    );

    message.textContent =
      'Incorrect. The correct word was "' +
      correctWord +
      '".';

    message.className =
      "game-message incorrect-message";


    // Expert mode ends when the
    // player submits an incorrect word.
    if (
      selectedDifficulty ===
      "Expert"
    ) {
      updateStatistics();

      endGame(
        true,
        "Expert mode failed: an incorrect word was submitted."
      );

      return;
    }
  }


  wordElement.classList.remove(
    "current-word"
  );

  currentWordIndex++;


  // Generate more words if the
  // gameWords array runs out.
  if (
    currentWordIndex >=
    gameWords.length
  ) {
    gameWords.push(
      ...generateGameWords(50)
    );
  }


  // Find and highlight the next word.
  const nextWordElement =
    wordBox.querySelector(
      `[data-word-index="${currentWordIndex}"]`
    );

  if (nextWordElement) {
    nextWordElement.classList.add(
      "current-word"
    );
  }


  // Add one new word to the end,
  // while keeping completed words.
  appendNextWord();

  input.value = "";
  
  updateStatistics();
  updateCharacterHighlighting();
  scrollCurrentWordIntoView();
}


// CHARACTER COUNTING

function countCharacters(
  typedWord,
  correctWord
) {
  const longestLength =
    Math.max(
      typedWord.length,
      correctWord.length
    );


  for (
    let index = 0;
    index < longestLength;
    index++
  ) {
    if (
      typedWord[index] ===
      correctWord[index]
    ) {
      correctCharacters++;
    } else {
      incorrectCharacters++;
    }
  }
}


// UPDATE STATISTICS

function updateStatistics() {
  const submittedWords =
    correctWords +
    incorrectWords;

  const totalCharacters =
    correctCharacters +
    incorrectCharacters;


  const accuracy =
    totalCharacters === 0
      ? 100
      : Math.round(
          (
            correctCharacters /
            totalCharacters
          ) * 100
        );


  const minutes =
    elapsedSeconds / 60;


  const wpm =
    minutes <= 0
      ? 0
      : Math.round(
          correctCharacters /
          5 /
          minutes
        );


  wordCountText.textContent =
    submittedWords;

  accuracyText.textContent =
    accuracy;

  wpmText.textContent =
    Math.max(
      0,
      wpm
    );
}


// END GAME

function endGame(
  didFail,
  reason
) {
  clearInterval(timer);

  running =
    false;

  input.disabled =
    true;

  startBtn.disabled =
    false;

  restartBtn.disabled =
    false;


  updateStatistics();


  gameState.textContent =
    didFail
      ? "Failed"
      : "Finished";


  message.textContent =
    reason;


  message.className =
    didFail
      ? "game-message incorrect-message"
      : "game-message correct-message";


  const submittedWords =
    correctWords +
    incorrectWords;


  const totalCharacters =
    correctCharacters +
    incorrectCharacters;


  const finalAccuracy =
    totalCharacters === 0
      ? 100
      : Math.round(
          (
            correctCharacters /
            totalCharacters
          ) * 100
        );


  const secondsPlayed =
    Math.max(
      1,
      selectedDuration -
      timeLeft
    );


  const finalWpm =
    Math.round(
      correctCharacters /
      5 /
      (
        secondsPlayed /
        60
      )
    );


  const score =
    Math.max(
      0,
      correctWords * 10 -
      incorrectWords * 5
    );


  const result = {
    username:
      getLoggedInUser() ||
      "Guest",

    score:
      score,

    wpm:
      Math.max(
        0,
        finalWpm
      ),

    accuracy:
      finalAccuracy,

    correctWords:
      correctWords,

    incorrectWords:
      incorrectWords,

    totalWords:
      submittedWords,

    difficulty:
      selectedDifficulty,

    duration:
      selectedDuration,

    failed:
      didFail,

    failureReason:
      didFail
        ? reason
        : ""
  };


  sessionStorage.setItem(
    "latestGameResult",
    JSON.stringify(result)
  );


  saveScore(result);


  // Move to the result page
  // after one second.
  setTimeout(function () {
    window.location.href =
      "result.html";
  }, 1000);
}


// SAVE SCORE

function saveScore(result) {
  const username =
    getLoggedInUser();


  // Guest scores are not saved.
  if (!username) {
    console.log(
      "Leaderboard score was not saved because the player is a guest."
    );

    return;
  }


  const storageKey =
    "typerush-leaderboard";


  let scores = [];


  try {
    const savedScores =
      localStorage.getItem(
        storageKey
      );


    scores =
      savedScores
        ? JSON.parse(
            savedScores
          )
        : [];


    if (
      !Array.isArray(scores)
    ) {
      scores = [];
    }
  } catch (error) {
    console.error(
      "Unable to load leaderboard scores:",
      error
    );

    scores = [];
  }


  const newScore = {
    username:
      username,

    score:
      result.score,

    accuracy:
      result.accuracy,

    timeLimit:
      result.duration,

    difficulty:
      result.difficulty,

    wpm:
      result.wpm
  };


  scores.push(
    newScore
  );


  scores.sort(function (
    first,
    second
  ) {
    if (
      second.score !==
      first.score
    ) {
      return (
        second.score -
        first.score
      );
    }

    return (
      second.accuracy -
      first.accuracy
    );
  });


  localStorage.setItem(
    storageKey,
    JSON.stringify(scores)
  );


  console.log(
    "Leaderboard score saved:",
    newScore
  );
}


// BUTTON CONNECTIONS

startBtn.addEventListener(
  "click",
  startGame
);


restartBtn.addEventListener(
  "click",
  startGame
);


// PAGE STARTUP

loadUser();
loadGameSettings();
