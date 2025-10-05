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
}
class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
  }
}