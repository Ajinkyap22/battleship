import Player from "../Components/player";
import Gameboard from "../Components/gameboard";
import Ship from "../Components/ship";

test("generates legal bot move", () => {
  const playerBoard = new Gameboard();

  const player = new Player("Bot", playerBoard);

  expect(player.generateBotMove()).toBeGreaterThanOrEqual(0);
  expect(player.generateBotMove()).toBeLessThanOrEqual(100);
});

test("successful attack on opponents ship", () => {
  const board = new Gameboard();
  const playerBoard = new Gameboard();

  board.init(10);

  const ship = new Ship(3);

  board.placeShip(ship, 3);

  const player = new Player("Human", playerBoard);

  player.attack(board, 4);

  expect(board.board[4].isHit).toBeTruthy();
  expect(ship.positions).toEqual([0, 1, 0]);
});
