import Ship from "./Components/ship";
import Gameboard from "./Components/gameboard";
import Player from "./Components/player";

// TODO - Game tests

// Doing -

// Done - Ship tests, Gameboard tests, Player tests

// Not Sure/ Review

// Game - UI, Create players & boards - predetermined corrds, gameOver(), userInput

class Game {
  constructor() {
    this.init();
  }

  init() {
    // create 10 x 10 board
    const playerBoard = new Gameboard();
    playerBoard.init();
    const botBoard = new Gameboard();
    botBoard.init();

    // create 2 players - human & bot
    const player = new Player("Human", playerBoard);
    const bot = new Player("Bot", botBoard);

    this.displayBoard(playerBoard, "left");
    this.displayBoard(botBoard, "right");

    // create ships for each board & place them
    this.displayShips(playerBoard, "left");
    this.displayShips(botBoard, "right");

    // allow players to take turns
  }

  // method to create board on ui
  displayBoard(board, name) {
    for (let i = 0; i < board.size; i++) {
      // create a div element
      const cell = document.createElement("div");

      // set class for it
      cell.setAttribute("class", "cell");

      // append it to the parent
      document.querySelector(`.${name}`).append(cell);
    }
  }

  // place ships method that creates 10 ships & places them
  displayShips(board, className) {
    // create ships
    board.createShips();
    // place them
    board.placeShipsRandomly();
    // add ship class to all ships
    this.renderShips(board, className);
  }

  renderShips(board, className) {
    const grid = document.querySelector(`.${className}`);
    const cells = grid.querySelectorAll(".cell");

    for (let i = 0; i < board.size; i++) {
      if (board.board[i].hasShip) cells[i].classList.add("ship");
    }
  }
  // method to take user input

  // method to end game
}

const game = new Game();
