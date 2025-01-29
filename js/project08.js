/******************************************************
 * Interactive Story Game
 * - Simple text-based adventure with branching paths
 * - Progress bar to visualize completion
 * - LocalStorage to save & resume
 * - Reset button to restart
 ******************************************************/

// DOM Elements
const storyTextEl = document.getElementById('story-text');
const choicesEl = document.getElementById('choices');
const progressBar = document.getElementById('progress-bar');
const resetBtn = document.getElementById('reset-btn');

// Each scene has: 
// - text: The narrative text
// - choices: array of { text, nextSceneId }
// Scenes form a branching story
const scenes = {
  start: {
    text: `You awake in a peaceful meadow, the morning sun warm on your face. 
           In the distance, you see a small cottage to the west 
           and a winding path to the east leading into a forest.`,
    choices: [
      { text: "Go to the cottage", nextSceneId: "cottage" },
      { text: "Head into the forest", nextSceneId: "forest" },
    ],
  },
  cottage: {
    text: `You approach the cottage and gently knock on the wooden door. 
           An elderly woman answers and invites you inside. 
           She offers you tea and asks about your journey.`,
    choices: [
      { text: "Accept her hospitality", nextSceneId: "hospitality" },
      { text: "Politely refuse and go back", nextSceneId: "start" },
    ],
  },
  hospitality: {
    text: `You enjoy a warm cup of tea. 
           The woman speaks of a hidden treasure in the forest. 
           She hands you a key with strange markings.`,
    choices: [
      { text: "Thank her and head back outside", nextSceneId: "forest" },
    ],
  },
  forest: {
    text: `You wander into the forest. The trees tower above you, 
           their leaves forming a vibrant green canopy. 
           Deeper along the path, you spot a small cave entrance.`,
    choices: [
      { text: "Explore the cave", nextSceneId: "cave" },
      { text: "Return to the meadow", nextSceneId: "start" },
    ],
  },
  cave: {
    text: `Inside the cave, you see a locked chest, marked with the same symbol 
           on the key the old woman gave you. 
           This must be the treasure she spoke of! 
           You unlock the chest, revealing countless gold coins and a glowing amulet.`,
    choices: [
      { text: "Take the treasure and exit", nextSceneId: "end" },
    ],
  },
  end: {
    text: `You step back into the forest, treasure in hand. 
           The journey has come to a triumphant end—yet new adventures await.`,
    choices: [],
  },
};

// Scenes in the story
const totalScenes = Object.keys(scenes).length; // for the progress bar

// We'll store the game state in localStorage
// gameState = { currentSceneId, visitedScenes: Set([...]) }
let gameState = {
  currentSceneId: 'start',
  visitedScenes: [],
};

// -----------------
// Initialization
// -----------------
window.addEventListener('DOMContentLoaded', () => {
  loadGameState();  // Load from localStorage, if available
  displayScene(gameState.currentSceneId);
  updateProgressBar();

  resetBtn.addEventListener('click', resetGame);
});

// -----------------
// Core Functions
// -----------------
function displayScene(sceneId) {
  const scene = scenes[sceneId];
  if (!scene) return;

  // Mark this scene as visited if not already
  if (!gameState.visitedScenes.includes(sceneId)) {
    gameState.visitedScenes.push(sceneId);
  }
  gameState.currentSceneId = sceneId;
  saveGameState();

  // Update text
  storyTextEl.innerHTML = scene.text;

  // Clear old choices
  choicesEl.innerHTML = '';

  // Create choice buttons
  scene.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.classList.add('choice-btn');
    btn.textContent = choice.text;
    btn.addEventListener('click', () => {
      displayScene(choice.nextSceneId);
      updateProgressBar();
    });
    choicesEl.appendChild(btn);
  });

  // If there are no choices, it might be an end scene
  if (scene.choices.length === 0) {
    // You can show a "Game Over" or "Restart" message
    const msg = document.createElement('p');
    msg.textContent = "The End! Feel free to reset the game to start over.";
    choicesEl.appendChild(msg);
  }
}

// -----------------
// Progress Bar
// -----------------
function updateProgressBar() {
  const visitedCount = gameState.visitedScenes.length;
  const percentage = Math.floor((visitedCount / totalScenes) * 100);
  progressBar.style.width = percentage + '%';
}

// -----------------
// LocalStorage
// -----------------
function saveGameState() {
  localStorage.setItem('storyGameState', JSON.stringify(gameState));
}

function loadGameState() {
  const saved = localStorage.getItem('storyGameState');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.currentSceneId && parsed.visitedScenes) {
        gameState = parsed;
      }
    } catch (error) {
      console.warn("Error parsing saved game state:", error);
    }
  }
}

// -----------------
// Reset / Restart
// -----------------
function resetGame() {
  // Clear localStorage
  localStorage.removeItem('storyGameState');
  // Reset gameState in memory
  gameState = {
    currentSceneId: 'start',
    visitedScenes: [],
  };
  displayScene(gameState.currentSceneId);
  updateProgressBar();
}
