import Gameboard from "../Components/gameboard";
import Ship from "../Components/ship";

test("is gameboard initializing", () => {
  const board = new Gameboard();

  board.init();

  expect(board.board.length).toBe(100);
  expect(board.size).toBe(100);
  expect(
    board.board.every((cell) => !cell.hasShip && !cell.isHit)
  ).toBeTruthy();
});

test("Creating 10 ships of proper sizes", () => {
  const board = new Gameboard();

  board.init();

  board.createShips();

  expect(board.ships.length).toBe(10);
  expect(board.ships.reduce((acc, ship) => acc + ship.length, 0)).toBe(20);
});

test("Placing ship correctly horrizontally", () => {
  const ship = new Ship(3);
  const board = new Gameboard();

  board.init(10);

  board.placeShip(ship, 3);

  expect(board.board[3].hasShip).toBeTruthy();
  expect(board.board[4].hasShip).toBeTruthy();
  expect(board.board[5].hasShip).toBeTruthy();
});

test("Placing ship correctly vertically", () => {
  const ship = new Ship(3);
  const board = new Gameboard();

  board.init(30);

  board.placeShip(ship, 3, "y");

  expect(board.board[3].hasShip).toBeTruthy();
  expect(board.board[13].hasShip).toBeTruthy();
  expect(board.board[23].hasShip).toBeTruthy();
});

test("adjacent coords becoming invalid after placing the ship vertically", () => {
  const ship = new Ship(2);
  const board = new Gameboard();

  board.init(30);

  board.placeShip(ship, 13, "y");

  expect(board.board[2].isValid).toBeFalsy();
  expect(board.board[3].isValid).toBeFalsy();
  expect(board.board[4].isValid).toBeFalsy();
  expect(board.board[32].isValid).toBeFalsy();
  expect(board.board[33].isValid).toBeFalsy();
  expect(board.board[34].isValid).toBeFalsy();
  expect(board.board[12].isValid).toBeFalsy();
  expect(board.board[14].isValid).toBeFalsy();
  expect(board.board[22].isValid).toBeFalsy();
  expect(board.board[24].isValid).toBeFalsy();
  expect(ship.adjCoords.length).toBe(10);
});

test("adjacent coords becoming invalid after placing the ship horrizontally", () => {
  const ship = new Ship(2);
  const board = new Gameboard();

  board.init(30);

  board.placeShip(ship, 13, "x");

  expect(board.board[2].isValid).toBeFalsy();
  expect(board.board[12].isValid).toBeFalsy();
  expect(board.board[22].isValid).toBeFalsy();
  expect(board.board[5].isValid).toBeFalsy();
  expect(board.board[15].isValid).toBeFalsy();
  expect(board.board[25].isValid).toBeFalsy();
  expect(board.board[3].isValid).toBeFalsy();
  expect(board.board[4].isValid).toBeFalsy();
  expect(board.board[23].isValid).toBeFalsy();
  expect(board.board[24].isValid).toBeFalsy();

  expect(ship.adjCoords.length).toBe(10);
});

test("Placing ships at random coords", () => {
  const board = new Gameboard();

  board.init();

  for (let i = 1; i < 5; i++) {
    board.ships.push(new Ship(i));
  }

  board.placeShipsRandomly();

  expect(board.allPlaced).toBeTruthy();
});

test("Gameboard throwing error for invalid coords v1", () => {
  const ship = new Ship(3);
  const board = new Gameboard();

  board.init();

  expect(() => board.placeShip(ship, 88)).toThrow("Cannot place the ship here");
});

test("Gameboard throwing error for invalid coords v2", () => {
  const board = new Gameboard();

  const ship = new Ship(3);
  const newShip = new Ship(2);

  board.init();
  board.placeShip(ship, 2);

  expect(() => board.placeShip(newShip, 1)).toThrow(
    "Cannot place the ship here"
  );
});

test("Gameboard throwing error for invalid coords v3", () => {
  const ship = new Ship(3);
  const board = new Gameboard();

  board.init();

  expect(() => board.placeShip(ship, 88, "y")).toThrow(
    "Cannot place the ship here"
  );
});

test("Gameboard throwing error for invalid coords v4", () => {
  const board = new Gameboard();

  const ship = new Ship(3);
  const newShip = new Ship(2);

  board.init();
  board.placeShip(ship, 12, "y");

  expect(() => board.placeShip(newShip, 2, "y")).toThrow(
    "Cannot place the ship here"
  );
});

test("Ship receiving attack", () => {
  const ship = new Ship(3);
  const board = new Gameboard();

  board.init(10);

  board.placeShip(ship, 3);
  board.receiveAttack(4);

  // Position will be marked hit
  expect(board.board[4].isHit).toBeTruthy();
  // if it has ship that part of the ship should be marked hit
  expect(ship.positions).toEqual([0, 1, 0]);
});

test("Determine whether all ships have been sunk", () => {
  const shipOne = new Ship(1);
  const shipTwo = new Ship(2);
  const board = new Gameboard();

  board.init(10);

  board.placeShip(shipOne, 3);
  board.placeShip(shipTwo, 8);

  expect(board.allSunk).toBeFalsy();

  board.receiveAttack(3);
  board.receiveAttack(8);
  board.receiveAttack(9);

  expect(board.allSunk).toBeTruthy();
});

// test("Attacking on already hit coord", () => {
//   const board = new Gameboard();

//   board.init(10);
//   board.receiveAttack(4);
//   expect(() => board.receiveAttack(4)).toThrow("Already hit");
// });
