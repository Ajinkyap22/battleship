class Ship {
  constructor(length, sunk = false) {
    this.length = length;
    this.sunk = sunk;
    this.cells = [];
    this.adjCoords = [];
    this.positions = Array(this.length).fill(0);
    this.placed = false;
  }

  hit(pos) {
    this.positions[pos] = 1;
  }

  isSunk() {
    this.sunk = this.positions.every((pos) => pos == 1);
    return this.sunk;
  }
}

export default Ship;
