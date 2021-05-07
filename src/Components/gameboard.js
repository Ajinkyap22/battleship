class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
  }

  init(size) {
    for (let i = 0; i < size; i++) {
      this.board.push({ hasShip: false, isHit: false });
    }
  }

  placeShip(ship, coords) {
    const cells = [];
    if (
      coords + ship.length > this.board.length ||
      coords > this.board.length ||
      ship.length > this.board.length
    ) {
      throw new Error("Cannot place the ship here");
    }
    for (let i = coords; i < coords + ship.length; i++) {
      this.board[i].hasShip = true;
      cells.push(i);
    }
    this.ships.push({ ship, cells });
  }

  receiveAttack(coords) {
    // Error handling
    if (this.board[corrds].isHit) {
      throw new Error("Already hit");
    }
    // Mark coord as hit
    this.board[coord].isHit = true;
    // Mark ship as hit
    if (this.board[coords].hasShip) {
      const ship = this.ships.find((ship) => ship.cells.includes(coords));
      ship.hit();
    }
    // Determine whether ship has been sunk
  }
}

module.exports = { Gameboard };
