class Player {
  constructor(type, board) {
    this.type = type;
    this.board = board;
    this.adjCoords = [];
  }

  generateBotMove() {
    return Math.floor(Math.random() * 100);
  }

  attack(board, coords) {
    if (!board.board[coords].isHit) {
      board.receiveAttack(coords);
    }
  }

  smartHit(board) {
    const randomCoord = this.adjCoords.pop();

    this.attack(board, randomCoord);

    return randomCoord;
  }

  createAdjCoords(board, coords) {
    // empty adjCoords first
    this.adjCoords.length = 0;

    // add possbile ship locations to the adjCoords array
    const adj = [
      coords + 20,
      coords - 20,
      coords + 2,
      coords - 2,
      coords - 10,
      coords + 10,
      coords - 1,
      coords + 1,
    ];

    // only push valid cells to the array
    adj.forEach((cell) => {
      if (this.validateCell(board, coords, cell)) this.adjCoords.push(cell);
    });
  }

  validateCell(board, coords, cell) {
    // cells that dont exist on board or cells that are already hit
    if (!board.board[cell] || board.board[cell].isHit) return false;

    // cells that are on other row & column
    if (coords % 10 === 0) {
      if (coords - cell < 10) return false;
    }

    if (coords % 10 === 9) {
      if (cell - coords < 10) return false;
    }

    return true;
  }
}

export default Player;
