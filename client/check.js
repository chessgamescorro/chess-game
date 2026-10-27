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

  return false;
}

function isSquareAttacked(square, attackingColor) {
  const piece = [...gameBoard.querySelectorAll('.piece')];

  return piece.some(piece => {
    const isWhite = piece.querySelector('svg').classList.contains('white');
    const pieceColor = isWhite ? 'White' : "Black"

    return pieceColor === attackingColor && pieceAttackSquare(piece, square);
  })
}


function isKingInCheck(color) {
  const isWhite = color === 'White';

  const king = [...gameBoard.querySelectorAll('.piece')].find(piece =>
    piece.dataset.piece === 'king' &&
    piece.querySelector('svg').classList.contains('white') === isWhite
  );

  if (!king) return false;

  return isSquareAttacked(
    king.closest('.square'), isWhite ? 'Black' : 'White'
  );
}

function moveLeavesKingInCheck(piece, toSquare) {
  const originalSquare = piece.parentElement;
  const pieceAtDestination = toSquare.querySelector('.piece');

  const isWhite = piece.querySelector('svg').classList.contains('white');
  const color = isWhite ? 'White' : 'Black';

  if (pieceAtDestination) pieceAtDestination.remove();
  toSquare.append(piece);

  const stillInCheck = isKingInCheck(color);

  originalSquare.append(piece);
  if (pieceAtDestination) toSquare.append(pieceAtDestination);

  return stillInCheck;
}
