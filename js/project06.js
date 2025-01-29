/**
 * Interactive Periodic Table
 * - Exactly arranged in a standard 18-column layout (plus separate rows for Lanthanides & Actinides).
 * - Click an element to see details.
 * - Search by name, symbol, or atomic number.
 * - Highlights the selected element and all elements in the same group.
 */

// Reference to DOM elements
const periodicTableDiv = document.getElementById('periodic-table');
const infoPanel = document.getElementById('info-panel');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// A large array of element data
// Each element includes: atomicNumber, symbol, name, group, period, category, x, y, etc.
const elementsData = [
  // Row 1
  { atomicNumber: 1, symbol: "H",  name: "Hydrogen",         group: 1,  period: 1, category: "nonmetal",          xpos: 1,  ypos: 1 },
  { atomicNumber: 2, symbol: "He", name: "Helium",           group: 18, period: 1, category: "noble gas",         xpos: 18, ypos: 1 },

  // Row 2
  { atomicNumber: 3, symbol: "Li", name: "Lithium",          group: 1,  period: 2, category: "alkali metal",      xpos: 1,  ypos: 2 },
  { atomicNumber: 4, symbol: "Be", name: "Beryllium",        group: 2,  period: 2, category: "alkaline earth",    xpos: 2,  ypos: 2 },
  { atomicNumber: 5, symbol: "B",  name: "Boron",            group: 13, period: 2, category: "metalloid",         xpos: 13, ypos: 2 },
  { atomicNumber: 6, symbol: "C",  name: "Carbon",           group: 14, period: 2, category: "nonmetal",          xpos: 14, ypos: 2 },
  { atomicNumber: 7, symbol: "N",  name: "Nitrogen",         group: 15, period: 2, category: "nonmetal",          xpos: 15, ypos: 2 },
  { atomicNumber: 8, symbol: "O",  name: "Oxygen",           group: 16, period: 2, category: "nonmetal",          xpos: 16, ypos: 2 },
  { atomicNumber: 9, symbol: "F",  name: "Fluorine",         group: 17, period: 2, category: "halogen",           xpos: 17, ypos: 2 },
  { atomicNumber: 10, symbol: "Ne",name: "Neon",             group: 18, period: 2, category: "noble gas",         xpos: 18, ypos: 2 },

  // Row 3
  { atomicNumber: 11, symbol: "Na", name: "Sodium",          group: 1,  period: 3, category: "alkali metal",      xpos: 1,  ypos: 3 },
  { atomicNumber: 12, symbol: "Mg", name: "Magnesium",       group: 2,  period: 3, category: "alkaline earth",    xpos: 2,  ypos: 3 },
  { atomicNumber: 13, symbol: "Al", name: "Aluminium",       group: 13, period: 3, category: "post-transition",   xpos: 13, ypos: 3 },
  { atomicNumber: 14, symbol: "Si", name: "Silicon",         group: 14, period: 3, category: "metalloid",         xpos: 14, ypos: 3 },
  { atomicNumber: 15, symbol: "P",  name: "Phosphorus",      group: 15, period: 3, category: "nonmetal",          xpos: 15, ypos: 3 },
  { atomicNumber: 16, symbol: "S",  name: "Sulfur",          group: 16, period: 3, category: "nonmetal",          xpos: 16, ypos: 3 },
  { atomicNumber: 17, symbol: "Cl", name: "Chlorine",        group: 17, period: 3, category: "halogen",           xpos: 17, ypos: 3 },
  { atomicNumber: 18, symbol: "Ar", name: "Argon",           group: 18, period: 3, category: "noble gas",         xpos: 18, ypos: 3 },

  // Row 4
  { atomicNumber: 19, symbol: "K",   name: "Potassium",      group: 1,  period: 4, category: "alkali metal",      xpos: 1,  ypos: 4 },
  { atomicNumber: 20, symbol: "Ca",  name: "Calcium",        group: 2,  period: 4, category: "alkaline earth",    xpos: 2,  ypos: 4 },
  { atomicNumber: 21, symbol: "Sc",  name: "Scandium",       group: 3,  period: 4, category: "transition metal",  xpos: 3,  ypos: 4 },
  { atomicNumber: 22, symbol: "Ti",  name: "Titanium",       group: 4,  period: 4, category: "transition metal",  xpos: 4,  ypos: 4 },
  { atomicNumber: 23, symbol: "V",   name: "Vanadium",       group: 5,  period: 4, category: "transition metal",  xpos: 5,  ypos: 4 },
  { atomicNumber: 24, symbol: "Cr",  name: "Chromium",       group: 6,  period: 4, category: "transition metal",  xpos: 6,  ypos: 4 },
  { atomicNumber: 25, symbol: "Mn",  name: "Manganese",      group: 7,  period: 4, category: "transition metal",  xpos: 7,  ypos: 4 },
  { atomicNumber: 26, symbol: "Fe",  name: "Iron",           group: 8,  period: 4, category: "transition metal",  xpos: 8,  ypos: 4 },
  { atomicNumber: 27, symbol: "Co",  name: "Cobalt",         group: 9,  period: 4, category: "transition metal",  xpos: 9,  ypos: 4 },
  { atomicNumber: 28, symbol: "Ni",  name: "Nickel",         group: 10, period: 4, category: "transition metal",  xpos: 10, ypos: 4 },
  { atomicNumber: 29, symbol: "Cu",  name: "Copper",         group: 11, period: 4, category: "transition metal",  xpos: 11, ypos: 4 },
  { atomicNumber: 30, symbol: "Zn",  name: "Zinc",           group: 12, period: 4, category: "transition metal",  xpos: 12, ypos: 4 },
  { atomicNumber: 31, symbol: "Ga",  name: "Gallium",        group: 13, period: 4, category: "post-transition",   xpos: 13, ypos: 4 },
  { atomicNumber: 32, symbol: "Ge",  name: "Germanium",      group: 14, period: 4, category: "metalloid",         xpos: 14, ypos: 4 },
  { atomicNumber: 33, symbol: "As",  name: "Arsenic",        group: 15, period: 4, category: "metalloid",         xpos: 15, ypos: 4 },
  { atomicNumber: 34, symbol: "Se",  name: "Selenium",       group: 16, period: 4, category: "nonmetal",          xpos: 16, ypos: 4 },
  { atomicNumber: 35, symbol: "Br",  name: "Bromine",        group: 17, period: 4, category: "halogen",           xpos: 17, ypos: 4 },
  { atomicNumber: 36, symbol: "Kr",  name: "Krypton",        group: 18, period: 4, category: "noble gas",         xpos: 18, ypos: 4 },

  // Row 5
  { atomicNumber: 37, symbol: "Rb",  name: "Rubidium",       group: 1,  period: 5, category: "alkali metal",      xpos: 1,  ypos: 5 },
  { atomicNumber: 38, symbol: "Sr",  name: "Strontium",      group: 2,  period: 5, category: "alkaline earth",    xpos: 2,  ypos: 5 },
  { atomicNumber: 39, symbol: "Y",   name: "Yttrium",        group: 3,  period: 5, category: "transition metal",  xpos: 3,  ypos: 5 },
  { atomicNumber: 40, symbol: "Zr",  name: "Zirconium",      group: 4,  period: 5, category: "transition metal",  xpos: 4,  ypos: 5 },
  { atomicNumber: 41, symbol: "Nb",  name: "Niobium",        group: 5,  period: 5, category: "transition metal",  xpos: 5,  ypos: 5 },
  { atomicNumber: 42, symbol: "Mo",  name: "Molybdenum",     group: 6,  period: 5, category: "transition metal",  xpos: 6,  ypos: 5 },
  { atomicNumber: 43, symbol: "Tc",  name: "Technetium",     group: 7,  period: 5, category: "transition metal",  xpos: 7,  ypos: 5 },
  { atomicNumber: 44, symbol: "Ru",  name: "Ruthenium",      group: 8,  period: 5, category: "transition metal",  xpos: 8,  ypos: 5 },
  { atomicNumber: 45, symbol: "Rh",  name: "Rhodium",        group: 9,  period: 5, category: "transition metal",  xpos: 9,  ypos: 5 },
  { atomicNumber: 46, symbol: "Pd",  name: "Palladium",      group: 10, period: 5, category: "transition metal",  xpos: 10, ypos: 5 },
  { atomicNumber: 47, symbol: "Ag",  name: "Silver",         group: 11, period: 5, category: "transition metal",  xpos: 11, ypos: 5 },
  { atomicNumber: 48, symbol: "Cd",  name: "Cadmium",        group: 12, period: 5, category: "transition metal",  xpos: 12, ypos: 5 },
  { atomicNumber: 49, symbol: "In",  name: "Indium",         group: 13, period: 5, category: "post-transition",   xpos: 13, ypos: 5 },
  { atomicNumber: 50, symbol: "Sn",  name: "Tin",            group: 14, period: 5, category: "post-transition",   xpos: 14, ypos: 5 },
  { atomicNumber: 51, symbol: "Sb",  name: "Antimony",       group: 15, period: 5, category: "metalloid",         xpos: 15, ypos: 5 },
  { atomicNumber: 52, symbol: "Te",  name: "Tellurium",      group: 16, period: 5, category: "metalloid",         xpos: 16, ypos: 5 },
  { atomicNumber: 53, symbol: "I",   name: "Iodine",         group: 17, period: 5, category: "halogen",           xpos: 17, ypos: 5 },
  { atomicNumber: 54, symbol: "Xe",  name: "Xenon",          group: 18, period: 5, category: "noble gas",         xpos: 18, ypos: 5 },

  // Row 6
  { atomicNumber: 55, symbol: "Cs",  name: "Cesium",         group: 1,  period: 6, category: "alkali metal",      xpos: 1,  ypos: 6 },
  { atomicNumber: 56, symbol: "Ba",  name: "Barium",         group: 2,  period: 6, category: "alkaline earth",    xpos: 2,  ypos: 6 },
  // Lanthanide row placeholders in group 3 for periods 6 & 7
  { atomicNumber: 57, symbol: "La",  name: "Lanthanum",      group: 3,  period: 6, category: "lanthanide",        xpos: 3,  ypos: 9}, 
  { atomicNumber: 58, symbol: "Ce",  name: "Cerium",         group: 3,  period: 6, category: "lanthanide",        xpos: 4,  ypos: 9},
  { atomicNumber: 59, symbol: "Pr",  name: "Praseodymium",   group: 3,  period: 6, category: "lanthanide",        xpos: 5,  ypos: 9},
  { atomicNumber: 60, symbol: "Nd",  name: "Neodymium",      group: 3,  period: 6, category: "lanthanide",        xpos: 6,  ypos: 9},
  { atomicNumber: 61, symbol: "Pm",  name: "Promethium",     group: 3,  period: 6, category: "lanthanide",        xpos: 7,  ypos: 9},
  { atomicNumber: 62, symbol: "Sm",  name: "Samarium",       group: 3,  period: 6, category: "lanthanide",        xpos: 8,  ypos: 9},
  { atomicNumber: 63, symbol: "Eu",  name: "Europium",       group: 3,  period: 6, category: "lanthanide",        xpos: 9,  ypos: 9},
  { atomicNumber: 64, symbol: "Gd",  name: "Gadolinium",     group: 3,  period: 6, category: "lanthanide",        xpos: 10, ypos: 9},
  { atomicNumber: 65, symbol: "Tb",  name: "Terbium",        group: 3,  period: 6, category: "lanthanide",        xpos: 11, ypos: 9},
  { atomicNumber: 66, symbol: "Dy",  name: "Dysprosium",     group: 3,  period: 6, category: "lanthanide",        xpos: 12, ypos: 9},
  { atomicNumber: 67, symbol: "Ho",  name: "Holmium",        group: 3,  period: 6, category: "lanthanide",        xpos: 13, ypos: 9},
  { atomicNumber: 68, symbol: "Er",  name: "Erbium",         group: 3,  period: 6, category: "lanthanide",        xpos: 14, ypos: 9},
  { atomicNumber: 69, symbol: "Tm",  name: "Thulium",        group: 3,  period: 6, category: "lanthanide",        xpos: 15, ypos: 9},
  { atomicNumber: 70, symbol: "Yb",  name: "Ytterbium",      group: 3,  period: 6, category: "lanthanide",        xpos: 16, ypos: 9},
  { atomicNumber: 71, symbol: "Lu",  name: "Lutetium",       group: 3,  period: 6, category: "lanthanide",        xpos: 17, ypos: 9},

  { atomicNumber: 72, symbol: "Hf",  name: "Hafnium",        group: 4,  period: 6, category: "transition metal",  xpos: 4,  ypos: 6 },
  { atomicNumber: 73, symbol: "Ta",  name: "Tantalum",       group: 5,  period: 6, category: "transition metal",  xpos: 5,  ypos: 6 },
  { atomicNumber: 74, symbol: "W",   name: "Tungsten",       group: 6,  period: 6, category: "transition metal",  xpos: 6,  ypos: 6 },
  { atomicNumber: 75, symbol: "Re",  name: "Rhenium",        group: 7,  period: 6, category: "transition metal",  xpos: 7,  ypos: 6 },
  { atomicNumber: 76, symbol: "Os",  name: "Osmium",         group: 8,  period: 6, category: "transition metal",  xpos: 8,  ypos: 6 },
  { atomicNumber: 77, symbol: "Ir",  name: "Iridium",        group: 9,  period: 6, category: "transition metal",  xpos: 9,  ypos: 6 },
  { atomicNumber: 78, symbol: "Pt",  name: "Platinum",       group: 10, period: 6, category: "transition metal",  xpos: 10, ypos: 6 },
  { atomicNumber: 79, symbol: "Au",  name: "Gold",           group: 11, period: 6, category: "transition metal",  xpos: 11, ypos: 6 },
  { atomicNumber: 80, symbol: "Hg",  name: "Mercury",        group: 12, period: 6, category: "transition metal",  xpos: 12, ypos: 6 },
  { atomicNumber: 81, symbol: "Tl",  name: "Thallium",       group: 13, period: 6, category: "post-transition",   xpos: 13, ypos: 6 },
  { atomicNumber: 82, symbol: "Pb",  name: "Lead",           group: 14, period: 6, category: "post-transition",   xpos: 14, ypos: 6 },
  { atomicNumber: 83, symbol: "Bi",  name: "Bismuth",        group: 15, period: 6, category: "post-transition",   xpos: 15, ypos: 6 },
  { atomicNumber: 84, symbol: "Po",  name: "Polonium",       group: 16, period: 6, category: "metalloid",         xpos: 16, ypos: 6 },
  { atomicNumber: 85, symbol: "At",  name: "Astatine",       group: 17, period: 6, category: "halogen",           xpos: 17, ypos: 6 },
  { atomicNumber: 86, symbol: "Rn",  name: "Radon",          group: 18, period: 6, category: "noble gas",         xpos: 18, ypos: 6 },

  // Row 7
  { atomicNumber: 87, symbol: "Fr",  name: "Francium",       group: 1,  period: 7, category: "alkali metal",      xpos: 1,  ypos: 7 },
  { atomicNumber: 88, symbol: "Ra",  name: "Radium",         group: 2,  period: 7, category: "alkaline earth",    xpos: 2,  ypos: 7 },
  { atomicNumber: 89, symbol: "Ac",  name: "Actinium",       group: 3,  period: 7, category: "actinide",          xpos: 3,  ypos: 10 },
  { atomicNumber: 90, symbol: "Th",  name: "Thorium",        group: 3,  period: 7, category: "actinide",          xpos: 4,  ypos: 10 },
  { atomicNumber: 91, symbol: "Pa",  name: "Protactinium",   group: 3,  period: 7, category: "actinide",          xpos: 5,  ypos: 10 },
  { atomicNumber: 92, symbol: "U",   name: "Uranium",        group: 3,  period: 7, category: "actinide",          xpos: 6,  ypos: 10 },
  { atomicNumber: 93, symbol: "Np",  name: "Neptunium",      group: 3,  period: 7, category: "actinide",          xpos: 7,  ypos: 10 },
  { atomicNumber: 94, symbol: "Pu",  name: "Plutonium",      group: 3,  period: 7, category: "actinide",          xpos: 8,  ypos: 10 },
  { atomicNumber: 95, symbol: "Am",  name: "Americium",      group: 3,  period: 7, category: "actinide",          xpos: 9,  ypos: 10 },
  { atomicNumber: 96, symbol: "Cm",  name: "Curium",         group: 3,  period: 7, category: "actinide",          xpos: 10, ypos: 10 },
  { atomicNumber: 97, symbol: "Bk",  name: "Berkelium",      group: 3,  period: 7, category: "actinide",          xpos: 11, ypos: 10 },
  { atomicNumber: 98, symbol: "Cf",  name: "Californium",    group: 3,  period: 7, category: "actinide",          xpos: 12, ypos: 10 },
  { atomicNumber: 99, symbol: "Es",  name: "Einsteinium",    group: 3,  period: 7, category: "actinide",          xpos: 13, ypos: 10 },
  { atomicNumber: 100, symbol: "Fm", name: "Fermium",        group: 3,  period: 7, category: "actinide",          xpos: 14, ypos: 10 },
  { atomicNumber: 101, symbol: "Md", name: "Mendelevium",    group: 3,  period: 7, category: "actinide",          xpos: 15, ypos: 10 },
  { atomicNumber: 102, symbol: "No", name: "Nobelium",       group: 3,  period: 7, category: "actinide",          xpos: 16, ypos: 10 },
  { atomicNumber: 103, symbol: "Lr", name: "Lawrencium",     group: 3,  period: 7, category: "actinide",          xpos: 17, ypos: 10 },

  { atomicNumber: 104, symbol: "Rf", name: "Rutherfordium",  group: 4,  period: 7, category: "transition metal",  xpos: 4,  ypos: 7 },
  { atomicNumber: 105, symbol: "Db", name: "Dubnium",        group: 5,  period: 7, category: "transition metal",  xpos: 5,  ypos: 7 },
  { atomicNumber: 106, symbol: "Sg", name: "Seaborgium",     group: 6,  period: 7, category: "transition metal",  xpos: 6,  ypos: 7 },
  { atomicNumber: 107, symbol: "Bh", name: "Bohrium",        group: 7,  period: 7, category: "transition metal",  xpos: 7,  ypos: 7 },
  { atomicNumber: 108, symbol: "Hs", name: "Hassium",        group: 8,  period: 7, category: "transition metal",  xpos: 8,  ypos: 7 },
  { atomicNumber: 109, symbol: "Mt", name: "Meitnerium",     group: 9,  period: 7, category: "transition metal",  xpos: 9,  ypos: 7 },
  { atomicNumber: 110, symbol: "Ds", name: "Darmstadtium",   group: 10, period: 7, category: "transition metal",  xpos: 10, ypos: 7 },
  { atomicNumber: 111, symbol: "Rg", name: "Roentgenium",    group: 11, period: 7, category: "transition metal",  xpos: 11, ypos: 7 },
  { atomicNumber: 112, symbol: "Cn", name: "Copernicium",    group: 12, period: 7, category: "transition metal",  xpos: 12, ypos: 7 },
  { atomicNumber: 113, symbol: "Nh", name: "Nihonium",       group: 13, period: 7, category: "post-transition",   xpos: 13, ypos: 7 },
  { atomicNumber: 114, symbol: "Fl", name: "Flerovium",      group: 14, period: 7, category: "post-transition",   xpos: 14, ypos: 7 },
  { atomicNumber: 115, symbol: "Mc", name: "Moscovium",      group: 15, period: 7, category: "post-transition",   xpos: 15, ypos: 7 },
  { atomicNumber: 116, symbol: "Lv", name: "Livermorium",    group: 16, period: 7, category: "post-transition",   xpos: 16, ypos: 7 },
  { atomicNumber: 117, symbol: "Ts", name: "Tennessine",     group: 17, period: 7, category: "halogen",           xpos: 17, ypos: 7 },
  { atomicNumber: 118, symbol: "Og", name: "Oganesson",      group: 18, period: 7, category: "noble gas",         xpos: 18, ypos: 7 },
];

// We know the main table is 7 rows (periods) + 2 separate rows for lanthanides & actinides
// 18 columns for each row
// Some cells are empty placeholders

// Generate the table by creating 10 "rows" (7 main + 2 for lanth/act + 1 is effectively empty spacing)
const totalRows = 10; // We'll handle row #9 for lanthanides, row #10 for actinides
const totalCols = 18;

function createPeriodicTable() {
  // First, create an array [row][col] of null
  const grid = [];
  for (let r = 1; r <= totalRows; r++) {
    grid[r] = [];
    for (let c = 1; c <= totalCols; c++) {
      grid[r][c] = null;
    }
  }

  // Place each element in grid[row][col]
  elementsData.forEach(el => {
    const row = el.ypos; 
    const col = el.xpos;
    grid[row][col] = el;
  });

  // Build the HTML
  // We'll create a totalRows * totalCols grid
  grid.forEach((rowArray, rowIndex) => {
    rowArray.forEach((elementObj, colIndex) => {
      const cell = document.createElement('div');
      cell.style.gridRow = rowIndex;
      cell.style.gridColumn = colIndex;
      // cell styling:
      cell.classList.add('element-cell');

      if (!elementObj) {
        // If no element belongs here, hide the cell
        cell.classList.add('hidden-cell');
      } else {
        cell.setAttribute('data-atomic-number', elementObj.atomicNumber);
        cell.setAttribute('data-symbol', elementObj.symbol);
        cell.setAttribute('data-name', elementObj.name);
        cell.setAttribute('data-group', elementObj.group);
        cell.setAttribute('data-category', elementObj.category);

        cell.innerHTML = `
          <div class="atomic-number">${elementObj.atomicNumber}</div>
          <div class="symbol">${elementObj.symbol}</div>
          <div class="element-name">${elementObj.name}</div>
        `;

        // Add click handler to show info
        cell.addEventListener('click', () => handleElementClick(elementObj, cell));
      }
      periodicTableDiv.appendChild(cell);
    });
  });
}

function handleElementClick(elementObj, cellDiv) {
  // Clear any existing highlight
  clearHighlight();

  // Highlight the clicked element
  cellDiv.classList.add('highlight');

  // Also highlight the entire group
  highlightGroup(elementObj.group);

  // Show info in the info panel
  infoPanel.style.display = 'block';
  infoPanel.innerHTML = `
    <h2>${elementObj.name} (${elementObj.symbol})</h2>
    <p><strong>Atomic Number:</strong> ${elementObj.atomicNumber}</p>
    <p><strong>Group:</strong> ${elementObj.group}</p>
    <p><strong>Period:</strong> ${elementObj.period}</p>
    <p><strong>Category:</strong> ${elementObj.category}</p>
  `;
}

function clearHighlight() {
  const allCells = periodicTableDiv.querySelectorAll('.element-cell');
  allCells.forEach(cell => {
    cell.classList.remove('highlight', 'group-highlight');
  });
}

function highlightGroup(groupNumber) {
  const allCells = periodicTableDiv.querySelectorAll('.element-cell');
  allCells.forEach(cell => {
    if (parseInt(cell.getAttribute('data-group')) === groupNumber) {
      cell.classList.add('group-highlight');
    }
  });
}

// ==================== Search ====================
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  // Attempt to match atomic number, symbol, or name
  let resultElement = null;

  // 1) Check if query is an atomic number
  const atomicNumber = parseInt(query, 10);
  if (!isNaN(atomicNumber)) {
    resultElement = elementsData.find(el => el.atomicNumber === atomicNumber);
  }
  
  // 2) If not found, check symbol
  if (!resultElement) {
    resultElement = elementsData.find(el => el.symbol.toLowerCase() === query);
  }

  // 3) If still not found, check name
  if (!resultElement) {
    resultElement = elementsData.find(el => el.name.toLowerCase() === query);
  }

  if (resultElement) {
    // We found a match; find its cell and highlight
    const matchingCell = periodicTableDiv.querySelector(
      `.element-cell[data-atomic-number="${resultElement.atomicNumber}"]`
    );
    if (matchingCell) {
      // Simulate a click on that cell
      matchingCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      matchingCell.click(); 
    }
  } else {
    // If no match found
    alert("No element found for your search query.");
  }
}

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Initialize table
createPeriodicTable();
