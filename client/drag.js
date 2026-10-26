// Load the sound that plays after a successful move.
const moveSound = new Audio('woosh.mp3');

// Store information about a piece while it is being dragged.
let activeDrag = null;

// Prevent the click after a drag from also selecting or moving a piece.
let suppressClick = false;
let suppressClickTimer;

// Play the move sound from the beginning.
function playMoveSound() {
    moveSound.currentTime = 0;
    // Catch sound errors so they don't stop the rest of the game.
    moveSound.play().catch(error => {
        console.error('Could not play the move sound:', error);
    });
}

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

    // If there is a piece there, move it to the captured pieces tray.
    if (target) {
        const tray = document.querySelector(
            `#captured-${currentPlayer.toLowerCase()}`
        );

        // Remember whether the captured piece is a king.
        const capturedKing = target.dataset.piece === 'king';

        tray.append(target);

        // Capturing a king ends the game and starts a fresh board.
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

    // Put the moving piece on the destination square.
  square.append(piece);
  // Remove the move highlights after the piece moves.
  gameBoard.querySelectorAll('.highlight').forEach(square => {
      square.classList.remove('highlight');
  });
    playMoveSound();

    // Switch whose turn it is and update the turn display.
    currentPlayer = currentPlayer === 'White' ? 'Black' : 'White';
    playerDisplay.textContent = currentPlayer;
    return true;
}

// End the current drag and remove its temporary visual effects.
function clearDrag() {
    if (!activeDrag) return;

    // Remove the drag preview and restore the original piece and square.
    if (activeDrag.preview) {
        activeDrag.piece.classList.remove('is-dragging');
        activeDrag.preview.remove();
        activeDrag.sourceSquare.classList.remove('selected');
    }
    activeDrag = null;
}

// Start tracking a drag when the player presses the left mouse button on a piece.
gameBoard.addEventListener('pointerdown', event => {
    const piece = event.target.closest('.piece');
    const square = piece?.closest('.square');

    // Ignore clicks that did not start on a piece on this board.
    if (!piece || !square || !gameBoard.contains(piece) || event.button !== 0) return;

    // Save the piece and pointer position so we can move its preview smoothly.
    activeDrag = {
        piece,
        sourceSquare: square,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - piece.getBoundingClientRect().left,
        offsetY: event.clientY - piece.getBoundingClientRect().top,
        preview: null
    };
});

// Move the preview along with the pointer while dragging.
document.addEventListener('pointermove', event => {
    // Ignore movement if no drag is happening or this is another pointer.
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

    // Wait for a small pointer movement before treating it as a drag.
    if (!activeDrag.preview) {
        const distance = Math.hypot(
            event.clientX - activeDrag.startX,
            event.clientY - activeDrag.startY
        );
        if (distance < 5) return;

        // Make a copy of the piece to show under the pointer.
        const bounds = activeDrag.piece.getBoundingClientRect();
        const preview = activeDrag.piece.cloneNode(true);
        preview.classList.add('drag-preview');
        preview.style.width = `${bounds.width}px`;
        preview.style.height = `${bounds.height}px`;

        // Keep the preview orientation consistent if the board is rotated.
        if (gameBoard.classList.contains('rotated')) {
            preview.classList.add('drag-preview-rotated');
        }

        // Show the preview and mark the original piece as being dragged.
        document.body.append(preview);
        activeDrag.preview = preview;
        activeDrag.piece.classList.add('is-dragging');
        activeDrag.sourceSquare.classList.add('selected');

        // Clear any piece that was selected by clicking before this drag.
        if (selected) {
            selected.parentElement.classList.remove('selected');
            selected = null;
        }
    }

    // Position the preview under the pointer, keeping the starting grab point.
    activeDrag.preview.style.left = `${event.clientX - activeDrag.offsetX}px`;
    activeDrag.preview.style.top = `${event.clientY - activeDrag.offsetY}px`;
});

// Finish the drag when the pointer is released.
document.addEventListener('pointerup', event => {
    // Ignore this event if there is no matching drag.
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

    // If the pointer barely moved, this was a click rather than a drag.
    if (!activeDrag.preview) {
        activeDrag = null;
        return;
    }

    // Find the board square under the pointer.
    const square = document.elementFromPoint(event.clientX, event.clientY)
        ?.closest('.square');
    const { piece, sourceSquare } = activeDrag;

    // Ignore the click event that the browser may send after releasing a drag.
    suppressClick = true;
    window.clearTimeout(suppressClickTimer);
    suppressClickTimer = window.setTimeout(() => {
        suppressClick = false;
    }, 0);

    // Remove the preview, then move the real piece if released on the board.
    clearDrag();
    if (square && gameBoard.contains(square)) {
        movePieceToSquare(piece, square);
    }

    // Remove the highlight from the square the piece started on.
    sourceSquare.classList.remove('selected');
});

// Clean up the preview if the browser cancels the drag.
document.addEventListener('pointercancel', event => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    clearDrag();
});

// Select a piece or move the selected piece when the player clicks the board.
gameBoard.addEventListener('click', event => {
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
        if (!piece) return;

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
              if (!hasFriendlyPiece && isKingMoveAllowed(fromSquare, targetSquare)) {
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

        return;
    }

    // Clicking the selected piece again unselects it.
    if (piece === selected) {
        selected.parentElement.classList.remove('selected');
        selected = null;
        return;
    }

    // Try to move the selected piece to the clicked square.
    const movingPiece = selected;
    const oldSquare = movingPiece.parentElement;
    movePieceToSquare(movingPiece, square);

    // Clear the old square's highlight and clear the selection.
    oldSquare.classList.remove('selected');
    selected = null;
});
