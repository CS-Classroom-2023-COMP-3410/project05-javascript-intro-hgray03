/**
 * Sorting Visualization Tool
 * - Demonstrates Bubble Sort, Insertion Sort with animations
 * - Allows user to pick an algorithm, adjust speed, and reset array
 * - Provides commentary for each step
 */

// DOM Elements
const barsContainer = document.getElementById("bars-container");
const algorithmSelect = document.getElementById("algorithm-select");
const speedSlider = document.getElementById("speed-slider");
const generateBtn = document.getElementById("generate-btn");
const sortBtn = document.getElementById("sort-btn");
const commentaryEl = document.getElementById("commentary");

// Global Variables
let array = [];
let isSorting = false;
let animationSpeed = parseInt(speedSlider.value, 10);
let sortAnimations = [];

// ===========================
// Initialization
// ===========================
window.addEventListener("DOMContentLoaded", () => {
  generateRandomArray();
});

// Events
generateBtn.addEventListener("click", generateRandomArray);
sortBtn.addEventListener("click", handleSort);
speedSlider.addEventListener("input", () => {
  animationSpeed = parseInt(speedSlider.value, 10);
});

// ===========================
// Generate Array & Display
// ===========================
function generateRandomArray() {
  if (isSorting) return;

  commentaryEl.innerHTML = "";
  array = [];
  barsContainer.innerHTML = "";

  const size = 30; // number of bars
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 300) + 20; // random height
    array.push(value);
  }
  displayArray(array);
}

function displayArray(arr) {
  barsContainer.innerHTML = "";
  const maxVal = Math.max(...arr);

  arr.forEach((val) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = (val / maxVal) * 100 + "%"; // scale to container height
    barsContainer.appendChild(bar);
  });
}

function clearBarStyles() {
  const allBars = document.querySelectorAll(".bar");
  allBars.forEach((bar) => {
    bar.classList.remove("comparing", "swapping");
  });
}

// ===========================
// Sorting Logic
// ===========================
async function handleSort() {
  if (isSorting) return;
  isSorting = true;
  commentaryEl.innerHTML = "";

  const selectedAlgo = algorithmSelect.value;
  let steps = [];

  switch (selectedAlgo) {
    case "bubble":
      steps = getBubbleSortSteps([...array]);
      break;
    case "insertion":
      steps = getInsertionSortSteps([...array]);
      break;
    default:
      addCommentary("Unknown algorithm selected.");
      isSorting = false;
      return;
  }

  await animateSteps(steps);

  isSorting = false;
  addCommentary("Sorting completed!");
}

// Bubble Sort - return an array of steps
function getBubbleSortSteps(arr) {
  const steps = [];
  const n = arr.length;
  // Bubble Sort
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare step
      steps.push({ type: "compare", indices: [j, j + 1], array: [...arr] });

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ type: "swap", indices: [j, j + 1], array: [...arr] });
      }
    }
  }
  return steps;
}

// Insertion Sort - return an array of steps
function getInsertionSortSteps(arr) {
  const steps = [];
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      steps.push({ type: "compare", indices: [j, j + 1], array: [...arr] });
      arr[j + 1] = arr[j];
      steps.push({ type: "swap", indices: [j, j + 1], array: [...arr] });
      j = j - 1;
    }
    arr[j + 1] = key;
    // we could add a step to show final placement if desired
  }
  return steps;
}

// ===========================
// Animation
// ===========================
async function animateSteps(steps) {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    displayArray(step.array);
    highlightBars(step.type, step.indices);

    // Commentary
    if (step.type === "compare") {
      addCommentary(`Comparing indices ${step.indices[0]} and ${step.indices[1]}`);
    } else if (step.type === "swap") {
      addCommentary(`Swapping indices ${step.indices[0]} and ${step.indices[1]}`);
    }

    await sleep(animationSpeed);
  }
}

// Highlight bars depending on step type
function highlightBars(type, indices) {
  const allBars = document.querySelectorAll(".bar");
  clearBarStyles();

  if (!indices) return;
  indices.forEach((idx) => {
    if (allBars[idx]) {
      if (type === "compare") {
        allBars[idx].classList.add("comparing");
      } else if (type === "swap") {
        allBars[idx].classList.add("swapping");
      }
    }
  });
}

// Utility sleep for animation delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===========================
// Commentary
// ===========================
function addCommentary(text) {
  commentaryEl.innerHTML += text + "<br/>";
  commentaryEl.scrollTop = commentaryEl.scrollHeight;
}
