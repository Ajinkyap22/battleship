import Ship from "../Components/ship";

class Gameboard {
  constructor(size = 100) {
    this.board = [];
    this.ships = [];
    this.size = size;
    this.allSunk = false;
    this.allPlaced = false;
  }

  // board initialization
  init() {
    this.board = [];
    for (let i = 0; i < this.size; i++) {
      this.board.push({ hasShip: false, isHit: false, isValid: true });
    }

    this.allPlaced = false;
  }

  // ship methods
  createShips() {
    this.ships = [];
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
      // horrizontally
      if (axis == "x") {
        cells.push(coords + i);
        this.markAsShip(coords + i);
        // vertically
      } else {
        cells.push(coords + i * 10);
        this.markAsShip(coords + i * 10);
      }
    }

    this.markAsInvalid(ship, coords, axis);
    ship.cells.push(...cells);

    // for testing
    if (this.ships.length < 10) this.ships.push(ship);
  }

  autoPlace(ship) {
    let [coords, axis] = this.generateRandomCoords();

    // keep generating random coords until they are valid
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
    // if (this.board[coords].isHit) {
    //   throw new Error("Already hit");
    // }

    // if cell is already hit
    if (this.board[coords].isHit) return;

    // Mark coord as hit
    this.board[coords].isHit = true;

    // Mark ship as hit
    if (this.board[coords].hasShip) {
      this.markAsHit(coords);
    }

    // Determine whether all ships have been sunk
    this.allShipsSunk();
  }

  allShipsSunk() {
    this.allSunk = this.ships.every((ship) => ship.sunk);
  }

  // error handling
  validateCoords(ship, coords, axis) {
    if (coords > this.board.length || ship.length > this.board.length) {
      return false;
    }

    if (axis == "x") {
      if (coords + (ship.length - 1) > this.board.length) {
        return false;
      }

      for (let i = 0; i < ship.length; i++) {
        if (!this.board[coords + i]) return false;

        // if a ship/border already exists at the coords
        if (this.board[coords + i].hasShip || !this.board[coords + i].isValid)
          return false;

        // if ship crosses over to the next row
        if (ship.length > 1 && i < ship.length - 1 && (coords + i) % 10 === 9)
          return false;
      }
    } else {
      if (coords + (ship.length - 1) * 10 > this.board.length) return false;

      for (let i = 0; i < ship.length; i++) {
        if (!this.board[coords + i * 10]) return false;

        if (
          this.board[coords + i * 10].hasShip ||
          !this.board[coords + i * 10].isValid
        )
          return false;
      }
    }

    return true;
  }

  // helpers
  markAsShip(pos) {
    this.board[pos].hasShip = true;
  }

  markAsHit(coords) {
    const ship = this.getShip(coords);
    const index = ship.cells.indexOf(coords);
    ship.hit(index);
    ship.isSunk();
  }

  getShip(coords) {
    return this.ships.find((ship) => ship.cells.includes(coords));
  }

  markAsInvalid(ship, coords, axis) {
    if (axis === "x") {
      if (this.board[coords - 1] && coords % 10 !== 0) {
        // left of ship
        this.board[coords - 1].isValid = false;
        ship.adjCoords.push(coords - 1);
      }

      // right of ship
      if (
        this.board[coords + ship.length] &&
        (coords + ship.length) % 10 !== 0
      ) {
        this.board[coords + ship.length].isValid = false;
        ship.adjCoords.push(coords + ship.length);
      }

      // top left of ship
      if (this.board[coords - 11] && coords % 10 !== 0) {
        this.board[coords - 11].isValid = false;
        ship.adjCoords.push(coords - 11);
      }

      // top right of ship
      if (
        this.board[coords + (ship.length - 1) - 9] &&
        (coords + (ship.length - 1) - 9) % 10 !== 0
      ) {
        this.board[coords + (ship.length - 1) - 9].isValid = false;
        ship.adjCoords.push(coords + (ship.length - 1) - 9);
      }

      // bottom left of ship
      if (this.board[coords + 9] && (coords + 9) % 10 !== 9) {
        this.board[coords + 9].isValid = false;
        ship.adjCoords.push(coords + 9);
      }

      // bottom right of ship
      if (
        this.board[coords + (ship.length - 1) + 11] &&
        (coords + (ship.length - 1) + 11) % 10 !== 0
      ) {
        this.board[coords + (ship.length - 1) + 11].isValid = false;
        ship.adjCoords.push(coords + (ship.length - 1) + 11);
      }

      for (let i = coords; i < coords + ship.length; i++) {
        // right coords
        if (this.board[i + 10]) {
          this.board[i + 10].isValid = false;
          ship.adjCoords.push(i + 10);
        }

        // left coords
        if (this.board[i - 10]) {
          this.board[i - 10].isValid = false;
          ship.adjCoords.push(i - 10);
        }
      }
    } else {
      // cell below ship
      if (this.board[coords + ship.length * 10]) {
        this.board[coords + ship.length * 10].isValid = false;
        ship.adjCoords.push(coords + ship.length * 10);
      }

      // cell above ship
      if (this.board[coords - 10]) {
        this.board[coords - 10].isValid = false;
        ship.adjCoords.push(coords - 10);
      }

      // top left
      if (this.board[coords - 11] && coords % 10 !== 0) {
        this.board[coords - 11].isValid = false;
        ship.adjCoords.push(coords - 11);
      }

      // top right
      if (this.board[coords - 9] && coords % 10 !== 9) {
        this.board[coords - 9].isValid = false;
        ship.adjCoords.push(coords - 9);
      }

      // bottom left
      if (this.board[coords + ship.length * 10 - 1] && coords % 10 !== 0) {
        this.board[coords + ship.length * 10 - 1].isValid = false;
        ship.adjCoords.push(coords + ship.length * 10 - 1);
      }

      // bottom right
      if (this.board[coords + ship.length * 10 + 1] && coords % 10 !== 9) {
        this.board[coords + ship.length * 10 + 1].isValid = false;
        ship.adjCoords.push(coords + ship.length * 10 + 1);
      }

      for (let i = coords; i < coords + ship.length * 10; i += 10) {
        // cells on right of ship
        if (this.board[i + 1] && (i + 1) % 10 !== 0) {
          this.board[i + 1].isValid = false;
          ship.adjCoords.push(i + 1);
        }
        // cells on left of ship
        if (this.board[i - 1] && (i - 1) % 10 !== 9) {
          this.board[i - 1].isValid = false;
          ship.adjCoords.push(i - 1);
        }
      }
    }
  }
}

export default Gameboard;
