import Ship from "../Components/ship";

class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
    this.size = 0;
    this.allSunk = false;
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
    let count = 0;
    for (let i = 0; i < 10; i++) {
      if (count < 4) {
        const ship = new Ship(1);
        this.ships.push(ship);
      } else if (count >= 4 && count < 7) {
        const ship = new Ship(2);
        this.ships.push(ship);
      } else if (count >= 7 && count < 9) {
        const ship = new Ship(3);
        this.ships.push(ship);
      } else {
        const ship = new Ship(4);
        this.ships.push(ship);
      }
      count++;
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
      this.markAsShip(i);
      cells.push(i);
    }

    this.ships.push({ ship, cells });
  }

  placeShipsRandomly() {
    // for loop over ships
    //
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
