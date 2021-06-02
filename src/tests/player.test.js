import Player from "../Components/Factories/player";
import Gameboard from "../Components/Factories/gameboard";
import Ship from "../Components/Factories/ship";

test("generates legal bot move", () => {
  const playerBoard = new Gameboard();

  const player = new Player("Bot", playerBoard);

  expect(player.generateBotMove()).toBeGreaterThanOrEqual(0);
  expect(player.generateBotMove()).toBeLessThanOrEqual(100);
});

test("successful attack on opponents ship", () => {
  const board = new Gameboard();
  const playerBoard = new Gameboard();

  board.init();

  const ship = new Ship(3);

  board.placeShip(ship, 3);

  const player = new Player("Human", playerBoard);

  player.attack(board, 4);

  expect(board.board[4].isHit).toBeTruthy();
  expect(ship.positions).toEqual([0, 1, 0]);
});

test("Returning false for invalid cells", () => {
  const board = new Gameboard();
  const playerBoard = new Gameboard();

  board.init();

  const player = new Player("Human", playerBoard);

  player.attack(board, 32);

  expect(player.validateCell(board, 91, 101)).toBeFalsy();
  expect(player.validateCell(board, 31, 32)).toBeFalsy();
  expect(player.validateCell(board, 20, 18)).toBeFalsy();
  expect(player.validateCell(board, 39, 40)).toBeFalsy();
});

test("Creating non-empty adjacent coords array", () => {});

test("Succesful bot attack using smart hit", () => {});
