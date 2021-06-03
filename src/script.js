import Gameboard from "./Components/Factories/gameboard";
import Player from "./Components/Factories/player";
import * as helper from "./Components/Game/helper";
import gamePlay from "./Components/Game/gamePlay";
import dragDrop from "./Components/Game/dragNdrop";

class Game {
  _player;
  _playerBoard;
  _bot;
  _botBoard;
  _gameOver;
  _botBoardContainer;

  constructor() {
    this._botBoardContainer = document.querySelector(".right");
    this._playerBoardContainer = document.querySelector(".left");

    dragDrop.axis = "x";

    this.init();

    this.addHandlers();
  }

  addHandlers() {
    // Start game
    document
      .querySelector(".start")
      .addEventListener("click", this.start.bind(this));

    // Restart game
    document
      .querySelector(".reset")
      .addEventListener("click", this.init.bind(this));

    // Play again
    document
      .querySelector(".replay")
      .addEventListener("click", helper.playAgain);

    // Close modal
    document
      .querySelectorAll(".close__modal")
      .forEach((cross) => cross.addEventListener("click", helper.closeModal));

    // randomise
    document
      .querySelector(".random")
      .addEventListener(
        "click",
        this.deployFleet.bind(this, this._playerBoard, "left")
      );

    // open how to play modal
    document
      .querySelector(".how")
      .addEventListener("click", helper.showModal.bind(this, "how__to"));

    // close how to play modal
    document
      .querySelector(".got__it")
      .addEventListener("click", helper.closeModal);

    // clear player board
    document
      .querySelector(".clear")
      .addEventListener("click", dragDrop.displayFleet.bind(dragDrop));

    // rearrange ships
    document
      .querySelector(".rearrange")
      .addEventListener("click", dragDrop.rearrange.bind(dragDrop));

    // change axis
    document
      .querySelector(".axis")
      .addEventListener("click", dragDrop.toggleAxis.bind(dragDrop));
  }

  // Initialization methods

  init() {
    this.turn = 1;
    this._gameOver = true;
    // create 10 x 10 board
    this._playerBoard = new Gameboard();
    this._botBoard = new Gameboard();

    // create 2 players - human & bot
    this._player = new Player("Player", this._playerBoard);
    this._bot = new Player("CPU", this._botBoard);

    // create ships for each board & place them
    this.deployFleet(this._playerBoard, "left");
    this.deployFleet(this._botBoard, "right");
    this.hideBotShips(this._botBoard, "right");

    this._botBoardContainer
      .querySelectorAll(".cell")
      .forEach((cell) =>
        cell.addEventListener(
          "click",
          gamePlay.playerAttack.bind(gamePlay, this._botBoard, this._player)
        )
      );

    this._playerBoardContainer.classList.remove("inactive");
    this._botBoardContainer.classList.remove("turn");
    this._botBoardContainer.classList.add("inactive");
    document.querySelector(".random").classList.remove("hide");

    document.querySelector(".reset").classList.add("hide");
    document.querySelector(".start").classList.remove("hide");
    document.querySelector(".rearrange").classList.remove("hide");
  }

  deployFleet(board, classname) {
    board.init();
    this.displayBoard(board, classname);
    this.displayShips(board, classname);
    // in case we are on the rearrange page
    if (document.querySelector(".bot__grid").classList.contains("hide"))
      helper.toggleClasses();
  }

  start() {
    this._gameOver = false;

    document.querySelector(".start").classList.add("hide");
    document.querySelector(".reset").classList.remove("hide");
    document.querySelector(".rearrange").classList.add("hide");

    this._playerBoardContainer.classList.add("inactive");
    this._botBoardContainer.classList.remove("inactive");
    this._botBoardContainer.classList.add("turn");

    document.querySelector("#current").textContent = "Player's Turn";

    document.querySelector(".random").classList.add("hide");
  }

  // method to create board on ui
  displayBoard(board, name) {
    const boardContainer = document.querySelector(`.${name}`);
    boardContainer.innerHTML = "";

    for (let i = 0; i < board.size; i++) {
      // create a div element
      const cell = document.createElement("div");

      // set class for it
      cell.setAttribute("class", "cell");
      cell.setAttribute("id", `${name}Cell`);
      cell.setAttribute("data-index", i);

      // append it to the parent
      boardContainer.append(cell);
    }
  }

  // place ships method that creates 10 ships & places them
  displayShips(board, className) {
    // create ships
    board.createShips();
    // place them
    board.placeShipsRandomly();
    // add ship class to all ships
    this.renderAllShips(board, className);
  }

  renderAllShips(board, className) {
    const grid = document.querySelector(`.${className}`);
    const cells = grid.querySelectorAll(".cell");

    cells.forEach((cell) => cell.classList.remove("ship"));

    for (let i = 0; i < board.size; i++) {
      this.renderShip(i, cells, board);
    }
  }

  renderShip(coord, cells, board) {
    if (board.board[coord].hasShip) cells[coord].classList.add("ship");
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
}

const game = new Game();
export default game;
