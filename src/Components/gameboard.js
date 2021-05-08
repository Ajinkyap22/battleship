class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
    this.allSunk = false;
  }

  init(size) {
    for (let i = 0; i < size; i++) {
      this.board.push({ hasShip: false, isHit: false });
    }
  }

  markAsShip(pos) {
    this.board[pos].hasShip = true;
  }

  markAsHit(coords) {
    const ship = this.ships.find((ship) => ship.cells.includes(coords));
    const index = ship.cells.indexOf(coords);
    ship.ship.hit(index);
    ship.ship.isSunk();
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
      this.markAsShip(i);
      cells.push(i);
    }

    this.ships.push({ ship, cells });
  }

  receiveAttack(coords) {
    // Error handling
    if (this.board[coords].isHit) {
      throw new Error("Already hit");
    }

    // Mark coord as hit
    this.board[coords].isHit = true;

    // Mark ship as hit
    if (this.board[coords].hasShip) {
      this.markAsHit(coords);
    }

    // Determine whether ship has been sunk
    this.allShipsSunk();
  }

  allShipsSunk() {
    this.allSunk = this.ships.every((ship) => ship.ship.sunk);
  }
}

export default Gameboard;
