import Gameboard from "./Components/gameboard";
import Player from "./Components/player";

// TODO - UI

// Doing -

// Done - Ship tests, Gameboard tests, Player tests, AI tests, Game codes

// Not Sure/ Review

// Game - UI, Create players & boards - predetermined corrds, gameOver(), userInput

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

    this.init();

    document
      .querySelector(".start")
      .addEventListener("click", this.start.bind(this));

    document
      .querySelector(".reset")
      .addEventListener("click", this.init.bind(this));

    document
      .querySelector(".replay")
      .addEventListener("click", this.playAgain.bind(this));

    document
      .querySelector(".close__modal")
      .addEventListener("click", this.closeModal);

    document
      .querySelector(".random")
      .addEventListener(
        "click",
        this.deployFleet.bind(this, this._playerBoard, "left")
      );
  }

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
          this.playerAttack.bind(this, this._botBoard, this._player)
        )
      );

    this._playerBoardContainer.classList.remove("inactive");
    this._botBoardContainer.classList.add("inactive");
    document.querySelector(".random").classList.remove("hide");

    document.querySelector(".reset").classList.add("hide");
    document.querySelector(".start").classList.remove("hide");
  }

  deployFleet(board, classname) {
    board.init();
    this.displayBoard(board, classname);
    this.displayShips(board, classname);
  }

  start() {
    this._gameOver = false;

    document.querySelector(".start").classList.add("hide");
    document.querySelector(".reset").classList.remove("hide");

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
    this.renderShips(board, className);
  }

  renderShips(board, className) {
    const grid = document.querySelector(`.${className}`);
    const cells = grid.querySelectorAll(".cell");

    cells.forEach((cell) => cell.classList.remove("ship"));

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
    if (this._gameOver) return;

    document.querySelectorAll(".gameboard").forEach((board) => {
      board.classList.remove("inactive");
      board.classList.remove("turn");
    });

    const turnText = document.querySelector("#current");

    if (current === 1) {
      this.turn = 2;
      this._botBoardContainer.classList.add("inactive");
      this._playerBoardContainer.classList.add("turn");
      turnText.textContent = "CPU's Turn";

      setTimeout(() => {
        this.botAttack(this._playerBoard, this._bot);
      }, 1000);
    } else {
      this.turn = 1;
      this._playerBoardContainer.classList.add("inactive");
      this._botBoardContainer.classList.add("turn");
      turnText.textContent = "Player's Turn";
    }
  }

  // method to take user input
  playerAttack(board, player, e) {
    if (this.turn !== 1 || this._gameOver !== false) return;

    const cell = e.target;
    const coords = +cell.dataset.index;

    // if cell is already hit
    if (board.board[coords].isHit) return;

    player.attack(board, coords);

    this.markCell(board, cell, this.turn, this._botBoardContainer, player);

    setTimeout(() => this.gameOver(board, player), 1000);
  }

  botAttack(board, player) {
    let coords;

    // keep calling smart hit until previously hit ship is sunk
    if (player.adjCoords.length !== 0) {
      coords = player.smartHit(board);
    } else {
      coords = player.generateBotMove();

      if (board.board[coords].isHit) return this.botAttack(board, player);

      player.attack(board, coords);
    }

    const cell = this._playerBoardContainer.querySelector(
      `[data-index="${coords}"]`
    );

    this.markCell(board, cell, this.turn, this._playerBoardContainer, player);

    setTimeout(() => this.gameOver(board, player), 1000);
  }

  markCell(board, cell, turn, domBoard, player) {
    if (this._gameOver) return;

    if (cell.classList.contains("ship")) {
      cell.classList.add("hit");

      const coords = +cell.dataset.index;

      const prevShipSunk = this.sinkShip(board, coords, domBoard, player);

      if (turn == 2 && !this._gameOver) {
        setTimeout(() => {
          // create adjacent coords for smart hit if the ship hasnt sunk yet
          if (!prevShipSunk) player.createAdjCoords(board, coords);
          this.botAttack(board, player);
        }, 700);
      }
    } else {
      cell.classList.add("miss");

      cell.textContent = "⚫";

      this.switchTurn(turn);
    }
  }

  sinkShip(board, coords, domBoard, player) {
    const ship = board.getShip(coords);

    if (ship.sunk) {
      // empty the array after sinking the ship
      player.adjCoords.length = 0;

      ship.adjCoords.forEach((coord) => {
        const cell = domBoard.querySelector(`[data-index="${coord}"]`);
        cell.textContent = "⚫";

        if (!cell.classList.contains("miss")) cell.classList.add("border");
        board.board[coord].isHit = true;
      });

      return true;
    }
  }

  // method to end game
  gameOver(board, player) {
    if (!board.allSunk) return;

    this._gameOver = true;

    // make both boards inactive
    document
      .querySelectorAll(".gameboard")
      .forEach((board) => board.classList.add("inactive"));

    // alert gameover
    document.querySelector(".game__over").classList.remove("hide");
    document.querySelector(".overlay").classList.remove("hide");

    document.querySelector("#result").textContent = `${player.type} Wins!`;
  }

  // reset() {
  //   this._gameOver = true;
  //   this.turn = 1;

  //   this._playerBoard.init();
  //   this._botBoard.init();

  //   this.displayBoard(this._playerBoard, "left");
  //   this.displayBoard(this._botBoard, "right");

  //   this.displayShips(this._playerBoard, "left");
  //   this.displayShips(this._botBoard, "right");
  //   this.hideBotShips(this._botBoard, "right");

  //   document.querySelector(".right").classList.remove("inactive");
  //   this._playerBoardContainer.classList.add("inactive");
  //   document.querySelector(".right").classList.add("turn");

  //   this._botBoardContainer
  //     .querySelectorAll(".cell")
  //     .forEach((cell) =>
  //       cell.addEventListener(
  //         "click",
  //         this.playerAttack.bind(this, this._botBoard, this._player)
  //       )
  //     );

  //   setTimeout(() => (this._gameOver = false), 1000);
  // }

  playAgain() {
    this.closeModal();
    this.init();
  }

  closeModal() {
    document.querySelector(".game__over").classList.add("hide");
    document.querySelector(".overlay").classList.add("hide");
  }
}

const game = new Game();
