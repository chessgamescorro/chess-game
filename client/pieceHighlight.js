function highlightMoves(piece) {
    const fromSquare = piece.closest('.square');
    const isWhite = piece.querySelector('svg').classList.contains('white');

    gameBoard.querySelectorAll('.square').forEach(targetSquare => {
        const pieceThere = targetSquare.querySelector('.piece');
        const hasFriendlyPiece = pieceThere &&
            pieceThere.querySelector('svg').classList.contains('white') === isWhite;

        if (hasFriendlyPiece) return;

        // Use the same complete legality checks as dragging, including castling.
        const canMove = canPieceMoveTo(piece, targetSquare) &&
            !moveLeavesKingInCheck(piece, targetSquare);

        if (canMove) targetSquare.classList.add('highlight');
    });
}

// Select a piece or move the selected piece when the player clicks the board.
gameBoard.addEventListener('click', event => {
    if (gameOver) return;

    // A drag already handled this interaction, so ignore its follow-up click.
    if (suppressClick) {
        suppressClick = false;
        window.clearTimeout(suppressClickTimer);
        return;
    }

    const square = event.target.closest('.square');
    const piece = event.target.closest('.piece');
    if (!square) return;

    // If nothing is selected yet, select the clicked piece.
    if (!selected) {
        if (!piece || !isCurrentPlayerPiece(piece)) return;

        selected = piece;
        square.classList.add('selected');
        highlightMoves(piece);
        return;
    }

    // Clicking the selected piece again unselects it.
    if (piece === selected) {
        selected.parentElement.classList.remove('selected');
        gameBoard.querySelectorAll('.highlight').forEach(highlightedSquare => {
            highlightedSquare.classList.remove('highlight');
        });
        selected = null;
        return;
    }

    // Try to move the selected piece to the clicked square.
    const movingPiece = selected;
    const oldSquare = movingPiece.parentElement;
    movePieceToSquare(movingPiece, square);

    gameBoard.querySelectorAll('.highlight').forEach(highlightedSquare => {
        highlightedSquare.classList.remove('highlight');
    });
    oldSquare.classList.remove('selected');
    selected = null;
});
