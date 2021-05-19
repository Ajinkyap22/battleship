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

  smartHit(boord) {
    let randomCoord;

    while (board.board[randomCoord] && !boord.board[randomCoord].isHit) {
      randomCoord = Math.floor(Math.random() * adjCoords.length);
    }

    // push them in an array & randomly hit one of them by pooping it
    board.receiveAttack(this.adjCoords.pop(randomCoord));

    // if it hits call the same function again
  }

  createAdjCoords(coords) {
    // empty adjCoords first

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

    this.adjCoords.concat(...adj);
  }
}

export default Player;
