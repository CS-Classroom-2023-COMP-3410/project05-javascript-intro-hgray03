/**
 * Keyboard Trainer: Word Practice
 * - Generates random words from a word bank
 * - Optionally inserts special punctuation at the end of words
 * - Tracks WPM (starts timer only after first keypress) and accuracy
 * - Highlights typed text in real time (correct vs. incorrect)
 * - Shows final results with WPM and accuracy; can restart
 */

// A sample word bank (customize as you wish)
const WORD_BANK = [
    "apple", "banana", "keyboard", "typing", "practice", "amazing", "world",
    "flower", "garden", "spaghetti", "javascript", "wonderful", "awesome",
    "programming", "event", "function", "variable", "constant", "excellence",
    "hello", "random", "words", "trainer", "sunshine", "beautiful", "dynamic",
    "comfort", "enthusiastic", "freedom", "ocean", "glorious", "chocolate",
    "thunder", "marathon", "distance", "limitless", "forest", "whisper",
    "castle", "fiction", "storybook", "galaxy", "infinite", "science",
    "library", "laughter", "curiosity", "rhythm", "village", "adventure",
    "creativity", "puzzle", "intriguing", "challenge", "guitar", "language",
    "coffee", "pancake", "enchanted", "starlight", "mystery", "fantasy",
    "elegant", "triumph", "harmony", "courage", "magnetic", "camera",
  ];
  
  const textDisplay = document.getElementById("text-display");
  const typingInput = document.getElementById("typing-input");
  const numWordsInput = document.getElementById("num-words");
  const includeSpecialsCheckbox = document.getElementById("include-specials");
  const generateTextBtn = document.getElementById("generate-text-btn");
  const resultsContainer = document.getElementById("results");
  const wpmEl = document.getElementById("wpm");
  const accuracyEl = document.getElementById("accuracy");
  const restartBtn = document.getElementById("restart-btn");
  
  // Global state
  let targetText = "";
  let startTime = null; // time is set when the *first* character is typed
  let totalCharsTyped = 0;
  let isComplete = false;
  
  // ------------------------------
  // Initialization & Event Listeners
  // ------------------------------
  generateTextBtn.addEventListener("click", generateNewText);
  typingInput.addEventListener("input", handleTyping);
  restartBtn.addEventListener("click", restart);
  
  /** Generate a new batch of words and display them. */
  function generateNewText() {
    // Reset states
    typingInput.value = "";
    typingInput.disabled = false;
    typingInput.focus();
    textDisplay.textContent = "";
    resultsContainer.style.display = "none";
  
    startTime = null;
    isComplete = false;
    totalCharsTyped = 0;
  
    // Determine how many words and if we add special punctuation
    const wordCount = parseInt(numWordsInput.value, 10) || 20;
    const includeSpecials = includeSpecialsCheckbox.checked;
  
    targetText = generateRandomWordSequence(wordCount, includeSpecials);
    displayTargetText(targetText);
  }
  
  /**
   * Build a string consisting of random words from WORD_BANK.
   * Optionally append punctuation to some words.
   */
  function generateRandomWordSequence(count, includeSpecials) {
    const resultWords = [];
    for (let i = 0; i < count; i++) {
      const randIndex = Math.floor(Math.random() * WORD_BANK.length);
      let chosenWord = WORD_BANK[randIndex];
  
      // Possibly attach punctuation
      if (includeSpecials && Math.random() < 0.3) {
        chosenWord += getRandomPunctuation();
      }
      resultWords.push(chosenWord);
    }
    return resultWords.join(" ");
  }
  
  function getRandomPunctuation() {
    const punctuation = ["!", ".", "?", ",", ";", ":"];
    const rand = Math.floor(Math.random() * punctuation.length);
    return punctuation[rand];
  }
  
  function displayTargetText(text) {
    textDisplay.textContent = text;
  }
  
  // ------------------------------
  // Typing / Real-Time Highlight
  // ------------------------------
  function handleTyping(e) {
    if (!startTime) {
      // The moment user types the first character
      startTime = Date.now();
    }
  
    const userInput = e.target.value;
    totalCharsTyped++;
  
    // If typed beyond target length, ignore extra
    if (userInput.length > targetText.length) {
      return;
    }
  
    // If the entire text matches
    if (userInput === targetText) {
      highlightText(userInput);
      typingInput.disabled = true;
      isComplete = true;
      showResults();
    } else {
      highlightText(userInput);
    }
  }
  
  /** Apply green/red highlighting for correct/incorrect characters in the text. */
  function highlightText(userInput) {
    let html = "";
    for (let i = 0; i < targetText.length; i++) {
      const correctChar = targetText[i];
      const userChar = userInput[i];
  
      if (userChar == null) {
        // Not typed yet
        html += correctChar;
      } else if (userChar === correctChar) {
        // Correct
        html += `<span class="correct-char">${correctChar}</span>`;
      } else {
        // Incorrect
        html += `<span class="incorrect-char">${correctChar}</span>`;
      }
    }
    textDisplay.innerHTML = html;
  }
  
  // ------------------------------
  // Results Calculation (WPM & Accuracy)
  // ------------------------------
  function showResults() {
    const endTime = Date.now();
    const timeTakenSec = (endTime - startTime) / 1000;
    const timeInMinutes = timeTakenSec / 60;
  
    // WPM = (number of typed chars / 5) / time_in_minutes
    const totalLength = targetText.length; // total chars in the displayed text
    const wpm = Math.round((totalLength / 5) / timeInMinutes);
  
    // Accuracy = (# correct chars typed) / total chars typed * 100
    let correctChars = 0;
    for (let i = 0; i < totalLength; i++) {
      if (typingInput.value[i] === targetText[i]) {
        correctChars++;
      }
    }
    const accuracy = Math.round((correctChars / totalCharsTyped) * 100);
  
    wpmEl.textContent = `Words Per Minute (WPM): ${wpm}`;
    accuracyEl.textContent = `Accuracy: ${accuracy}%`;
    resultsContainer.style.display = "block";
  }
  
  // ------------------------------
  // Restart
  // ------------------------------
  function restart() {
    typingInput.value = "";
    typingInput.disabled = true;
    textDisplay.textContent = "";
    resultsContainer.style.display = "none";
  
    // Reset timing/typing
    startTime = null;
    isComplete = false;
    totalCharsTyped = 0;
  }
  