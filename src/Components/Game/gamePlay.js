import game from "../../script";
import * as helper from "./helper";

class GamePlay {
  switchTurn(current) {
    if (game._gameOver) return;

    document.querySelectorAll(".gameboard").forEach((board) => {
      board.classList.remove("inactive");
      board.classList.remove("turn");
    });

    const turnText = document.querySelector("#current");

    if (current === 1) {
      game.turn = 2;
      game._botBoardContainer.classList.add("inactive");
      game._playerBoardContainer.classList.add("turn");
      turnText.textContent = "CPU's Turn";

      setTimeout(() => {
        this.botAttack(game._playerBoard, game._bot);
      }, 1000);
    } else {
      game.turn = 1;
      game._playerBoardContainer.classList.add("inactive");
      game._botBoardContainer.classList.add("turn");

      turnText.textContent = "Player's Turn";
    }
  }

  // method to take user input
  playerAttack(board, player, e) {
    if (game.turn !== 1 || game._gameOver !== false) return;

    const cell = e.target;
    const coords = +cell.dataset.index;

    // if cell is already hit
    if (board.board[coords].isHit) return;

    player.attack(board, coords);

    this.markCell(board, cell, game.turn, game._botBoardContainer, player);

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

    const cell = game._playerBoardContainer.querySelector(
      `[data-index="${coords}"]`
    );

    this.markCell(board, cell, game.turn, game._playerBoardContainer, player);

    setTimeout(() => this.gameOver(board, player), 1000);
  }

  markCell(board, cell, turn, domBoard, player) {
    if (game._gameOver) return;

    if (cell.classList.contains("ship")) {
      cell.classList.add("hit");

      const coords = +cell.dataset.index;

      const prevShipSunk = this.sinkShip(board, coords, domBoard, player);

      if (turn == 2 && !game._gameOver) {
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
    helper.showModal("game__over");

    document.querySelector("#result").textContent = `${player.type} Wins!`;
  }
}

const gamePlay = new GamePlay();
export default gamePlay;
