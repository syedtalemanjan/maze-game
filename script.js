let maze = document.querySelector("#canvas");
let ctx = maze.getContext("2d");

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
        grid[r][c].show(this.size, this.columns, this.rows);
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
}