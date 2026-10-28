// Check whether the king moves one square in any direction.
function isKingMoveAllowed(fromSquare, toSquare) {
    // Read the start and destination columns, and find the distance between them.
    const columnDistance = Math.abs(
        Number(toSquare.dataset.column) - Number(fromSquare.dataset.column)
    );

    // Do the same for the rows.
    const rowDistance = Math.abs(
        Number(toSquare.dataset.row) - Number(fromSquare.dataset.row)
    );

    // Allow the move if it is at most one square in each direction,
    // and the king is not staying on its current square.
    return columnDistance <= 1 && rowDistance <= 1 &&
        columnDistance + rowDistance > 0;
}

// Allow castling only when the king and rook are unmoved and the king's path is safe.
function isCastlingAllowedKing(king, fromSquare, toSquare) {
    const homeRank = king.querySelector('svg').classList.contains('white') ? '1' : '8';
    const fileStep = Number(toSquare.dataset.column) - Number(fromSquare.dataset.column);

    // Castling starts from e1/e8 and moves exactly two squares on the same rank.
    if (fromSquare.dataset.file !== 'e' || fromSquare.dataset.rank !== homeRank ||
        toSquare.dataset.rank !== homeRank || Math.abs(fileStep) !== 2 || movedPieces.has(king)) return false;

    const kingSide = fileStep > 0;
    const rookFile = kingSide ? 'h' : 'a';
    const rook = gameBoard.querySelector(`.square[data-file="${rookFile}"][data-rank="${homeRank}"] .piece`);

    // The correct unmoved rook must still be in the corner.
    if (!rook || rook.dataset.piece !== 'rook' || movedPieces.has(rook) ||
        rook.querySelector('svg').classList.contains('white') !==
        king.querySelector('svg').classList.contains('white')) return false;

    // Squares between the king and rook must be empty (including b-file queenside).
    const emptyFiles = kingSide ? ['f', 'g'] : ['b', 'c', 'd'];
    if (emptyFiles.some(file => gameBoard.querySelector(
        `.square[data-file="${file}"][data-rank="${homeRank}"] .piece`
    ))) return false;

    // The king cannot castle out of, through, or into check.
    const ownColor = homeRank === '1' ? 'White' : 'Black';
    const enemy = ownColor === 'White' ? 'Black' : 'White';
    if (isKingInCheck(ownColor)) return false;
    const safeFiles = kingSide ? ['f', 'g'] : ['d', 'c'];
    return safeFiles.every(file => !isSquareAttacked(gameBoard.querySelector(
        `.square[data-file="${file}"][data-rank="${homeRank}"]`
    ), enemy));
}

// Move the rook to the square beside the king after the king's castle is accepted.
function moveCastlingRook(fromSquare, toSquare) {
    const kingSide = Number(toSquare.dataset.column) > Number(fromSquare.dataset.column);
    const rank = fromSquare.dataset.rank;
    const rookFrom = gameBoard.querySelector(
        `.square[data-file="${kingSide ? 'h' : 'a'}"][data-rank="${rank}"]`
    );
    const rookTo = gameBoard.querySelector(
        `.square[data-file="${kingSide ? 'f' : 'd'}"][data-rank="${rank}"]`
    );
    const rook = rookFrom.querySelector('.piece');
    rookTo.append(rook);
    movedPieces.add(rook);
}

// Check whether the bishop moves diagonally without jumping over pieces.
function isBishopMoveAllowed(fromSquare, toSquare) {
    // Find the distance between the start and destination columns and rows.
    const columnDistance = Math.abs(
        Number(toSquare.dataset.column) - Number(fromSquare.dataset.column)
    );

    // Do the same for the rows.
    const rowDistance = Math.abs(
        Number(toSquare.dataset.row) - Number(fromSquare.dataset.row)
    );

    // A bishop must move diagonally, and must actually move.
    if (columnDistance === 0 || columnDistance !== rowDistance) return false;

    // Work out which way the bishop moves across the board.
    const columnStep = Number(toSquare.dataset.column) > Number(fromSquare.dataset.column) ? 1 : -1;
    const rowStep = Number(toSquare.dataset.row) > Number(fromSquare.dataset.row) ? 1 : -1;

    // Check the squares between the bishop and its destination.
    for (let step = 1; step < columnDistance; step++) {
        const column = Number(fromSquare.dataset.column) + columnStep * step;
        const row = Number(fromSquare.dataset.row) + rowStep * step;
        const squareInWay = gameBoard.querySelector(
            `.square[data-column="${column}"][data-row="${row}"]`
        );

        if (squareInWay.querySelector('.piece')) return false;
    }

    return true;
}

// Check whether the knight moves in an L shape.
function isKnightMoveAllowed(fromSquare, toSquare) {
    // Find the distance between the start and destination columns and rows.
    const columnDistance = Math.abs(
        Number(toSquare.dataset.column) - Number(fromSquare.dataset.column)
    );

    // Do the same for the rows.
    const rowDistance = Math.abs(
        Number(toSquare.dataset.row) - Number(fromSquare.dataset.row)
    );

    // The knight moves two squares one way and one square the other way.
    return (columnDistance === 2 && rowDistance === 1) ||
        (columnDistance === 1 && rowDistance === 2);
}

// Check whether the pawn moves forward into an empty square.
function isPawnMoveAllowed(fromSquare, toSquare) {
    const piece = fromSquare.querySelector('.piece');
    const isWhite = piece.querySelector('svg').classList.contains('white');
    const direction = isWhite ? -1 : 1;
    const startRow = Number(fromSquare.dataset.row);
    const endRow = Number(toSquare.dataset.row);
    const columnDistance = Math.abs(
        Number(toSquare.dataset.column) - Number(fromSquare.dataset.column)
    );
    const rowDistance = endRow - startRow;

    // Pawns can only move straight forward into an empty square.
    if (columnDistance !== 0 || toSquare.querySelector('.piece')) return false;

    // A pawn can move forward one square.
    if (rowDistance === direction) return true;

    // A pawn can move two squares from its starting row if the middle is empty.
    const startingRow = isWhite ? 6 : 1;
    if (startRow === startingRow && rowDistance === direction * 2) {
        const middleRow = startRow + direction;
        const middleSquare = gameBoard.querySelector(
            `.square[data-column="${fromSquare.dataset.column}"][data-row="${middleRow}"]`
        );
        return !middleSquare.querySelector('.piece');
    }

    return false;
}

// Check whether the pawn is allowed to take a piece diagonally.
function isPawnDiagonalCaptureAllowed(fromSquare, toSquare) {
    const piece = fromSquare.querySelector('.piece');
    const target = toSquare.querySelector('.piece');
    const isWhite = piece.querySelector('svg').classList.contains('white');
    const direction = isWhite ? -1 : 1;

    const columnDistance = Math.abs(
        Number(toSquare.dataset.column) - Number(fromSquare.dataset.column)
    );
    const rowDistance = Number(toSquare.dataset.row) - Number(fromSquare.dataset.row);

    // A pawn can capture an opposing piece one square diagonally forward.
    if (!target || rowDistance !== direction || columnDistance !== 1) return false;

    const targetIsWhite = target.querySelector('svg').classList.contains('white');
    return isWhite !== targetIsWhite;
}

// Check whether the rook moves straight without jumping over pieces.
function isRookMoveAllowed(fromSquare, toSquare) {
    const startColumn = Number(fromSquare.dataset.column);
    const startRow = Number(fromSquare.dataset.row);
    const endColumn = Number(toSquare.dataset.column);
    const endRow = Number(toSquare.dataset.row);

    // A rook moves along the same row or the same column, and must move.
    if (startColumn !== endColumn && startRow !== endRow) return false;
    if (startColumn === endColumn && startRow === endRow) return false;

    // Find the direction the rook travels in each coordinate.
    const columnStep = Math.sign(endColumn - startColumn);
    const rowStep = Math.sign(endRow - startRow);

    // Check that every square between the rook and its destination is empty.
    let column = startColumn + columnStep;
    let row = startRow + rowStep;

    while (column !== endColumn || row !== endRow) {
        const squareInWay = gameBoard.querySelector(
            `.square[data-column="${column}"][data-row="${row}"]`
        );

        if (squareInWay.querySelector('.piece')) return false;

        column += columnStep;
        row += rowStep;
    }

    return true;
}

// Check whether the queen moves diagonally or straight without jumping over pieces.
function isQueenMoveAllowed(fromSquare, toSquare) {
    return isBishopMoveAllowed(fromSquare, toSquare) || isRookMoveAllowed(fromSquare, toSquare);
}
