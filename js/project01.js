// Get DOM elements
const clockElement = document.getElementById("clock");
const timeFormatSelect = document.getElementById("time-format");
const colorPicker = document.getElementById("color-picker");
const fontSizeRange = document.getElementById("font-size");
const alarmForm = document.getElementById("alarm-form");
const alarmTimeInput = document.getElementById("alarm-time");
const alarmList = document.getElementById("alarm-list");

// Global variables
let alarms = [];

// ------------------
//   Initialization
// ------------------
init();

function init() {
  loadPreferences();
  loadAlarmsFromStorage();
  updateClock();
  setInterval(updateClock, 1000); // Update clock every second

  // Event listeners
  timeFormatSelect.addEventListener("change", savePreferences);
  colorPicker.addEventListener("change", handleColorChange);
  fontSizeRange.addEventListener("input", handleFontSizeChange);
  alarmForm.addEventListener("submit", addAlarm);

  // Apply initial styles
  handleColorChange();
  handleFontSizeChange();
}

// --------------------
//   Clock Functions
// --------------------
function updateClock() {
  const now = new Date();
  const timeFormat = timeFormatSelect.value;

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // 12-Hour Format
  if (timeFormat === "12") {
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    clockElement.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${amPm}`;
  } else {
    // 24-Hour Format
    clockElement.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }

  // Check alarms
  checkAlarms(now);
}

function padZero(num) {
  return num < 10 ? "0" + num : num;
}

// --------------------
//   Preferences
// --------------------
function loadPreferences() {
  const preferences = JSON.parse(localStorage.getItem("clockPreferences"));

  if (preferences) {
    // Time Format
    if (preferences.timeFormat) {
      timeFormatSelect.value = preferences.timeFormat;
    }
    // Color
    if (preferences.color) {
      colorPicker.value = preferences.color;
    }
    // Font size
    if (preferences.fontSize) {
      fontSizeRange.value = preferences.fontSize;
    }
  }
}

function savePreferences() {
  const preferences = {
    timeFormat: timeFormatSelect.value,
    color: colorPicker.value,
    fontSize: fontSizeRange.value,
  };
  localStorage.setItem("clockPreferences", JSON.stringify(preferences));
}

function handleColorChange() {
  clockElement.style.color = colorPicker.value;
  savePreferences();
}

function handleFontSizeChange() {
  clockElement.style.fontSize = fontSizeRange.value + "px";
  savePreferences();
}

// --------------------
//   Alarm Functions
// --------------------
function loadAlarmsFromStorage() {
  const storedAlarms = JSON.parse(localStorage.getItem("alarms"));
  if (storedAlarms && Array.isArray(storedAlarms)) {
    alarms = storedAlarms;
  } else {
    alarms = [];
  }
  renderAlarmList();
}

function saveAlarmsToStorage() {
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function addAlarm(event) {
  event.preventDefault();
  const alarmTime = alarmTimeInput.value;

  if (!alarmTime) return;

  alarms.push({ time: alarmTime, active: true });
  saveAlarmsToStorage();
  renderAlarmList();
  alarmTimeInput.value = "";
}

function renderAlarmList() {
  alarmList.innerHTML = "";
  alarms.forEach((alarm, index) => {
    const li = document.createElement("li");
    li.textContent = alarm.time;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      removeAlarm(index);
    });

    li.appendChild(removeBtn);
    alarmList.appendChild(li);
  });
}

function removeAlarm(index) {
  alarms.splice(index, 1);
  saveAlarmsToStorage();
  renderAlarmList();
}

function checkAlarms(currentTime) {
  // Format current time as "HH:MM" (24-hour) for comparison
  const hours = padZero(currentTime.getHours());
  const minutes = padZero(currentTime.getMinutes());
  const currentFormatted = `${hours}:${minutes}`;

  // Trigger alarm if there's an active alarm for the current time
  alarms.forEach((alarm) => {
    if (alarm.active && alarm.time === currentFormatted) {
      // Alarm goes off
      alert("Alarm! Time is " + alarm.time);
      // You can also play an audio file or do something more fancy here.

      // Deactivate alarm so it doesn't repeat continuously
      alarm.active = false;
      saveAlarmsToStorage();
    }
  });
}
