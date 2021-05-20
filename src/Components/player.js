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
    let randomIndex;

    while (true) {
      randomIndex = Math.floor(Math.random() * this.adjCoords.length);
      if (
        board.board[this.adjCoords[randomIndex]] &&
        !board.board[this.adjCoords[randomIndex]].isHit
      )
        break;
    }

    const randomCoord = this.adjCoords.splice(randomIndex, 1);

    this.attack(board, ...randomCoord);

    return randomCoord[0];
  }

  createAdjCoords(coords) {
    // empty adjCoords first
    this.adjCoords.length = 0;

    const adj = [
      coords + 1,
      coords + 2,
      coords - 1,
      coords - 2,
      coords - 10,
      coords - 20,
      coords + 10,
      coords + 20,
    ];

    this.adjCoords.push(...adj);
  }
}

export default Player;
