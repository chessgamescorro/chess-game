
// Checks whether one piece can attack a particular square and asks for the pieces movement rules
function pieceAttackSquare(piece, targetSquare) {
  const fromSquare = piece.closest('.square')

  if (piece.dataset.piece === 'queen') {
    return isQueenMoveAllowed(fromSquare, targetSquare);
  }

  if (piece.dataset.piece === 'bishop') {
    return isBishopMoveAllowed(fromSquare, targetSquare);
  }

  if (piece.dataset.piece === 'rook') {
    return isRookMoveAllowed(fromSquare, targetSquare);
  }

  if (piece.dataset.piece === 'knight') {
    return isKnightMoveAllowed(fromSquare, targetSquare);
  }

  if (piece.dataset.piece === 'pawn') {
    return isPawnDiagonalCaptureAllowed(fromSquare, targetSquare);
  }

  if (piece.dataset.piece === 'king') {
    return isKingMoveAllowed(fromSquare, targetSquare);
}
  // Return false if this isn't a recognized piece type.
  return false;
}

// Checks whether any piece of attackingColor attacks the given square.
function isSquareAttacked(square, attackingColor) {
  // Get all pieces on the board and turn the list into an array.
  const piece = [...gameBoard.querySelectorAll('.piece')];

  // Check each piece. Return true if at least one matches both conditions.
  return piece.some(piece => {
    const isWhite = piece.querySelector('svg').classList.contains('white');
    const pieceColor = isWhite ? 'White' : "Black"

    // Only check pieces of the attacking color, then test their movement.
    return pieceColor === attackingColor && pieceAttackSquare(piece, square);
  })
}

// Checks whether the king of the given color is under attack.
function isKingInCheck(color) {
  const isWhite = color === 'White';

   // Find that color's king on the board.
  const king = [...gameBoard.querySelectorAll('.piece')].find(piece =>
    piece.dataset.piece === 'king' &&
    piece.querySelector('svg').classList.contains('white') === isWhite
  );

  // If there is no king, this function reports that it isn't in check.
  if (!king) return false;

  // Ask whether an opponent's piece attacks the king's square.
  return isSquareAttacked(
    king.closest('.square'), isWhite ? 'Black' : 'White'
  );
}

// Tests a move to see whether it would leave the moving side's king in check.
function moveLeavesKingInCheck(piece, toSquare) {
  // Remember where the moving piece starts and find a piece on the destination square.
  const originalSquare = piece.parentElement;
  const pieceAtDestination = toSquare.querySelector('.piece');

  // Find the moving piece's color so we know which king to check.
  const isWhite = piece.querySelector('svg').classList.contains('white');
  const color = isWhite ? 'White' : 'Black';

  // Temporarily remove the destination piece to model a capture and put the moving piece on said square.
  if (pieceAtDestination) pieceAtDestination.remove();
  toSquare.append(piece);

  // Check the board in this temporary position and restore the moving piece to where it started.
  const stillInCheck = isKingInCheck(color);
  originalSquare.append(piece);

  // Restore the destination piece, if the move would have captured one.
  if (pieceAtDestination) toSquare.append(pieceAtDestination);

  // Tell the move handler whether it should reject the move.
  return stillInCheck;
}


function hasAnyLegalMovesLeft(color) {
  const pieces = [...gameBoard.querySelectorAll('.piece')]
  const squares = [...gameBoard.querySelectorAll('.square')]

  for (const piece of pieces) {
    const isWhite = piece.querySelector('svg').classList.contains('white');
    const pieceColor = isWhite ? 'White' : "Black";

    if (pieceColor !== color) continue;

    for (const square of squares) {
      if (
        canPieceMoveTo(piece, square) &&
        !moveLeavesKingInCheck(piece, square)
      ) {
        return true;
      }
    }
  }

  return false;
}
