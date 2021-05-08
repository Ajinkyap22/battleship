import Gameboard from "../Components/gameboard";
import Ship from "../Components/ship";

test("is gameboard initializing", () => {
  const board = new Gameboard();

  board.init(5);

  expect(board.board.length).toBe(5);
  expect(
    board.board.every((cell) => !cell.hasShip && !cell.isHit)
  ).toBeTruthy();
});

test("Placing ship correctly", () => {
  const ship = new Ship(3);
  const board = new Gameboard();

  board.init(10);

  board.placeShip(ship, 3);

  expect(board.board[3].hasShip).toBeTruthy();
  expect(board.board[4].hasShip).toBeTruthy();
  expect(board.board[5].hasShip).toBeTruthy();
});

test("Gameboard throwing error for invalid coords", () => {
  const ship = new Ship(3);
  const board = new Gameboard();

  board.init(5);

  expect(() => board.placeShip(ship, 3)).toThrow("Cannot place the ship here");
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

test("Attacking on already hit coord", () => {
  const ship = new Ship(3);
  const board = new Gameboard();

  board.init(10);
  board.receiveAttack(4);
  expect(() => board.receiveAttack(4)).toThrow("Already hit");
});
