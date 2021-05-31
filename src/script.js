import Gameboard from "./Components/gameboard";
import Player from "./Components/player";

class Game {
  _player;
  _playerBoard;
  _bot;
  _botBoard;
  _gameOver;
  _botBoardContainer;
  _draggables;
  _axis;

  constructor() {
    this._botBoardContainer = document.querySelector(".right");
    this._playerBoardContainer = document.querySelector(".left");

    this._axis = "x";

    this.init();

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
      .addEventListener("click", this.playAgain.bind(this));

    // Close modal
    document
      .querySelectorAll(".close__modal")
      .forEach((cross) => cross.addEventListener("click", this.closeModal));

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
      .addEventListener("click", this.showModal.bind(this, "how__to"));

    // close how to play modal
    document
      .querySelector(".got__it")
      .addEventListener("click", this.closeModal);

    // clear player board
    document
      .querySelector(".clear")
      .addEventListener("click", this.displayFleet.bind(this));

    // rearrange ships
    document
      .querySelector(".rearrange")
      .addEventListener("click", this.rearrange.bind(this));

    // change axis
    document
      .querySelector(".axis")
      .addEventListener("click", this.toggleAxis.bind(this));
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
      this.toggleClasses();
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

  toggleClasses() {
    // Fleet
    document.querySelector(".fleet").classList.toggle("hide");
    // bot board
    document.querySelector(".bot__grid").classList.toggle("hide");
    // start button
    document.querySelector(".start").classList.toggle("hide");
    // how to play button
    document.querySelector(".how").classList.toggle("hide");
    // rearrange button
    document.querySelector(".rearrange").classList.toggle("hide");
    // clear button
    document.querySelector(".clear").classList.toggle("hide");
    // axis button
    document.querySelector(".axis").classList.toggle("hide");
    // note
    document.querySelector("#note").classList.toggle("hide");
  }

  rearrange(e) {
    this.toggleClasses();
    // display the ships to place
    this.displayFleet();
    // change text
    document.querySelector("#current").textContent = "Drag & Drop";
    // show axis button
    document.querySelector(".axis").classList.remove("hide");
  }

  displayFleet() {
    const fleet = document.querySelector(".fleet");
    this._axis = "x";

    this._playerBoard.init();
    this._playerBoard.createShips();
    fleet.innerHTML = "";

    fleet.classList.remove("vertical");
    fleet.classList.add("horrizontal");

    document.querySelector(".axis").textContent = "Axis : X";

    this.displayBoard(this._playerBoard, "left");

    this._playerBoard.ships.forEach((ship, i) => {
      const shipDiv = document.createElement("div");

      shipDiv.setAttribute("class", "fleet__ship x__axis");
      shipDiv.setAttribute("id", `ship__${ship.length}`);
      shipDiv.setAttribute("draggable", true);
      shipDiv.setAttribute("data-index", i);

      this.appendShip(ship, shipDiv);

      fleet.appendChild(shipDiv);
    });

    this._draggables = document.querySelectorAll(".fleet__ship");

    this.dragStart();
    this.dragEnd();

    document.querySelectorAll("#leftCell").forEach((cell) => {
      cell.addEventListener("dragover", (e) => e.preventDefault());

      cell.addEventListener("dragenter", (e) => {
        const dragging = document.querySelector(".dragging");
        const ship = this._playerBoard.ships[dragging.dataset.index];

        if (this._playerBoard.validateCoords(ship, +e.target.dataset.index))
          e.target.classList.add("valid");
        else e.target.classList.add("invalid");
      });

      cell.addEventListener("dragleave", (e) => {
        e.target.classList.remove("valid");
        e.target.classList.remove("invalid");
      });

      cell.addEventListener("drop", this.dropShip.bind(this));
    });
  }

  appendShip(ship, parent) {
    for (let i = 0; i < ship.length; i++) {
      const cell = document.createElement("div");

      cell.setAttribute("class", "fleet__cell");

      parent.appendChild(cell);
    }
  }

  dragStart() {
    this._draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", (e) => {
        draggable.classList.add("dragging");
      });
    });
  }

  dragEnd() {
    this._draggables.forEach((draggable) => {
      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
      });
    });
  }

  dropShip(e) {
    e.preventDefault();
    // get the index of the cell
    const coords = +e.target.dataset.index;
    // get the dragged ship from dom
    const draggable = document.querySelector(".dragging");
    // get the ship from the board
    const ship = this._playerBoard.ships[draggable.dataset.index];
    // get all the cells
    const cells = document.querySelectorAll("#leftCell");

    // check if its a valid coord & place the ship on board
    if (!this._playerBoard.validateCoords(ship, coords) || !draggable.draggable)
      return;

    this._playerBoard.placeShip(ship, coords, this._axis);

    if (this._axis === "x") {
      for (let i = 0; i < ship.length; i++) {
        this.renderShip(coords + i, cells, this._playerBoard);
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        this.renderShip(coords + i * 10, cells, this._playerBoard);
      }
    }

    // Remove the dragged ship from the fleet
    draggable.childNodes.forEach((node) => node.classList.add("placed"));
    draggable.classList.add("placed");
    // check if all ships are placed
    this._playerBoard.areAllPlaced();
    if (this._playerBoard.allPlaced) this.toggleClasses();
    // remove the ships draggable property
    draggable.setAttribute("draggable", false);
  }

  toggleAxis(e) {
    if (this._axis === "x") {
      // change axis
      this._axis = "y";
      // change text
      e.target.textContent = "Axis : Y";
      // chnage classes for fleet
      document.querySelector(".fleet").classList.remove("horrizontal");
      document.querySelector(".fleet").classList.add("vertical");
      // change classes for ships
      document.querySelectorAll(".fleet__ship").forEach((ship) => {
        ship.classList.remove("x__axis");
        ship.classList.add("y__axis");
      });
    } else {
      this._axis = "x";
      e.target.textContent = "Axis : X";

      document.querySelector(".fleet").classList.remove("vertical");
      document.querySelector(".fleet").classList.add("horrizontal");

      document.querySelectorAll(".fleet__ship").forEach((ship) => {
        ship.classList.remove("y__axis");
        ship.classList.add("x__axis");
      });
    }
  }
}

const game = new Game();
