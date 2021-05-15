import Ship from "../Components/ship";

class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
    this.size = 100;
    this.allSunk = false;
    this.allPlaced = false;
  }

  // board initialization
  init() {
    for (let i = 0; i < this.size; i++) {
      this.board.push({ hasShip: false, isHit: false, isValid: true });
    }
  }

  // helpers
  markAsShip(pos) {
    console.log(this.board, pos);
    this.board[pos].hasShip = true;
  }

  markAsHit(coords) {
    const ship = this.ships.find((ship) => ship.cells.includes(coords));
    const index = ship.cells.indexOf(coords);
    ship.ship.hit(index);
    ship.ship.isSunk();
  }

  markAsInvalid(ship, coords, axis) {
    if (axis === "x") {
      if (this.board[coords - 1]) this.board[coords - 1] = false;

      if (this.board[coords + ship.length])
        this.board[coords + ship.length].isValid = false;

      for (let i = coords; i < coords + ship.length; i++) {
        if (this.board[i + 10]) this.board[i + 10].isValid = false;

        if (this.board[i - 10]) this.board[i - 10].isValid = false;
      }
    } else {
      // cell below ship
      if (this.board[coords + ship.length * 10])
        this.board[coords + ship.length * 10].isValid = false;

      // cell above ship
      if (this.board[coords - 10]) this.board[coords - 10].isValid = false;

      for (let i = coords; i < coords + ship.length * 10; i += 10) {
        // cells on right of ship
        if (this.board[i + 1]) this.board[i + 1].isValid = false;
        // cells on left of ship
        if (this.board[i - 1]) this.board[i - 1].isValid = false;
      }
    }
  }

  // error handling
  validateCoords(ship, coords, axis) {
    if (coords > this.board.length || ship.length > this.board.length) {
      return false;
    }

    if (axis == "x") {
      if (coords + ship.length > this.board.length) {
        return false;
      }

      for (let i = 0; i < ship.length; i++) {
        if (this.board[coords + i].hasShip) {
          return false;
        }
      }
    } else {
      if (coords + ship.length * 10 > this.board.length) {
        return false;
      }

      for (let i = 0; i < ship.length; i++) {
        if (this.board[coords + i * 10].hasShip) {
          return false;
        }
      }
    }

    return true;
  }

  // ship methods
  createShips() {
    const sizes = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

    for (const size of sizes) {
      const ship = new Ship(size);
      this.ships.push(ship);
    }
  }

  placeShip(ship, coords, axis = "x") {
    const cells = [];

    if (!this.validateCoords(ship, coords, axis))
      throw new Error("Cannot place the ship here");

    for (let i = 0; i < ship.length; i++) {
      if (axis == "x") {
        cells.push(coords + i);
        this.markAsShip(coords + i);
        this.markAsInvalid(ship, coords, axis);
      } else {
        cells.push(coords + i * 10);
        this.markAsShip(coords + i * 10);
        this.markAsInvalid(ship, coords, axis);
      }
    }
    if (this.ships.length < 10) this.ships.push({ ship, cells });
  }

  autoPlace(ship) {
    let [coords, axis] = this.generateRandomCoords();

    while (!this.validateCoords(ship, coords, axis)) {
      [coords, axis] = this.generateRandomCoords();
    }

    this.placeShip(ship, coords, axis);
  }

  placeShipsRandomly() {
    this.ships.forEach((ship) => this.autoPlace(ship));

    this.allPlaced = true;
  }

  generateRandomCoords() {
    const coords = Math.floor(Math.random() * this.size);
    const axis = Math.floor(Math.random() * 2) ? "x" : "y";
    return [coords, axis];
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
