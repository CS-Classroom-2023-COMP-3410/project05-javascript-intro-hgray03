// =======================
// DOM Elements & Globals
// =======================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brushSizeInput = document.getElementById("brush-size");
const brushColorInput = document.getElementById("brush-color");
const bgColorInput = document.getElementById("bg-color");

const undoBtn = document.getElementById("undo-btn");
const clearBtn = document.getElementById("clear-btn");
const saveBtn = document.getElementById("save-btn");

// We'll store the strokes in an array. Each stroke is an object:
// { points: [{x, y}, ...], color, size }
let strokes = [];
let currentStroke = null;
let isDrawing = false;

// Initialize defaults
let brushSize = parseInt(brushSizeInput.value, 10);
let brushColor = brushColorInput.value;
let bgColor = bgColorInput.value;

// =======================
// Initialization
// =======================
window.addEventListener("DOMContentLoaded", () => {
  // Fill the canvas with the background color
  fillCanvas(bgColor);

  // Event Listeners for drawing
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", endDrawing);
  canvas.addEventListener("mouseleave", endDrawing);

  // Control changes
  brushSizeInput.addEventListener("change", () => {
    brushSize = parseInt(brushSizeInput.value, 10);
  });
  brushColorInput.addEventListener("change", () => {
    brushColor = brushColorInput.value;
  });
  bgColorInput.addEventListener("change", () => {
    bgColor = bgColorInput.value;
    reDrawAll();
  });

  // Buttons
  undoBtn.addEventListener("click", undoLastStroke);
  clearBtn.addEventListener("click", clearCanvas);
  saveBtn.addEventListener("click", saveCanvasAsImage);
});

// =======================
// Drawing Functions
// =======================
function startDrawing(e) {
  isDrawing = true;

  currentStroke = {
    color: brushColor,
    size: brushSize,
    points: [],
  };

  addPoint(e);
}

function draw(e) {
  if (!isDrawing) return;

  addPoint(e);
  reDrawAll(); // Re-render the entire canvas each time for "live" stroke drawing
}

function endDrawing(e) {
  if (isDrawing) {
    addPoint(e);
    strokes.push(currentStroke);
    currentStroke = null;
  }
  isDrawing = false;
}

function addPoint(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  currentStroke.points.push({ x, y });
}

// =======================
// Undo & Clear
// =======================
function undoLastStroke() {
  strokes.pop();
  reDrawAll();
}

function clearCanvas() {
  strokes = [];
  reDrawAll();
}

// =======================
// Canvas Rendering
// =======================
function reDrawAll() {
  // Fill background
  fillCanvas(bgColor);

  // Re-draw each stroke
  strokes.forEach((stroke) => {
    drawStroke(stroke);
  });

  // If there's a current stroke in progress, draw it too
  if (currentStroke) {
    drawStroke(currentStroke);
  }
}

function fillCanvas(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStroke(stroke) {
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();

  // Move to the first point
  const firstPoint = stroke.points[0];
  ctx.moveTo(firstPoint.x, firstPoint.y);

  // Draw line for each subsequent point
  for (let i = 1; i < stroke.points.length; i++) {
    const point = stroke.points[i];
    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
}

// =======================
// Save Canvas
// =======================
function saveCanvasAsImage() {
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "my-drawing.png";
  link.click();
}
