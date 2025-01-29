/* 
  Dynamic Quiz App
  - Present a set of multiple-choice questions
  - Track user's score and provide immediate feedback
  - Display summary of results (including correct answers) at the end
  - Allow review of responses
*/

// ========== DOM Elements ==========
const questionCounterEl = document.getElementById("question-counter");
const questionTextEl = document.getElementById("question-text");
const optionsContainerEl = document.getElementById("options-container");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const finishBtn = document.getElementById("finish-btn");
const summaryContainer = document.getElementById("summary-container");
const scoreDisplay = document.getElementById("score-display");
const summaryDetails = document.getElementById("summary-details");
const restartBtn = document.getElementById("restart-btn");

// ========== Quiz Data ==========
// You can add, remove, or modify questions as you like
const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Lyon", "Marseille", "Bordeaux"],
    correctIndex: 0,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    correctIndex: 1,
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    options: [
      "William Shakespeare",
      "Jane Austen",
      "Charles Dickens",
      "Mark Twain",
    ],
    correctIndex: 0,
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Osmium", "Oxygen", "Gold", "Oganesson"],
    correctIndex: 1,
  },
  {
    question: "What is the largest mammal on Earth?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctIndex: 1,
  },
];

// ========== State Variables ==========
let currentQuestionIndex = 0;
let userAnswers = []; // store user's selected indexes
let score = 0; // number of correct answers

// ========== Initialization ==========
window.addEventListener("DOMContentLoaded", () => {
  // Start quiz at first question
  currentQuestionIndex = 0;
  userAnswers = [];
  score = 0;

  // Render the first question
  displayQuestion(currentQuestionIndex);

  // Button events
  nextBtn.addEventListener("click", handleNextQuestion);
  finishBtn.addEventListener("click", handleFinishQuiz);
  restartBtn.addEventListener("click", restartQuiz);
});

// ========== Display Question ==========
function displayQuestion(index) {
  // Clear feedback
  feedbackEl.textContent = "";

  // Update question counter
  questionCounterEl.textContent = `Question ${index + 1} of ${quizData.length}`;

  // Display question text
  const questionObj = quizData[index];
  questionTextEl.textContent = questionObj.question;

  // Display options
  optionsContainerEl.innerHTML = "";
  questionObj.options.forEach((option, i) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");

    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "quiz-option";
    radioInput.value = i;
    radioInput.id = `option-${i}`;

    // If we already answered this question (going backward or reviewing),
    // mark the chosen option as checked
    if (userAnswers[index] === i) {
      radioInput.checked = true;
    }

    const label = document.createElement("label");
    label.htmlFor = `option-${i}`;
    label.textContent = option;

    optionDiv.appendChild(radioInput);
    optionDiv.appendChild(label);
    optionsContainerEl.appendChild(optionDiv);
  });

  // Show or hide next/finish buttons
  if (index === quizData.length - 1) {
    // last question
    nextBtn.style.display = "none";
    finishBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "inline-block";
    finishBtn.style.display = "none";
  }
}

// ========== Handle Next Question ==========
function handleNextQuestion() {
  // Save user's answer
  saveUserAnswer(currentQuestionIndex);

  // Provide immediate feedback (optional)
  checkAnswerAndGiveFeedback(currentQuestionIndex);

  // Move to next question after short delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      displayQuestion(currentQuestionIndex);
    }
  }, 700);
}

// ========== Handle Finish Quiz ==========
function handleFinishQuiz() {
  // Save last question's answer
  saveUserAnswer(currentQuestionIndex);

  // Provide immediate feedback for the last question (optional)
  checkAnswerAndGiveFeedback(currentQuestionIndex);

  // Calculate final score
  score = calculateScore();

  // Display summary after a short delay (to allow feedback to show)
  setTimeout(() => {
    showSummary();
  }, 700);
}

// ========== Save User Answer ==========
function saveUserAnswer(questionIndex) {
  const selectedOption = document.querySelector(
    'input[name="quiz-option"]:checked'
  );
  if (selectedOption) {
    userAnswers[questionIndex] = parseInt(selectedOption.value);
  } else {
    userAnswers[questionIndex] = null; // No selection
  }
}

// ========== Check Answer & Feedback ==========
function checkAnswerAndGiveFeedback(questionIndex) {
  const correctIndex = quizData[questionIndex].correctIndex;
  const userIndex = userAnswers[questionIndex];

  if (userIndex === correctIndex) {
    feedbackEl.textContent = "Correct!";
    feedbackEl.className = "correct";
  } else {
    feedbackEl.textContent = "Incorrect!";
    feedbackEl.className = "incorrect";
  }
}

// ========== Calculate Score ==========
function calculateScore() {
  let total = 0;
  quizData.forEach((q, i) => {
    if (q.correctIndex === userAnswers[i]) {
      total++;
    }
  });
  return total;
}

// ========== Show Summary ==========
function showSummary() {
  // Hide quiz container
  document.getElementById("quiz-container").style.display = "none";

  // Display summary container
  summaryContainer.style.display = "block";

  // Show final score
  scoreDisplay.textContent = `You scored ${score} out of ${quizData.length}!`;

  // Show details of each question
  summaryDetails.innerHTML = "";
  quizData.forEach((q, i) => {
    const div = document.createElement("div");
    // Mark correct or incorrect
    const isCorrect = q.correctIndex === userAnswers[i];

    div.classList.add("summary-item");
    div.classList.add(isCorrect ? "correct-answer" : "incorrect-answer");

    div.innerHTML = `
      <p><strong>Question ${i + 1}:</strong> ${q.question}</p>
      <p><strong>Your Answer:</strong> ${
        userAnswers[i] !== null
          ? q.options[userAnswers[i]]
          : "<em>No answer selected</em>"
      }</p>
      <p><strong>Correct Answer:</strong> ${q.options[q.correctIndex]}</p>
    `;
    summaryDetails.appendChild(div);
  });
}

// ========== Restart Quiz ==========
function restartQuiz() {
  // Reset state
  currentQuestionIndex = 0;
  userAnswers = [];
  score = 0;
  feedbackEl.textContent = "";

  // Show quiz container again
  document.getElementById("quiz-container").style.display = "block";
  summaryContainer.style.display = "none";

  // Show first question
  displayQuestion(currentQuestionIndex);
}
