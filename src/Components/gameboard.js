import Ship from "../Components/ship";

class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
    this.size = 0;
    this.allSunk = false;
    this.allPlaced = false;
  }

  init(size) {
    for (let i = 0; i < size; i++) {
      this.board.push({ hasShip: false, isHit: false });
    }
    this.size = size;
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

  createShips() {
    const sizes = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

    for (const size of sizes) {
      const ship = new Ship(size);
      this.ships.push(ship);
    }
  }

  validateCoords(ship, coords) {
    if (
      coords + ship.length > this.board.length ||
      coords > this.board.length ||
      ship.length > this.board.length
    ) {
      return false;
    }

    for (let i = coords; i < coords + ship.length; i++) {
      if (this.board[i].hasShip) {
        return false;
      }
    }

    return true;
  }

  placeShip(ship, coords) {
    const cells = [];

    if (!this.validateCoords(ship, coords))
      throw new Error("Cannot place the ship here");

    for (let i = coords; i < coords + ship.length; i++) {
      this.markAsShip(i);
      cells.push(i);
    }

    this.ships.push({ ship, cells });
  }

  placeShipsRandomly() {
    for (const ship of this.ships) {
      let coords = this.generateRandomCoords();
      while (!this.validateCoords(ship, coords)) {
        coords = this.generateRandomCoords();
      }
      this.placeShip(ship, coords);
    }
    this.allPlaced = true;
  }

  generateRandomCoords() {
    return Math.floor(Math.random() * this.size);
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
