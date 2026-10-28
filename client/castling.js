// Check every rule that is specific to castling before allowing the king's two-square move.
function isCastlingAllowedKing(king, fromSquare, toSquare) {
  // Castling is only a king move, and the king must still be on its starting square.
  if (king.dataset.piece !== 'king' || fromSquare.dataset.file !== 'e') return false;
  const homeRank = king.querySelector('svg').classList.contains('white') ? '1' : '8';
  if (fromSquare.dataset.rank !== homeRank || toSquare.dataset.rank !== homeRank) return false;
  if (movedPieces.has(king) || isKingInCheck(homeRank === '1' ? 'White' : 'Black')) return false;

  // A two-file move identifies which corner rook and empty path are involved.
  const fileStep = Number(toSquare.dataset.column) - Number(fromSquare.dataset.column);
  if (fileStep !== 2 && fileStep !== -2) return false;
  const kingSide = fileStep === 2;
  const rookFile = kingSide ? 'h' : 'a';
  const rook = gameBoard.querySelector(
    `.square[data-file="${rookFile}"][data-rank="${homeRank}"] .piece`
  );

  // The original rook must still be present, on the king's side, and unmoved.
  if (!rook || rook.dataset.piece !== 'rook' || movedPieces.has(rook)) return false;
  if (rook.querySelector('svg').classList.contains('white') !==
      king.querySelector('svg').classList.contains('white')) return false;

  // Every square between king and rook must be empty; queenside includes b-file.
  const emptyFiles = kingSide ? ['f', 'g'] : ['b', 'c', 'd'];
  for (const file of emptyFiles) {
    const square = gameBoard.querySelector(
      `.square[data-file="${file}"][data-rank="${homeRank}"]`
    );
    if (square.querySelector('.piece')) return false;
  }

  // The king may not cross or land on a square attacked by the opponent.
  const enemy = homeRank === '1' ? 'Black' : 'White';
  const kingPath = kingSide ? ['f', 'g'] : ['d', 'c'];
  return kingPath.every(file => {
    const square = gameBoard.querySelector(
      `.square[data-file="${file}"][data-rank="${homeRank}"]`
    );
    return !isSquareAttacked(square, enemy);
  });
}

// When a legal castle is made, move the rook next to the king as part of that turn.
function moveCastlingRook(king, fromSquare, toSquare) {
  const kingSide = Number(toSquare.dataset.column) > Number(fromSquare.dataset.column);
  const rank = fromSquare.dataset.rank;
  const rookFromFile = kingSide ? 'h' : 'a';
  const rookToFile = kingSide ? 'f' : 'd';
  const rookFrom = gameBoard.querySelector(
    `.square[data-file="${rookFromFile}"][data-rank="${rank}"]`
  );
  const rookTo = gameBoard.querySelector(
    `.square[data-file="${rookToFile}"][data-rank="${rank}"]`
  );
  const rook = rookFrom.querySelector('.piece');

  // Moving the existing rook element preserves its color and piece markup.
  rookTo.append(rook);
  movedPieces.add(rook);
}
