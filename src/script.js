import Gameboard from "./Components/gameboard";
import Player from "./Components/player";
import Ship from "./Components/ship";

// Place draggable ships - Done
// Set cursor - move on them  - Done
// Select all the draggables - Done
// Add dragStart event handler - Done
// Add a dragging class on the dragged element - Done
// Add a dragend event handler - Done
// remove the dragging class - Done
// Add a dragover event handler on the board - Done
// get the dragover cell & place the ship there & then render it
// Add preventDefault() to allow dropping
// while on the board, get the closes cells by using ClientX & ClientY to decide where to append the ship
// use insertBefore, getBoundingClientRect(), reduce etc. to get the cells

class Game {
  _player;
  _playerBoard;
  _bot;
  _botBoard;
  _gameOver;
  _botBoardContainer;
  _draggables;

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
      .querySelectorAll(".close__modal")
      .forEach((cross) => cross.addEventListener("click", this.closeModal));

    document
      .querySelector(".random")
      .addEventListener(
        "click",
        this.deployFleet.bind(this, this._playerBoard, "left")
      );

    document
      .querySelector(".how")
      .addEventListener("click", this.showModal.bind(this, "how__to"));

    document
      .querySelector(".got__it")
      .addEventListener("click", this.closeModal);

    document
      .querySelector(".rearrange")
      .addEventListener("click", this.rearrange.bind(this));

    this._playerBoardContainer.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("dragover", this.dropShip.bind(this));
    });
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
    this.showModal("game__over");

    document.querySelector("#result").textContent = `${player.type} Wins!`;
  }

  playAgain() {
    this.closeModal();
    this.init();
  }

  showModal(classname) {
    document.querySelector(`.${classname}`).classList.remove("hide");
    document.querySelector(".overlay").classList.remove("hide");
  }

  closeModal() {
    document
      .querySelectorAll(".modal")
      .forEach((modal) => modal.classList.add("hide"));
    document.querySelector(".overlay").classList.add("hide");
  }

  rearrange(e) {
    // Hide bot board
    document.querySelector(".bot__grid").classList.add("hide");
    // hide start & how to play buttom
    document.querySelector(".how").classList.add("hide");
    document.querySelector(".start").classList.add("hide");
    // Hide turn text
    document.querySelector("#current").classList.add("hide");
    // hide rearrange button but keep randomise
    e.target.classList.add("hide");
    // board should be empty
    this._playerBoard.init();
    this.displayBoard(this._playerBoard, "left");
    // Show fleet
    document.querySelector(".fleet").classList.remove("hide");
    // display the ships to place
    this.displayFleet();
  }

  displayFleet() {
    this._playerBoard.createShips();

    this._playerBoard.ships.forEach((ship, i) => {
      const shipDiv = document.createElement("div");

      shipDiv.setAttribute("class", "fleet__ship");
      shipDiv.setAttribute("id", `ship__${ship.length}`);
      shipDiv.setAttribute("draggable", true);
      shipDiv.setAttribute("data-index", i);

      this.appendShip(ship, shipDiv);

      document.querySelector(".fleet").appendChild(shipDiv);
    });

    this._draggables = document.querySelectorAll(".fleet__ship");

    this._draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
      });

      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
      });
    });
  }

  appendShip(ship, parent) {
    for (let i = 0; i < ship.length; i++) {
      const cell = document.createElement("div");

      cell.setAttribute("class", "fleet__cell");

      parent.appendChild(cell);
    }
  }

  dropShip(e) {
    e.preventDefault();
    console.log("nice");
    const coords = e.target.dataset.index;
    const draggable = document.querySelector(".dragging");
    const ship = this._playerBoard.ships[draggable.dataset.index];

    this._playerBoard.paceShip(ship, coords);
  }
}

const game = new Game();
