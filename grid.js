let isPlacingStartingButton = false;
let startingButton = null;
let isPlacingGoalButton = false;
let goalButton = null;
let gridState = [];
let gridSize = 0;
let start = undefined;
let goal = undefined;
let startNodes = 0;
let goalNodes = 0;
let buttons = [];
let percent = 0;
let dijkstra = false;

/*
  Function that generates an n x n grid. Includes handling for placing
  start and goal nodes, draggin and clicking to make walls, and sizing 
  the grid based on the amount of cells. Also builds the grid state array.
*/

function generateGrid() {
  clearGrid();
  percent = 0;
  gridSize = parseInt(document.getElementById("gridSize").value); // Update gridSize
  percent = parseInt(document.getElementById("percent").value); // Update percent
  if (percent < 0 || percent > 100) {
    alert("Please enter a percentage between 0 and 100!");
    return;
  }
  if (gridSize > 120) {
    gridSize = 0;
    alert("Large grid sizes could cause crashes. Please choose a grid size under");
    return;
  }
  if (gridSize < 1) {
    alert("Please enter a size greater than 0!");
    return;
  }
  const grid = document.getElementById("grid");
  grid.style.setProperty("--n", gridSize); // Set the number of columns
  // Clear any existing grid
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  gridState = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  // Generate the new grid of buttons
  buttons = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("button");
      cell.classList.add("cell");
      cell.style.backgroundColor = "#ccc";
      cell.id = row * gridSize + col;
      let pixelsSmall = Math.floor(550 / gridSize) + 'px';
      let pixelsMedium = Math.floor(1000 / gridSize) + 'px';
      if (gridSize <= 30) {
        cell.style.width = pixelsSmall;
        cell.style.height = pixelsSmall;
      } else if (gridSize > 30 && gridSize <= 60) {
        cell.style.width = pixelsMedium;
        cell.style.height = pixelsMedium;
      } else {
        cell.style.width = '15px';
        cell.style.height = '15px';
      }
      
      cell.addEventListener("click", () => {
        if (isPlacingStartingButton) {
          if (startingButton) {
            if (startingButton.style.backgroundColor != "black") {
              startingButton.style.backgroundColor = "#ccc";
              gridState[row][col] = 0;
            }
          }
          startingButton = cell;
          cell.style.backgroundColor = "green";
          gridState[row][col] = 2;
          start = row * gridSize + col;
          startNodes = 1;
        } else if (isPlacingGoalButton) {
          if (goalButton) {
            if (goalButton.style.backgroundColor != "black") {
              goalButton.style.backgroundColor = "#ccc";
              gridState[row][col] = 0;
            }
          }
          goalButton = cell;
          cell.style.backgroundColor = "red";
          goal = row * gridSize + col;
          gridState[row][col] = 3;
          goalNodes = 1;
        } else {
          if (cell.style.backgroundColor == "black") {
            cell.style.backgroundColor = "#ccc";
            gridState[row][col] = 0;
          } else if (cell.style.backgroundColor = "red") {
            cell.style.backgroundColor = "black";
            gridState[row][col] = 1;
            startNodes = 0;
          } else {
            cell.style.backgroundColor = "black";
            gridState[row][col] = 1;
            goalNodes = 0;
          }
        }
      });
      let isMouseButtonDown = false;
      addEventListener("mousedown", () => {
        isMouseButtonDown = true; // Mouse button is down
      });
      addEventListener("mouseup", () => {
        isMouseButtonDown = false; // Mouse button is released
        isDragging = false; // Reset dragging flag
      });

      cell.addEventListener("mouseover", () => {
        if (isMouseButtonDown) {
          isDragging = true;
          if (
            !(
              cell.style.backgroundColor == "green" ||
              cell.style.backgroundColor == "red"
            )
          ) {
            cell.style.backgroundColor = "black";
            gridState[row][col] = 1;
          }
        }
      });
      if (!isNaN(percent)) {
        let ran = Math.floor(Math.random() * 100);
        if (ran < percent) {
          cell.style.backgroundColor = "black";
          gridState[row][col] = 1;
        }
      }
      buttons.push(cell);
      grid.appendChild(cell);

    }
  }
} /* generateGrid() */

/*
  Resets data structures. Removes start node, goal node, and all walls from the grid. 
  Resets the gridState array.
*/

function clearGrid() {
  startNodes = 0;
  goalNodes = 0;
  resetDataStructures();
  const buttons = document.querySelectorAll(".cell");
  buttons.forEach((button) => {
    button.style.backgroundColor = "#ccc";
  });
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      gridState[i][j] = 0;
      buttons[i * gridSize + j].style.backgroundColor = "#ccc";
    }
  }
}

/*
 Resets data structures. Keeps walls and start / goal node in place.
*/

function reset() {
  resetDataStructures();
  const buttons = document.querySelectorAll(".cell");
  buttons.forEach((button) => {
    if (!(button.style.backgroundColor == "black" || button.style.backgroundColor == 'green' || button.style.backgroundColor == 'red')) {
      button.style.backgroundColor = "#ccc";
    }
  });
  buttons[start].style.backgroundColor = 'green';
  buttons[goal].style.backgroundColor = 'red';
} /* reset() */

/*
 Clears heap and resets labels
*/

function resetDataStructures() {
  resetLabels();
  heap = [];
} /* resetDataStructures() */

/*
  Passes true to generate grid function. If true, generateGrid() will fill the specified
  percentage of cells with walls.
*/

function percentage() {
  generateGrid(true);
} /* percentage() */

/*
  Passes true to path finding function
*/

function solveWithDijkstra() {
  dijkstra = true;
  solveWithAstar(dijkstra);
} /* solveWithDijkstra() */

/*
  Calls the path finding function. Passes true for dijkstra and false for A*
*/

function solveWithAstar(dijkstra) {
  if (startNodes != 1 || goalNodes != 1) {
    alert("Select a start and goal node!");
    return;
  }
  if (heap.length != 0) {
    alert("Please clear the grid!");
    return;
  }
  findPath(dijkstra);
} /* solveWithAstar() */

/*
  Label and button checkers
*/

document
  .getElementById("placeStartingButton")
  .addEventListener("change", (event) => {
    isPlacingStartingButton = event.target.checked;

    // If "Place Starting Button" is checked, uncheck "Place Goal Button"
    if (isPlacingStartingButton) {
      document.getElementById("placeGoalButton").checked = false;
      isPlacingGoalButton = false;
    }
  });

document
  .getElementById("placeGoalButton")
  .addEventListener("change", (event) => {
    isPlacingGoalButton = event.target.checked;

    // If "Place Goal Button" is checked, uncheck "Place Starting Button"
    if (isPlacingGoalButton) {
      document.getElementById("placeStartingButton").checked = false;
      isPlacingStartingButton = false;
    }
  });

document
  .getElementById("placeStartingButton")
  .addEventListener("change", (event) => {
    isPlacingStartingButton = event.target.checked;
  });
document
  .getElementById("placeGoalButton")
  .addEventListener("change", (event) => {
    isPlacingGoalButton = event.target.checked;
  });

  function resetLabels() {
    document.getElementById(
      "searchCounter"
    ).textContent = `Nodes Searched: ${0}`;
    document.getElementById(
      "nodesInPath"
    ).textContent = `Nodes In Path: ${0}`;
    document.getElementById(
      "pathLength"
    ).textContent = `Path Length: ${0}`;
  }