// Load the sound that plays after a successful move.
const moveSound = new Audio('woosh.mp3');
const moveHistory = document.querySelector('#move-history');

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

// Add a readable record after a move has passed all legality checks.
function recordMove(piece, fromSquare, toSquare) {
    const move = document.createElement('li');
    const pieceIcon = piece.querySelector('svg').cloneNode(true);
    pieceIcon.classList.add('move-history-piece');
    pieceIcon.setAttribute('aria-hidden', 'true');

    const moveText = document.createElement('span');
    moveText.textContent = `${fromSquare.dataset.coordinates} → ${toSquare.dataset.coordinates}`;

    move.append(pieceIcon, moveText);
    moveHistory.append(move);
    moveHistory.scrollTop = moveHistory.scrollHeight;
}

function isCurrentPlayerPiece(piece) {
    const isWhite = piece.querySelector('svg').classList.contains('white');
    return (currentPlayer === 'White') === isWhite;
}

// Move a piece if the destination square is allowed.
function movePieceToSquare(piece, square) {
    // Save the square the piece is currently on.
    const oldSquare = piece.parentElement;

    // Stop if the destination is missing, outside the board, or the same square.
    if (gameOver || !square || !gameBoard.contains(square) || square === oldSquare) return false;
    if (!isCurrentPlayerPiece(piece)) return false;

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

  // Add a flash to the king when it tries to move illegally in check.
  function flashUnsafeSquare(oldSquare) {
    oldSquare.classList.remove('square-flash');
    void oldSquare.offsetWidth;
    oldSquare.classList.add('square-flash');
    setTimeout(() => oldSquare.classList.remove('square-flash'), 600);
    }

  // Reject the move if it leaves this player's king in check.
  if (moveLeavesKingInCheck(piece, square)) {
    const movingSideIsWhite = piece.querySelector('svg').classList.contains('white');

    const king = [...gameBoard.querySelectorAll('.piece')].find(pieceOnBoard =>
      pieceOnBoard.dataset.piece === 'king' &&
      pieceOnBoard.querySelector('svg').classList.contains('white') === movingSideIsWhite
    );

    if (king) {
      flashUnsafeSquare(king.closest(".square"));
    }
   return false;
  }

    recordMove(piece, oldSquare, square);

    // If there is a piece there, move it to the captured pieces tray.
    if (target) {
        const tray = document.querySelector(
            `#captured-${currentPlayer.toLowerCase()}`
        );

        // Remember whether the captured piece is a king.
        const capturedKing = target.dataset.piece === 'king';

        tray.append(target);

        // Capturing a king ends the game and leaves the final position visible.
        if (capturedKing) {
            square.append(piece);
            gameBoard.querySelectorAll('.highlight').forEach(highlightedSquare => {
                highlightedSquare.classList.remove('highlight');
            });
            gameOver = true;
            playMoveSound();
            updateScore(currentPlayer);
            showWinner(currentPlayer);
            document.querySelector('#win-message').textContent = `${currentPlayer} wins!`;
            document.querySelector('#win-dialog').showModal();
            selected = null;
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
  console.log('White in check?', isKingInCheck('White'));
  console.log('Black in check?', isKingInCheck('Black'));
  return true;
}

// Clear the move list when starting a new game.
document.querySelector('#resetButton').addEventListener('click', () => {
    moveHistory.innerHTML = '';
});

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
    if (gameOver) return;

    const piece = event.target.closest('.piece');
    const square = piece?.closest('.square');

    // Ignore clicks that did not start on a piece on this board.
    if (
        !piece ||
        !square ||
        !gameBoard.contains(piece) ||
        event.button !== 0 ||
        !isCurrentPlayerPiece(piece)
    ) return;

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
