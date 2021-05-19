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
    let randomCoord;

    while (true) {
      randomCoord = Math.floor(Math.random() * this.adjCoords.length);
      if (board.board[randomCoord] && !board.board[randomCoord].isHit) break;
    }

    this.attack(board, ...this.adjCoords.splice(randomCoord, 1));

    console.log(`Random coord: ${this.adjCoords[randomCoord]}`);
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

    console.log(coords);
  }
}

export default Player;
