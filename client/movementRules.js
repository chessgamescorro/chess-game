// Move a piece if the destination square is allowed.
function movePieceToSquare(piece, square) {
  // Save the square the piece is currently on.
  const oldSquare = piece.parentElement;

  // Stop if the destination is missing, outside the board, or the same square.
  if (!square || !gameBoard.contains(square) || square === oldSquare) return false;

  // Only let the king move one square in any direction.
  if (piece.dataset.piece === 'king' && !isKingMoveAllowed(oldSquare, square)) {
    return false;
  }

  // Only let the bishop move diagonally without jumping over pieces.
  if (piece.dataset.piece === 'bishop' && !isBishopMoveAllowed(oldSquare, square)) {
    return false;
  }

  // Only let the knight move in an L shape.
  if (piece.dataset.piece === 'knight' && !isKnightMoveAllowed(oldSquare, square)) {
    return false;
  }

  // Only let the rook move straight without jumping over pieces.
  if (piece.dataset.piece === 'rook' && !isRookMoveAllowed(oldSquare, square)) {
    return false;
  }

  // A pawn can move forward or capture diagonally, so allow either rule.
  if (
    piece.dataset.piece === 'pawn' &&
    !isPawnMoveAllowed(oldSquare, square) &&
    !isPawnDiagonalCaptureAllowed(oldSquare, square)
  ) {
    return false;
  }

  // Only let the queen move diagonally or straight without jumping over pieces.
  if (
    piece.dataset.piece === 'queen' &&
    !isQueenMoveAllowed(oldSquare, square)
  ) {
    return false;
  }


  // Check whether the destination contains another piece.
  const target = square.querySelector('.piece');

  // Do not capture a piece that has the same color.
  if (target) {
    const movingPieceIsWhite = piece.querySelector('svg').classList.contains('white');
    const targetIsWhite = target.querySelector('svg').classList.contains('white');
    if (movingPieceIsWhite === targetIsWhite) return false;
  }

  // Record the move after it passes the movement and capture checks.
  recordMove(piece, oldSquare, square);

  // Move captured pieces to the tray and end the game if a king was captured.
  if (target) {
    const tray = document.querySelector(`#captured-${currentPlayer.toLowerCase()}`);
    const capturedKing = target.dataset.piece === 'king';
    tray.append(target);

    if (capturedKing) {
      playMoveSound();
      updateScore(currentPlayer);
      showWinner(currentPlayer);

      selected = null;
      currentPlayer = 'White';
      playerDisplay.textContent = currentPlayer;

      document.querySelectorAll('.captured').forEach(capturedTray => {
        capturedTray.innerHTML = '';
      });

      createBoard();
      gameBoard.classList.remove('rotated');
      boardFrame.classList.remove('rotated');
      return true;
    }
  }

  // Put the moving piece on the destination square and clear move markers.
  square.append(piece);
  gameBoard.querySelectorAll('.highlight').forEach(highlightedSquare => {
    highlightedSquare.classList.remove('highlight');
  });
  playMoveSound();

  // Switch whose turn it is and update the turn display.
  currentPlayer = currentPlayer === 'White' ? 'Black' : 'White';
  playerDisplay.textContent = currentPlayer;
  return true;
}
