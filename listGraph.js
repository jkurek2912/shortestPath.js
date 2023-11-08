class ListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
let heap = [];
let lg = [];
let g = [gridSize];
let h = [gridSize];
let tc = [gridSize];
let rainbow = ["red", "orange", "yellow", "green", "blue", "violet"];
let nodesSearched = 0;
let nodesInPath = 0;
let pathLength = 0;
let inst = false;

function addToHeap(num) {
  heap.push(num);
  swim(heap.length - 1);
}

function removeFromHeap(num) {
  for (let i = 0; i < heap.length; i++) {
    if (heap[i] == num) {
      return sink(i);
    }
  }
}

function swim(num) {
  while (num > 0 && less(Math.floor(num / 2), num)) {
    swap(num, Math.floor(num / 2));
    num = Math.floor(num / 2);
  }
}

function sink(num) {
  swap(num, heap.length - 1);
  let a = heap.pop();
  while (2 * num + 1 < heap.length) {
    let j = 2 * num + 1;
    if (j < heap.length - 1 && less(j, j + 1)) j++;
    if (!less(num, j)) break;
    swap(num, j);
    num = j;
  }
  return a;
}

function less(i, j) {
  return tc[heap[i]] > tc[heap[j]];
}

function swap(i, j) {
  let temp = heap[i];
  heap[i] = heap[j];
  heap[j] = temp;
}

function contains(num) {
  for (let i = 0; i < heap.length; i++) {
    if (heap[i] == num) return true;
  }
  return false;
}

function makeListGraph(size, dijkstra) {
  if (startNodes != 1 || goalNodes != 1) {
    //alert("Enter a starting node and a goal node!");
    //return;
  }
  gridSize = size;
  const neighbors = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (gridState[i][j] != 1) {
        if (inBounds(i - 1, j - 1) && gridState[i - 1][j - 1] != 1) {
          neighbors.push((i - 1) * gridSize + j - 1);
        }
        if (inBounds(i - 1, j) && gridState[i - 1][j] != 1) {
          neighbors.push((i - 1) * gridSize + j);
        }
        if (inBounds(i - 1, j + 1) && gridState[i - 1][j + 1] != 1) {
          neighbors.push((i - 1) * gridSize + j + 1);
        }
        if (inBounds(i, j - 1) && gridState[i][j - 1] != 1) {
          neighbors.push(i * gridSize + j - 1);
        }
        if (inBounds(i, j + 1) && gridState[i][j + 1] != 1) {
          neighbors.push(i * gridSize + j + 1);
        }
        if (inBounds(i + 1, j - 1) && gridState[i + 1][j - 1] != 1) {
          neighbors.push((i + 1) * gridSize + j - 1);
        }
        if (inBounds(i + 1, j) && gridState[i + 1][j] != 1) {
          neighbors.push((i + 1) * gridSize + j);
        }
        if (inBounds(i + 1, j + 1) && gridState[i + 1][j + 1] != 1) {
          neighbors.push((i + 1) * gridSize + j + 1);
        }
        let head = null; // Initialize head as null

        while (neighbors.length != 0) {
          const node = new ListNode(neighbors.pop());
          node.next = head;
          head = node;
        }
        lg[i * gridSize + j] = head;
      }
    }
  }
  findPath(lg, dijkstra);
}

function inBounds(i, j) {
  if (i < 0 || j < 0 || i > gridSize - 1 || j > gridSize - 1) return false;
  return true;
}

function coordinate(num) {
  let x = Math.floor(num / gridSize);
  let y = num % gridSize;
  return [x, y];
}

function distance(node1, node2) {
  let a = coordinate(node1);
  let b = coordinate(node2);
  let xDiff = a[0] - b[0];
  let yDiff = a[1] - b[1];
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
}

const animationSpeedSlider = document.getElementById("animationSpeedSlider");
let animationSpeed = mapSpeedValue(animationSpeedSlider.value);

// Function to handle slider changes
animationSpeedSlider.addEventListener("input", () => {
  animationSpeed = mapSpeedValue(animationSpeedSlider.value);
});

function mapSpeedValue(sliderValue) {
  // Map slider values: 1 (min) to 10 (max) => 10 (slowest) to 1 (fastest)
  const minValue = 1;
  const maxValue = 200;
  const newMinValue = 200;
  const newMaxValue = 1;
  return (
    ((newMaxValue - newMinValue) * (sliderValue - minValue)) /
      (maxValue - minValue) +
    newMinValue
  );
}

function instant() {
  inst = true;
}

async function findPath(lg, dijkstra) {
  document.getElementById("searchCounter").textContent = `Nodes Searched: ${0}`;
  document.getElementById("nodesInPath").textContent = `Nodes In Path: ${0}`;
  document.getElementById("pathLength").textContent = `Path Length: ${0}`;
  inst = false;
  nodesInPath = 0;
  nodesSearched = 0;
  let closed = new Set();
  let parent = [];
  let found = false;
  tc = [];
  g = [];
  h = [];
  addToHeap(start);
  g[start] = 0;
  h[start] = distance(start, goal);
  while (heap.length != 0) {
    let current = removeFromHeap(heap[0]);
    closed.add(current);
    nodesSearched++;
    document.getElementById(
      "searchCounter"
    ).textContent = `Nodes Searched: ${nodesSearched}`; //increments the nodesSearched value
    if (current !== start && current !== goal) {
      buttons[current].style.backgroundColor = "#ae20c7"; //purple
    }
    if (current == goal) {
      found = true;
      g[goal] = g[current] + distance(current, goal);
      break;
    }
    h[current] = distance(current, goal);
    tc[current] = g[current];
    if (!dijkstra) {
      tc[current] += h[current];
    }
    let node = lg[current];
    while (node != null) {
      if (!closed.has(node.data)) {
        if (node.data !== start && node.data !== goal) {
          if (!inst) {
            await new Promise((resolve) => setTimeout(resolve, animationSpeed));
          }
          buttons[node.data].style.backgroundColor = "#19e3cb"; //teal
        }
        if (!contains(node.data)) {
          g[node.data] = g[current] + distance(node.data, current);
          h[node.data] = distance(node.data, goal);
          tc[node.data] = g[node.data];
          if (!dijkstra) {
            tc[node.data] += h[node.data];
          }
          addToHeap(node.data);
          parent[node.data] = current;
        } else {
          let g2 = g[current] + distance(node.data, current);
          if (g2 <= g[node.data]) {
            removeFromHeap(node.data);
            g[node.data] = g2;
            tc[node.data] = g[node.data];
            if (!dijkstra) {
              tc[node.data] += h[node.data];
            }

            addToHeap(node.data);
            parent[node.data] = current;
          }
        }
      }
      node = node.next;
    }
  }
  heap.push(-1); // adds a dummy node to the heap to fix the edge case where the entire heap gets popped before finding the goal.
  // This would make the heap empty, allowing the user to start a new search without reseting the grid.
  let pathList = [gridSize * gridSize];
  if (!found) alert("No path!");
  let p = goal;
  while (p != start) {
    pathList.push(p);
    p = parent[p];
  }
  pathList.push(p);
  let path = [];
  let index = pathList.length - 1;
  for (let i = 0; i < pathList.length; i++) {
    document.getElementById("nodesInPath").textContent = `Nodes In Path: ${i}`;
    path[i] = pathList[index--];
    document.getElementById("pathLength").textContent = `Path Length: ${g[
      path[i]
    ].toFixed(2)}`;
    if (path[i] !== start && path[i] !== goal) {
      buttons[path[i]].style.backgroundColor = "orange";
      if (!inst) {
        await new Promise((resolve) => setTimeout(resolve, animationSpeed + 60));
      }
      buttons[path[i]].style.backgroundColor = "blue";
    }
  }
}
