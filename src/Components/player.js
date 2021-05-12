class Player {
  constructor(type, board) {
    this.type = type;
    this.board = board;
  }

  generateBotMove() {
    return Math.floor(Math.random() * 100);
  }

  attack(board, coords) {
    if (!board.board[coords].isHit) {
      board.receiveAttack(coords);
    }
  }
}

export default Player;
