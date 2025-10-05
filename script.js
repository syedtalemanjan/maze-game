let maze = document.querySelector("#canvas");
let ctx = maze.getContext("2d");

let current;

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.rows = rows;
    this.columns = columns;
    this.grid = [];
  }
  setup() {
    for (let x = 0; x < this.rows; x++) {
      let rows = [];
      for (let y = 0; y < this.columns; y++) {
        let cell = new Cell(x, y, this.grid, this.size);
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

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        // grid[r][c].show(this.size, this.columns, this.rows);
      }
    }

    if (this.stack.length === 0) {
      return;
    }
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.draw();
      });
    }, 0);
  }
}

class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
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
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size);
    }
  }
}
const mazee = new Maze(1000, 25, 25);
mazee.setup();
mazee.draw();
