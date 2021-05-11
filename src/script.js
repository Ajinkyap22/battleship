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
    playerBoard.init(100);
    const botBoard = new Gameboard();
    botBoard.init(100);

    // create 2 players - human & bot
    const player = new Player("Human", playerBoard);
    const bot = new Player("Bot", botBoard);

    this.displayBoard(playerBoard, "left");
    this.displayBoard(botBoard, "right");

    // create ships for each board & place them

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

  // method to take user input

  // method to end game
}

const game = new Game();
