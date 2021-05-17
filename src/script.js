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

    this.turn = 1;
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
    this.hideBotShips(botBoard, "right");

    // add event listeners
    const rightBoard = document.querySelector(".right");
    rightBoard
      .querySelectorAll(".cell")
      .forEach((cell) =>
        cell.addEventListener(
          "click",
          this.playerAttack.bind(this, botBoard, player)
        )
      );
  }

  // method to create board on ui
  displayBoard(board, name) {
    for (let i = 0; i < board.size; i++) {
      // create a div element
      const cell = document.createElement("div");

      // set class for it
      cell.setAttribute("class", "cell");
      cell.setAttribute("data-index", i);

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
      if (board.board[i].hasShip) {
        cells[i].classList.add("ship");
      }
    }
  }

  hideBotShips(board, className) {
    const grid = document.querySelector(`.${className}`);
    const cells = grid.querySelectorAll(".cell");

    for (let i = 0; i < board.size; i++) {
      if (board.board[i].hasShip) {
        cells[i].classList.add("hidden");
      }
    }
  }

  switchTurn(current) {
    document
      .querySelectorAll(".gameboard")
      .forEach((board) => board.classList.remove("inactive"));
    if (current === 1) {
      this.turn = 2;
      document.querySelector(".right").classList.add("inactive");
      // this.botAttack();
    } else {
      this.turn = 1;
      document.querySelector(".left").classList.add("inactive");
    }
  }

  // method to take user input
  playerAttack(board, player, e) {
    if (this.turn !== 1) return;

    const cell = e.target;
    const coords = +cell.dataset.index;

    player.attack(board, coords);

    this.markCell(cell, this.turn);
  }

  botAttack(board, player, className) {
    const coords = player.generateBotMove();
    player.attack(board, coords);

    const leftBoard = document.querySelector(`.${left}`);
    const cell = leftBoard.querySelector(`[data-index="${coords}"]`);

    player.attack(board, coords);

    this.markCell(cell, this.turn);
  }

  markCell(cell, turn) {
    if (cell.classList.contains("ship")) {
      cell.classList.add("hit");
    } else {
      cell.classList.add("miss");

      cell.textContent = "⚫";

      this.switchTurn(turn);
    }
  }

  // method to end game
}

const game = new Game();
