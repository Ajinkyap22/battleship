import Ship from "./Components/ship";
import Gameboard from "./Components/gameboard";
import Player from "./Components/player";

// TODO - Game tests

// Doing - size 1 ship boarders not getting marked & maybe bot isnt playing every turn

// Done - Ship tests, Gameboard tests, Player tests

// Not Sure/ Review

// Game - UI, Create players & boards - predetermined corrds, gameOver(), userInput

class Game {
  _player;
  _playerBoard;
  _bot;
  _botBoard;

  constructor() {
    this.init();

    this.turn = 1;
  }

  init() {
    // create 10 x 10 board
    this._playerBoard = new Gameboard();
    this._playerBoard.init();
    this._botBoard = new Gameboard();
    this._botBoard.init();

    // create 2 players - human & bot
    this._player = new Player("Human", this._playerBoard);
    this._bot = new Player("Bot", this._botBoard);

    this.displayBoard(this._playerBoard, "left");
    this.displayBoard(this._botBoard, "right");

    // create ships for each board & place them
    this.displayShips(this._playerBoard, "left");
    this.displayShips(this._botBoard, "right");
    this.hideBotShips(this._botBoard, "right");

    // add event listeners
    const rightBoard = document.querySelector(".right");
    rightBoard
      .querySelectorAll(".cell")
      .forEach((cell) =>
        cell.addEventListener(
          "click",
          this.playerAttack.bind(this, this._botBoard, this._player)
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

      setTimeout(() => {
        this.botAttack(this._playerBoard, this._bot, "left");
      }, 700);
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

    const rightBoard = document.querySelector(".right");

    player.attack(board, coords);

    this.markCell(board, cell, this.turn, rightBoard);

    this.gameOver(board);
  }

  botAttack(board, player, className) {
    const coords = player.generateBotMove();

    player.attack(board, coords);

    const leftBoard = document.querySelector(`.${className}`);
    const cell = leftBoard.querySelector(`[data-index="${coords}"]`);

    player.attack(board, coords);

    this.markCell(board, cell, this.turn, leftBoard);

    this.gameOver(board);
  }

  markCell(board, cell, turn, domBoard) {
    if (cell.classList.contains("ship")) {
      cell.classList.add("hit");

      this.sinkShip(board, +cell.dataset.index, domBoard);

      if (turn == 2) {
        setTimeout(() => {
          this.botAttack(this._playerBoard, this._bot, "left");
        }, 700);
      }
    } else {
      cell.classList.add("miss");

      cell.textContent = "⚫";

      this.switchTurn(turn);
    }
  }

  sinkShip(board, coords, domBoard) {
    const ship = board.getShip(coords);

    if (ship.sunk) {
      ship.adjCoords.forEach((coord) => {
        const cell = domBoard.querySelector(`[data-index="${coord}"]`);
        cell.textContent = "⚫";
        cell.classList.add("border");
      });
    }
  }

  // method to end game
  gameOver(board) {
    if (!board.allSunk) return;

    // make both boards inactive
    document
      .querySelectorAll(".gameboard")
      .forEach((board) => board.classList.add("inactive"));

    // alert gameover
    alert("gameover");
  }
}

const game = new Game();
