// =======================
// Virtual Calculator Logic
// =======================

// DOM Elements
const display = document.getElementById("display");
const memoryIndicator = document.getElementById("memory-indicator");
const buttons = document.querySelectorAll(".calc-btn");

// Calculator State Variables
let currentValue = "0";     // what is shown on the display
let firstOperand = null;    // first operand in an operation
let operator = null;        // current operator (+, -, /, *, etc.)
let shouldResetDisplay = false; // flag to reset display on next digit

// Memory feature
let memoryValue = 0;

// ===========================
// Event Listeners for Buttons
// ===========================
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.getAttribute("data-action");
    handleButtonClick(action);
  });
});

function handleButtonClick(action) {
  // Check if action is a digit or decimal
  if (!isNaN(action) || action === ".") {
    inputDigit(action);
  } else {
    // Otherwise, handle operation
    switch (action) {
      case "+":
      case "-":
      case "*":
      case "/":
        handleOperator(action);
        break;
      case "=":
        handleEquals();
        break;
      case "clear":
        clearAll();
        break;
      case "sqrt":
        handleSqrt();
        break;
      case "percent":
        handlePercent();
        break;
      case "mc":
      case "mr":
      case "m+":
      case "m-":
        handleMemory(action);
        break;
      default:
        // fallback
        console.log("Unknown action: ", action);
    }
  }
  updateDisplay();
}

// ===========================
// Display & Input Management
// ===========================
function updateDisplay() {
  display.textContent = currentValue;
}

function inputDigit(digit) {
  if (shouldResetDisplay) {
    currentValue = digit === "." ? "0." : digit;
    shouldResetDisplay = false;
  } else {
    // handle decimal
    if (digit === ".") {
      if (!currentValue.includes(".")) {
        currentValue += ".";
      }
    } else {
      // handle digits
      currentValue = currentValue === "0" ? digit : currentValue + digit;
    }
  }
}

// ===========================
// Operators & Calculations
// ===========================
function handleOperator(op) {
  if (operator && !shouldResetDisplay) {
    // If there's already an operator, compute first
    handleEquals();
  }
  firstOperand = parseFloat(currentValue);
  operator = op;
  shouldResetDisplay = true;
}

function handleEquals() {
  if (!operator || firstOperand === null) return;

  const secondOperand = parseFloat(currentValue);
  let result = 0;

  switch (operator) {
    case "+":
      result = firstOperand + secondOperand;
      break;
    case "-":
      result = firstOperand - secondOperand;
      break;
    case "*":
      result = firstOperand * secondOperand;
      break;
    case "/":
      if (secondOperand === 0) {
        // Handle division by zero
        currentValue = "Error";
        operator = null;
        firstOperand = null;
        return;
      }
      result = firstOperand / secondOperand;
      break;
    default:
      return;
  }

  currentValue = String(result);
  firstOperand = null;
  operator = null;
  shouldResetDisplay = true;
}

// ===========================
// Advanced Functions
// ===========================
function handleSqrt() {
  const val = parseFloat(currentValue);
  if (val < 0) {
    currentValue = "Error"; // sqrt of negative is error for this basic calculator
  } else {
    currentValue = String(Math.sqrt(val));
  }
  shouldResetDisplay = true;
}

function handlePercent() {
  // Convert current value to a percent (value / 100)
  const val = parseFloat(currentValue);
  currentValue = String(val / 100);
  shouldResetDisplay = true;
}

// ===========================
// Memory Functions
// ===========================
function handleMemory(action) {
  const val = parseFloat(currentValue);

  switch (action) {
    case "mc":
      memoryValue = 0;
      memoryIndicator.textContent = "";
      break;
    case "mr":
      currentValue = String(memoryValue);
      shouldResetDisplay = true;
      break;
    case "m+":
      memoryValue += val;
      memoryIndicator.textContent = "M";
      break;
    case "m-":
      memoryValue -= val;
      memoryIndicator.textContent = "M";
      break;
    default:
      break;
  }
}

// ===========================
// Clearing
// ===========================
function clearAll() {
  currentValue = "0";
  firstOperand = null;
  operator = null;
  shouldResetDisplay = false;
}

// Initial display
updateDisplay();
