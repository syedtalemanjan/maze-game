let maze = document.querySelector("#canvas");
let ctx = maze.getContext("2d");
const scoreElement = document.getElementById("score")

let current;
let score = 0;

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.rows = rows;
    this.columns = columns;
    this.grid = [];
    this.stack = [];

    this.input = new Input()
  }
  setup() {
    for (let x = 0; x < this.rows; x++) {
      let rows = [];
      for (let y = 0; y < this.columns; y++) {
        let cell = new Cell(x, y, this.grid, this.size,this.input);
        rows.push(cell);
      }
      this.grid.push(rows);
    }
    current = this.grid[0][0];
  }
  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";
    current.visited = true;

    if(current == this.grid[this.grid.length -1][this.grid.length -1] && this.stack.length === 0){
      score+=1;
      scoreElement.textContent = "Score: " + score;
      const mazee = new Maze(150, 10, 10);
      mazee.setup();
      mazee.draw();
      return;
    }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.columns, this.rows);
      }
    }
    current.highlight(this.columns)
    let next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      this.stack.push(current);
      current.highlight(this.columns);
      current.removeWalls(current, next);
      current = next;
    } else if (this.stack.length > 0) {
      let popedCell = this.stack.pop();
      current = popedCell;
      current.highlight(this.columns);
    }
    
    if (this.stack.length === 0 && this.input.lastKey) {
      const dir = this.input.lastKey;
    
      let nextCell = undefined;
      if (dir === "UP" && !current.walls.topWall) {
        nextCell = this.grid[current.rowNum - 1][current.colNum];
      } else if (dir === "DOWN" && !current.walls.bottomWall) {
        nextCell = this.grid[current.rowNum + 1][current.colNum];
      } else if (dir === "LEFT" && !current.walls.leftWall) {
        nextCell = this.grid[current.rowNum][current.colNum - 1];
      } else if (dir === "RIGHT" && !current.walls.rightWall) {
        nextCell = this.grid[current.rowNum][current.colNum + 1];
      }
    
      if (nextCell) {
        current = nextCell;
      }

      this.input.keys = [];
    }

    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.draw();
      });
    }, 0);
  }
}
class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize,input) {
    this.input = input;
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
    this.visited = false;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };
  }
  checkNeighbors() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbors = [];

    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length !== 0) {
      let random = Math.floor(Math.random() * neighbors.length);
      return neighbors[random];
    } else {
      return undefined;
    }
  }
  #drawTopWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }
  #drawRightWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }
  #drawBottomWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y + size / rows);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }
  #drawLeftWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  highlight(columns) {
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;

    ctx.fillStyle = "gold";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 2,
      this.parentSize / columns - 2
    );
  }
  removeWalls(currentCell, nextCell) {
    let x = currentCell.colNum - nextCell.colNum;
    let y = currentCell.rowNum - nextCell.rowNum;
    if (x === 1) {
      currentCell.walls.leftWall = false;
      nextCell.walls.rightWall = false;
    } else if (x === -1) {
      currentCell.walls.rightWall = false;
      nextCell.walls.leftWall = false;
    }
    if (y === 1) {
      currentCell.walls.topWall = false;
      nextCell.walls.bottomWall = false;
    } else if (y === -1) {
      currentCell.walls.bottomWall = false;
      nextCell.walls.topWall = false;
    }
  }
  show(size, columns, rows) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap="round"
    if (this.walls.topWall) this.#drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.#drawRightWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.#drawBottomWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.#drawLeftWall(x, y, size, columns, rows);
    if(this.visited){
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
  }
}

class Input {
  constructor() {
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" ) {
        this.keyPressed("UP");
      } else if (e.key === "ArrowDown" ) {
        this.keyPressed("DOWN");
      } else if (e.key === "ArrowLeft" ) {
        this.keyPressed("LEFT");
      } else if (e.key === "ArrowRight" ) {
        this.keyPressed("RIGHT");
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowUp" ) {
        this.keyReleased("UP");
      } else if (e.key === "ArrowDown" ) {
        this.keyReleased("DOWN");
      } else if (e.key === "ArrowLeft" ) {
        this.keyReleased("LEFT");
      } else if (e.key === "ArrowRight" ) {
        this.keyReleased("RIGHT");
      }
    });
  }

  keyPressed(key) {
    if (this.keys.indexOf(key) === -1) {
      this.keys.unshift(key);
    }
  }
  keyReleased(key) {
    const index = this.keys.indexOf(key);
    this.keys.splice(index, 1);
  }
  get lastKey() {
    return this.keys[0];
  }
}

window.addEventListener("keydown", (e) => {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault();
  }
}, false);
const mazee = new Maze(150, 10, 10);
mazee.setup();
mazee.draw();