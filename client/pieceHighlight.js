// Select a piece or move the selected piece when the player clicks the board.
    gameBoard.addEventListener('click', event => {
    if (gameOver) return;

    // A drag already handled this interaction, so ignore its follow-up click.
    if (suppressClick) {
      suppressClick = false;
      window.clearTimeout(suppressClickTimer);
      return;
    }

// Find the square and piece that were clicked.
    const square = event.target.closest('.square');
    const piece = event.target.closest('.piece');
    if (!square) return;

    // If nothing is selected yet, select the clicked piece.
    if (!selected) {
        if (!piece || !isCurrentPlayerPiece(piece)) return;

        selected = piece;
      square.classList.add('selected');

      // Highlight the king's possible moves.
      if (piece.dataset.piece === 'king') {
          const fromSquare = piece.closest('.square');
          const kingIsWhite = piece.querySelector('svg').classList.contains('white');
          const allSquares = gameBoard.querySelectorAll('.square');

          allSquares.forEach(targetSquare => {
              const pieceThere = targetSquare.querySelector('.piece');

              // Don't show a square occupied by a piece of the king's color.
              const hasFriendlyPiece = pieceThere &&
                  pieceThere.querySelector('svg').classList.contains('white') === kingIsWhite;

              // Highlight nearby squares that aren't occupied by a friendly piece.
            if (!hasFriendlyPiece &&
              isKingMoveAllowed(fromSquare, targetSquare) &&
              !moveLeavesKingInCheck(piece, targetSquare)
            ) {
                  targetSquare.classList.add('highlight');
              }
          });
      }

      // Highlight the bishop's possible moves.
      if (piece.dataset.piece === 'bishop') {
          const fromSquare = piece.closest('.square');
          const bishopIsWhite = piece.querySelector('svg').classList.contains('white');
          const allSquares = gameBoard.querySelectorAll('.square');

          allSquares.forEach(targetSquare => {
            const pieceThere = targetSquare.querySelector('.piece');

              const hasFriendlyPiece = pieceThere &&
                  pieceThere.querySelector('svg').classList.contains('white') === bishopIsWhite;

            if (!hasFriendlyPiece && isBishopMoveAllowed(fromSquare, targetSquare)) {
                  targetSquare.classList.add('highlight');
              }
          });
      }

      // Highlight the rooks possible moves.
      if (piece.dataset.piece === 'rook') {
          const fromSquare = piece.closest('.square');
          const rookIsWhite = piece.querySelector('svg').classList.contains('white');
          const allSquares = gameBoard.querySelectorAll('.square');

          allSquares.forEach(targetSquare => {
            const pieceThere = targetSquare.querySelector('.piece');

              const hasFriendlyPiece = pieceThere &&
                  pieceThere.querySelector('svg').classList.contains('white') === rookIsWhite;

            if (!hasFriendlyPiece && isRookMoveAllowed(fromSquare, targetSquare)) {
                  targetSquare.classList.add('highlight');
              }
          });
      }

      // Highlight the Knights possible moves.
      if (piece.dataset.piece === 'knight') {
          const fromSquare = piece.closest('.square');
          const knightIsWhite = piece.querySelector('svg').classList.contains('white');
          const allSquares = gameBoard.querySelectorAll('.square');

          allSquares.forEach(targetSquare => {
            const pieceThere = targetSquare.querySelector('.piece');

              const hasFriendlyPiece = pieceThere &&
                  pieceThere.querySelector('svg').classList.contains('white') === knightIsWhite;

            if (!hasFriendlyPiece && isKnightMoveAllowed(fromSquare, targetSquare)) {
                  targetSquare.classList.add('highlight');
              }
          });
      }

      // Highlight the pawns possible moves.
      if (piece.dataset.piece === 'pawn') {
          const fromSquare = piece.closest('.square');
          const pawnIsWhite = piece.querySelector('svg').classList.contains('white');
          const allSquares = gameBoard.querySelectorAll('.square');

          allSquares.forEach(targetSquare => {
            const pieceThere = targetSquare.querySelector('.piece');

              const hasFriendlyPiece = pieceThere &&
                  pieceThere.querySelector('svg').classList.contains('white') === pawnIsWhite;

            if (!hasFriendlyPiece && isPawnMoveAllowed(fromSquare, targetSquare)) {
                  targetSquare.classList.add('highlight');
              }
          });
      }

      // Highlight the queen's possible moves.
      if (piece.dataset.piece === 'queen') {
          const fromSquare = piece.closest('.square');
          const queenIsWhite = piece.querySelector('svg').classList.contains('white');
          const allSquares = gameBoard.querySelectorAll('.square');

          allSquares.forEach(targetSquare => {
            const pieceThere = targetSquare.querySelector('.piece');

              const hasFriendlyPiece = pieceThere &&
                  pieceThere.querySelector('svg').classList.contains('white') === queenIsWhite;

              if (!hasFriendlyPiece && isQueenMoveAllowed(fromSquare, targetSquare)) {
                  targetSquare.classList.add('highlight');
              }
          });
      }

        return;
    }

    // Clicking the selected piece again unselects it.
    if (piece === selected) {
      selected.parentElement.classList.remove('selected');
      gameBoard.querySelectorAll('.highlight').forEach(square => {
        square.classList.remove('highlight');
      });
      selected = null;
      return;
    }

    // Try to move the selected piece to the clicked square.
    const movingPiece = selected;
    const oldSquare = movingPiece.parentElement;
    movePieceToSquare(movingPiece, square);



      // Clear every possible-move marker when the current selection ends.
    gameBoard.querySelectorAll('.highlight').forEach(highlightedSquare => {
      highlightedSquare.classList.remove('highlight');
    });

    // Clear the old square's selection and clear the selected piece.
    oldSquare.classList.remove('selected');
    selected = null;
});
